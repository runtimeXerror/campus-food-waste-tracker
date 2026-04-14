import ssl

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# Neon requires SSL — build an SSL context for asyncpg
connect_args = {}
if "neon.tech" in settings.DATABASE_URL or "neon" in settings.DATABASE_URL:
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    connect_args["ssl"] = ssl_ctx

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_size=5,         # Neon free tier has connection limits
    max_overflow=3,
    pool_pre_ping=True,
    connect_args=connect_args,
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass
