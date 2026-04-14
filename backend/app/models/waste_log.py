from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class WasteLog(Base):
    __tablename__ = "waste_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    dining_hall: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    meal_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    food_category: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity_kg: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str] = mapped_column(String(100), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    co2_impact_kg: Mapped[float] = mapped_column(Float, nullable=False)
    cost_impact_usd: Mapped[float] = mapped_column(Float, nullable=False)
    logged_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    user = relationship("User", back_populates="waste_logs")
