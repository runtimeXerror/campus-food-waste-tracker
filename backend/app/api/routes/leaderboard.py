import random
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.team import Team, TeamMember
from app.models.waste_log import WasteLog

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("")
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    now = datetime.now(timezone.utc)
    current_start = now - timedelta(days=7)
    previous_start = now - timedelta(days=14)

    result = await db.execute(select(Team))
    teams = result.scalars().all()

    leaderboard = []
    for team in teams:
        # Get team member user_ids
        members_result = await db.execute(
            select(TeamMember.user_id).where(TeamMember.team_id == team.id)
        )
        member_ids = [row[0] for row in members_result.all()]

        if not member_ids:
            continue

        # Current week waste
        curr_result = await db.execute(
            select(func.coalesce(func.sum(WasteLog.quantity_kg), 0)).where(
                WasteLog.user_id.in_(member_ids),
                WasteLog.logged_at >= current_start,
            )
        )
        current_total = float(curr_result.scalar())

        # Previous week waste
        prev_result = await db.execute(
            select(func.coalesce(func.sum(WasteLog.quantity_kg), 0)).where(
                WasteLog.user_id.in_(member_ids),
                WasteLog.logged_at >= previous_start,
                WasteLog.logged_at < current_start,
            )
        )
        prev_total = float(prev_result.scalar())

        reduction = (
            round(((prev_total - current_total) / prev_total) * 100, 1)
            if prev_total > 0
            else 0.0
        )

        # Total logs count
        log_count_result = await db.execute(
            select(func.count(WasteLog.id)).where(
                WasteLog.user_id.in_(member_ids),
                WasteLog.logged_at >= current_start,
            )
        )
        total_logs = int(log_count_result.scalar())

        leaderboard.append({
            "team_name": team.name,
            "dining_hall": team.dining_hall,
            "reduction_percent": max(reduction, 0),
            "streak_days": random.randint(2, 14),  # Simplified; real app tracks daily
            "total_logs": total_logs,
        })

    # Sort by reduction
    leaderboard.sort(key=lambda x: x["reduction_percent"], reverse=True)
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1

    return leaderboard
