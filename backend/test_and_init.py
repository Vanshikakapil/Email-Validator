import asyncio
from sqlalchemy import text
from db import init_models, engine

async def test_and_init():
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
            print("✅ Connected to the database.")

        await init_models()
        print("✅ Tables created successfully.")

    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    asyncio.run(test_and_init())
