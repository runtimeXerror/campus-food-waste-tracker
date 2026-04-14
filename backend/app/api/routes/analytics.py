from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.services.analytics import analytics_engine

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/trends")
async def get_trends(
    days: int = Query(30, ge=1, le=365),
    dining_hall: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_engine.get_trends(db, days=days, dining_hall=dining_hall)


@router.get("/heatmap")
async def get_heatmap(
    days: int = Query(7, ge=1, le=365),
    dining_hall: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_engine.get_heatmap(db, days=days, dining_hall=dining_hall)


@router.get("/reasons")
async def get_reasons(
    days: int = Query(7, ge=1, le=365),
    dining_hall: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await analytics_engine.get_reason_breakdown(db, days=days, dining_hall=dining_hall)
