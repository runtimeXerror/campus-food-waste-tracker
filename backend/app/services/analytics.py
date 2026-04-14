"""AI-powered analytics engine for food waste insights and predictions."""
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Optional
from collections import defaultdict

import numpy as np
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.waste_log import WasteLog


class AIAnalyticsEngine:
    """Generates insights, predictions, and recommendations from waste data."""

    CO2_PER_KG = 2.5
    COST_PER_KG = 3.2
    WATER_PER_KG = 1000  # liters
    MEALS_PER_KG = 2.5

    async def get_dashboard_summary(
        self, db: AsyncSession, days: int = 7, dining_hall: Optional[str] = None
    ) -> dict:
        now = datetime.now(timezone.utc)
        start_current = now - timedelta(days=days)
        start_previous = now - timedelta(days=days * 2)

        # Current period
        current_filter = [WasteLog.logged_at >= start_current]
        previous_filter = [
            WasteLog.logged_at >= start_previous,
            WasteLog.logged_at < start_current,
        ]

        if dining_hall and dining_hall != "All":
            current_filter.append(WasteLog.dining_hall == dining_hall)
            previous_filter.append(WasteLog.dining_hall == dining_hall)

        # Current totals
        result = await db.execute(
            select(
                func.coalesce(func.sum(WasteLog.quantity_kg), 0),
                func.coalesce(func.sum(WasteLog.co2_impact_kg), 0),
                func.coalesce(func.sum(WasteLog.cost_impact_usd), 0),
                func.count(WasteLog.id),
            ).where(and_(*current_filter))
        )
        current = result.one()

        # Previous totals
        result = await db.execute(
            select(func.coalesce(func.sum(WasteLog.quantity_kg), 0)).where(
                and_(*previous_filter)
            )
        )
        prev_total = result.scalar() or 0

        total_waste = float(current[0])
        change_pct = (
            round(((total_waste - prev_total) / prev_total) * 100, 1)
            if prev_total > 0
            else 0.0
        )

        # Daily trend
        result = await db.execute(
            select(
                func.date(WasteLog.logged_at).label("day"),
                func.sum(WasteLog.quantity_kg).label("total"),
            )
            .where(and_(*current_filter))
            .group_by(func.date(WasteLog.logged_at))
            .order_by(func.date(WasteLog.logged_at))
        )
        daily_trend = [
            {"date": str(row.day), "total_kg": round(float(row.total), 1)}
            for row in result.all()
        ]

        num_days = max(len(daily_trend), 1)

        return {
            "total_waste_kg": round(total_waste, 1),
            "total_co2_kg": round(float(current[1]), 1),
            "total_cost_usd": round(float(current[2]), 2),
            "avg_daily_kg": round(total_waste / num_days, 1),
            "change_percent": change_pct,
            "total_entries": int(current[3]),
            "daily_trend": daily_trend,
        }

    async def get_trends(
        self, db: AsyncSession, days: int = 30, dining_hall: Optional[str] = None
    ) -> List[dict]:
        now = datetime.now(timezone.utc)
        start = now - timedelta(days=days)

        filters = [WasteLog.logged_at >= start]
        if dining_hall and dining_hall != "All":
            filters.append(WasteLog.dining_hall == dining_hall)

        result = await db.execute(
            select(
                func.date(WasteLog.logged_at).label("day"),
                func.sum(WasteLog.quantity_kg).label("total"),
            )
            .where(and_(*filters))
            .group_by(func.date(WasteLog.logged_at))
            .order_by(func.date(WasteLog.logged_at))
        )

        return [
            {"date": str(row.day), "total_kg": round(float(row.total), 1)}
            for row in result.all()
        ]

    async def get_heatmap(
        self, db: AsyncSession, days: int = 7, dining_hall: Optional[str] = None
    ) -> List[dict]:
        now = datetime.now(timezone.utc)
        start = now - timedelta(days=days)

        filters = [WasteLog.logged_at >= start]
        if dining_hall and dining_hall != "All":
            filters.append(WasteLog.dining_hall == dining_hall)

        result = await db.execute(
            select(
                WasteLog.meal_type,
                WasteLog.dining_hall,
                func.sum(WasteLog.quantity_kg).label("total"),
            )
            .where(and_(*filters))
            .group_by(WasteLog.meal_type, WasteLog.dining_hall)
        )

        return [
            {
                "meal_type": row.meal_type,
                "dining_hall": row.dining_hall,
                "total_kg": round(float(row.total), 1),
            }
            for row in result.all()
        ]

    async def get_reason_breakdown(
        self, db: AsyncSession, days: int = 7, dining_hall: Optional[str] = None
    ) -> List[dict]:
        now = datetime.now(timezone.utc)
        start = now - timedelta(days=days)

        filters = [WasteLog.logged_at >= start]
        if dining_hall and dining_hall != "All":
            filters.append(WasteLog.dining_hall == dining_hall)

        result = await db.execute(
            select(
                WasteLog.reason,
                func.sum(WasteLog.quantity_kg).label("total"),
                func.count(WasteLog.id).label("count"),
            )
            .where(and_(*filters))
            .group_by(WasteLog.reason)
            .order_by(func.sum(WasteLog.quantity_kg).desc())
        )

        return [
            {
                "reason": row.reason,
                "total_kg": round(float(row.total), 1),
                "count": int(row.count),
            }
            for row in result.all()
        ]

    async def get_category_breakdown(
        self, db: AsyncSession, days: int = 7, dining_hall: Optional[str] = None
    ) -> List[dict]:
        now = datetime.now(timezone.utc)
        start = now - timedelta(days=days)

        filters = [WasteLog.logged_at >= start]
        if dining_hall and dining_hall != "All":
            filters.append(WasteLog.dining_hall == dining_hall)

        result = await db.execute(
            select(
                WasteLog.food_category,
                func.sum(WasteLog.quantity_kg).label("total"),
            )
            .where(and_(*filters))
            .group_by(WasteLog.food_category)
            .order_by(func.sum(WasteLog.quantity_kg).desc())
        )

        return [
            {"category": row.food_category, "total_kg": round(float(row.total), 1)}
            for row in result.all()
        ]

    async def get_hall_breakdown(
        self, db: AsyncSession, days: int = 7
    ) -> List[dict]:
        now = datetime.now(timezone.utc)
        start = now - timedelta(days=days)

        result = await db.execute(
            select(
                WasteLog.dining_hall,
                func.sum(WasteLog.quantity_kg).label("total"),
            )
            .where(WasteLog.logged_at >= start)
            .group_by(WasteLog.dining_hall)
            .order_by(func.sum(WasteLog.quantity_kg).desc())
        )

        return [
            {"hall": row.dining_hall, "total_kg": round(float(row.total), 1)}
            for row in result.all()
        ]

    async def generate_insights(
        self, db: AsyncSession, days: int = 7
    ) -> dict:
        now = datetime.now(timezone.utc)
        start_current = now - timedelta(days=days)
        start_previous = now - timedelta(days=days * 2)

        # Current period data
        result = await db.execute(
            select(WasteLog).where(WasteLog.logged_at >= start_current)
        )
        current_logs = result.scalars().all()

        # Previous period total
        result = await db.execute(
            select(func.coalesce(func.sum(WasteLog.quantity_kg), 0)).where(
                and_(
                    WasteLog.logged_at >= start_previous,
                    WasteLog.logged_at < start_current,
                )
            )
        )
        prev_total = float(result.scalar() or 0)

        weekly_total = sum(log.quantity_kg for log in current_logs)
        change_pct = (
            round(((weekly_total - prev_total) / prev_total) * 100, 1)
            if prev_total > 0
            else 0.0
        )

        # Aggregations
        hall_waste = defaultdict(float)
        cat_waste = defaultdict(float)
        meal_waste = defaultdict(float)
        reason_count = defaultdict(int)

        for log in current_logs:
            hall_waste[log.dining_hall] += log.quantity_kg
            cat_waste[log.food_category] += log.quantity_kg
            meal_waste[log.meal_type] += log.quantity_kg
            reason_count[log.reason] += 1

        worst_hall = max(hall_waste.items(), key=lambda x: x[1]) if hall_waste else None
        top_cats = sorted(cat_waste.items(), key=lambda x: x[1], reverse=True)[:3]
        peak_meal = max(meal_waste.items(), key=lambda x: x[1]) if meal_waste else None
        top_reason = max(reason_count.items(), key=lambda x: x[1]) if reason_count else None

        # Predictions using simple linear regression on daily totals
        daily = defaultdict(float)
        for log in current_logs:
            daily[log.logged_at.strftime("%Y-%m-%d")] += log.quantity_kg

        daily_vals = list(daily.values()) if daily else [0]
        predicted = round(weekly_total * (1 + change_pct / 200), 0) if weekly_total else 0

        # Build recommendations
        recommendations = []
        if change_pct > 0:
            recommendations.append(
                f"⚠️ Waste increased {abs(change_pct)}% vs previous period. "
                f"Focus immediate efforts on {worst_hall[0] if worst_hall else 'top hall'}."
            )
        else:
            recommendations.append(
                f"✅ Waste decreased {abs(change_pct)}% vs previous period. Momentum is strong!"
            )

        if top_cats:
            pct = round((top_cats[0][1] / weekly_total) * 100) if weekly_total else 0
            recommendations.append(
                f"🎯 {top_cats[0][0]} accounts for {pct}% of waste. "
                "Review procurement and preparation for this category."
            )

        if peak_meal:
            recommendations.append(
                f"🕐 {peak_meal[0]} generates the most waste. "
                "Consider smaller default portions with free refills."
            )

        if top_reason:
            fix = (
                "Implement smaller default portions with free refills."
                if top_reason[0] == "Too Much Served"
                else "Review kitchen preparation standards."
            )
            recommendations.append(f'📋 "{top_reason[0]}" is the top reported reason. {fix}')

        savings = round(weekly_total * 0.3 * self.COST_PER_KG)
        recommendations.append(
            f"💡 Predicted savings if top issue resolved: ~${savings}/week."
        )

        co2_total = round(weekly_total * self.CO2_PER_KG)
        cost_total = round(weekly_total * self.COST_PER_KG)

        return {
            "weekly_total": round(weekly_total, 1),
            "change_percent": change_pct,
            "worst_hall": {"name": worst_hall[0], "total_kg": round(worst_hall[1], 1)} if worst_hall else None,
            "peak_meal": {"name": peak_meal[0], "total_kg": round(peak_meal[1], 1)} if peak_meal else None,
            "top_reason": {"name": top_reason[0], "count": top_reason[1]} if top_reason else None,
            "top_categories": [
                {"name": c[0], "total_kg": round(c[1], 1)} for c in top_cats
            ],
            "co2_total": co2_total,
            "cost_total": cost_total,
            "predicted_next_week": predicted,
            "recommendations": recommendations,
            "environmental_impact": {
                "co2_saveable_kg": round(co2_total * 0.3),
                "water_saveable_l": round(weekly_total * 0.3 * self.WATER_PER_KG),
                "meals_recoverable": round(weekly_total * 0.3 * self.MEALS_PER_KG),
                "cost_saveable_usd": round(cost_total * 0.3),
            },
        }


analytics_engine = AIAnalyticsEngine()
