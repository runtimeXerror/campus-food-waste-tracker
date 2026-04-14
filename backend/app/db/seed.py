"""Seed the database with sample data for development."""
import asyncio
import random
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, text

from app.db.session import async_session_maker, engine, Base
from app.models.user import User
from app.models.waste_log import WasteLog
from app.models.team import Team, TeamMember
from app.core.security import get_password_hash

DINING_HALLS = ["Main Dining Hall", "North Cafeteria", "South Commons", "West Bistro"]
MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"]
FOOD_CATEGORIES = [
    "Grains & Bread", "Dairy", "Fruits", "Vegetables",
    "Meat & Protein", "Beverages", "Desserts", "Prepared Meals",
]
WASTE_REASONS = [
    "Overcooked", "Undercooked", "Too Much Served", "Didn't Like Taste",
    "Expired", "Contaminated", "Leftover from Event", "Other",
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as db:
        # Check if already seeded
        result = await db.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping.")
            return

        print("Seeding database...")

        # Create users
        users = []
        admin = User(
            email="admin@campus.edu",
            username="admin",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role="admin",
        )
        db.add(admin)
        users.append(admin)

        for i in range(1, 21):
            user = User(
                email=f"student{i}@campus.edu",
                username=f"student{i}",
                full_name=f"Student {i}",
                hashed_password=get_password_hash("password123"),
                role="student",
            )
            db.add(user)
            users.append(user)

        await db.flush()

        # Create teams
        team_data = [
            ("EcoWarriors", "North Cafeteria"),
            ("Green Plates", "Main Dining Hall"),
            ("Zero Waste Squad", "South Commons"),
            ("Clean Plate Club", "West Bistro"),
            ("Food Savers", "Main Dining Hall"),
        ]
        teams = []
        for name, hall in team_data:
            team = Team(name=name, dining_hall=hall)
            db.add(team)
            teams.append(team)

        await db.flush()

        # Assign users to teams
        for i, user in enumerate(users[1:], 0):
            team = teams[i % len(teams)]
            member = TeamMember(user_id=user.id, team_id=team.id)
            db.add(member)

        # Generate 60 days of waste log data
        now = datetime.now(timezone.utc)
        logs_count = 0

        for day_offset in range(59, -1, -1):
            date = now - timedelta(days=day_offset)
            day_of_week = date.weekday()
            is_weekend = day_of_week >= 5
            base_waste = 120 if is_weekend else 200
            trend_factor = max(0.6, 1 - day_offset * 0.004)

            for hall in DINING_HALLS:
                hall_mult = 1.5 if hall == "Main Dining Hall" else 1.2 if hall == "North Cafeteria" else 1.0
                for meal in MEAL_TYPES:
                    meal_mult = (
                        1.4 if meal == "Lunch"
                        else 1.3 if meal == "Dinner"
                        else 0.8 if meal == "Breakfast"
                        else 0.4
                    )
                    quantity = round(
                        base_waste * hall_mult * meal_mult * trend_factor
                        * (0.7 + random.random() * 0.6),
                        1,
                    )
                    category = random.choice(FOOD_CATEGORIES)
                    reason = random.choice(WASTE_REASONS)
                    user = random.choice(users)

                    log = WasteLog(
                        user_id=user.id,
                        dining_hall=hall,
                        meal_type=meal,
                        food_category=category,
                        quantity_kg=quantity,
                        reason=reason,
                        co2_impact_kg=round(quantity * 2.5, 1),
                        cost_impact_usd=round(quantity * 3.2, 2),
                        logged_at=date.replace(
                            hour=random.randint(7, 21),
                            minute=random.randint(0, 59),
                        ),
                    )
                    db.add(log)
                    logs_count += 1

        await db.commit()
        print(f"Seeded {len(users)} users, {len(teams)} teams, {logs_count} waste logs.")


if __name__ == "__main__":
    asyncio.run(seed())
