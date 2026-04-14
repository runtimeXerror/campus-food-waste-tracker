from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, require_auth
from app.models.user import User
from app.models.waste_log import WasteLog
from app.schemas.schemas import WasteLogCreate, WasteLogResponse, WasteLogListResponse

router = APIRouter(prefix="/waste-logs", tags=["Waste Logs"])


@router.post("", response_model=WasteLogResponse, status_code=201)
async def create_waste_log(
    data: WasteLogCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_auth),
):
    log = WasteLog(
        user_id=user.id,
        dining_hall=data.dining_hall,
        meal_type=data.meal_type,
        food_category=data.food_category,
        quantity_kg=data.quantity_kg,
        reason=data.reason,
        notes=data.notes,
        co2_impact_kg=round(data.quantity_kg * 2.5, 1),
        cost_impact_usd=round(data.quantity_kg * 3.2, 2),
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return WasteLogResponse.model_validate(log)


@router.get("", response_model=WasteLogListResponse)
async def list_waste_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    dining_hall: Optional[str] = None,
    meal_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    filters = []
    if dining_hall and dining_hall != "All":
        filters.append(WasteLog.dining_hall == dining_hall)
    if meal_type:
        filters.append(WasteLog.meal_type == meal_type)

    # Count
    count_q = select(func.count(WasteLog.id))
    if filters:
        count_q = count_q.where(and_(*filters))
    result = await db.execute(count_q)
    total = result.scalar()

    # Fetch page
    q = (
        select(WasteLog)
        .order_by(WasteLog.logged_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    if filters:
        q = q.where(and_(*filters))

    result = await db.execute(q)
    logs = result.scalars().all()

    return WasteLogListResponse(
        items=[WasteLogResponse.model_validate(log) for log in logs],
        total=total,
        page=page,
        page_size=page_size,
    )
