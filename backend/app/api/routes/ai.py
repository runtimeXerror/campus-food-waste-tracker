from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.services.analytics import analytics_engine

router = APIRouter(prefix="/ai", tags=["AI Insights"])


@router.get("/insights")
async def get_insights(
    days: int = Query(7, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    return await analytics_engine.generate_insights(db, days=days)
