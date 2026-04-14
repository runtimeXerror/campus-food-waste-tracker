from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ─── Auth Schemas ─────────────────────────────────────────────
class UserRegister(BaseModel):
    email: str = Field(..., max_length=255)
    username: str = Field(..., min_length=3, max_length=100)
    full_name: str = Field(..., max_length=255)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Waste Log Schemas ────────────────────────────────────────
class WasteLogCreate(BaseModel):
    dining_hall: str = Field(..., max_length=100)
    meal_type: str = Field(..., max_length=50)
    food_category: str = Field(..., max_length=100)
    quantity_kg: float = Field(..., gt=0)
    reason: str = Field(..., max_length=100)
    notes: Optional[str] = None


class WasteLogResponse(BaseModel):
    id: int
    user_id: int
    dining_hall: str
    meal_type: str
    food_category: str
    quantity_kg: float
    reason: str
    notes: Optional[str]
    co2_impact_kg: float
    cost_impact_usd: float
    logged_at: datetime

    class Config:
        from_attributes = True


class WasteLogListResponse(BaseModel):
    items: List[WasteLogResponse]
    total: int
    page: int
    page_size: int


# ─── Dashboard / Analytics Schemas ────────────────────────────
class DashboardSummary(BaseModel):
    total_waste_kg: float
    total_co2_kg: float
    total_cost_usd: float
    avg_daily_kg: float
    change_percent: float
    total_entries: int
    daily_trend: List[dict]


class HeatmapCell(BaseModel):
    meal_type: str
    dining_hall: str
    total_kg: float


class ReasonBreakdown(BaseModel):
    reason: str
    total_kg: float
    count: int


class TrendPoint(BaseModel):
    date: str
    total_kg: float


# ─── AI Insights Schemas ─────────────────────────────────────
class AIInsight(BaseModel):
    weekly_total: float
    change_percent: float
    worst_hall: Optional[dict]
    peak_meal: Optional[dict]
    top_reason: Optional[dict]
    top_categories: List[dict]
    co2_total: float
    cost_total: float
    predicted_next_week: float
    recommendations: List[str]
    environmental_impact: dict


# ─── Leaderboard Schemas ─────────────────────────────────────
class LeaderboardEntry(BaseModel):
    rank: int
    team_name: str
    dining_hall: str
    reduction_percent: float
    streak_days: int
    total_logs: int
