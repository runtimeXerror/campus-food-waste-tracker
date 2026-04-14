from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.services.analytics import analytics_engine

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_summary(
    days: int = Query(7, ge=1, le=365),
    dining_hall: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_engine.get_dashboard_summary(db, days=days, dining_hall=dining_hall)


@router.get("/halls")
async def get_hall_breakdown(
    days: int = Query(7, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    return await analytics_engine.get_hall_breakdown(db, days=days)


@router.get("/categories")
async def get_category_breakdown(
    days: int = Query(7, ge=1, le=365),
    dining_hall: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_engine.get_category_breakdown(db, days=days, dining_hall=dining_hall)
