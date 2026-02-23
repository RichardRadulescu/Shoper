from app.models.user import User
from app.hashing import hash_password

async def create_admin_user():
    email = "admin@example.com"
    password = "admin"

    existing = await User.find_one(User.email == email)
    if existing:
        print("Admin already exists.")
        return

    admin = User(
        name="Admin",
        email=email,
        hashed_password=hash_password(password),
        role="admin"
    )

    await admin.insert()
    print("Admin user created:", email)
