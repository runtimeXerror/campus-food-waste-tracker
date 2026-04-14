"""initial tables

Revision ID: 001
Revises:
Create Date: 2025-01-01 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("username", sa.String(100), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), server_default="student"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_username", "users", ["username"], unique=True)

    op.create_table(
        "waste_logs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("dining_hall", sa.String(100), nullable=False),
        sa.Column("meal_type", sa.String(50), nullable=False),
        sa.Column("food_category", sa.String(100), nullable=False),
        sa.Column("quantity_kg", sa.Float(), nullable=False),
        sa.Column("reason", sa.String(100), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("co2_impact_kg", sa.Float(), nullable=False),
        sa.Column("cost_impact_usd", sa.Float(), nullable=False),
        sa.Column("logged_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_waste_logs_user_id", "waste_logs", ["user_id"])
    op.create_index("ix_waste_logs_dining_hall", "waste_logs", ["dining_hall"])
    op.create_index("ix_waste_logs_meal_type", "waste_logs", ["meal_type"])
    op.create_index("ix_waste_logs_logged_at", "waste_logs", ["logged_at"])

    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column("dining_hall", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "team_members",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("team_id", sa.Integer(), sa.ForeignKey("teams.id"), nullable=False),
        sa.Column("joined_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("team_members")
    op.drop_table("teams")
    op.drop_table("waste_logs")
    op.drop_table("users")
