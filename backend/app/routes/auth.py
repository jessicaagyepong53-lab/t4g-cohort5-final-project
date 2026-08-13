from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserResponse
from app.database.connection import db
from passlib.context import CryptContext

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate):

    # Check if email already exists
    existing_user = db.users.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists."
        )

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create user document
    new_user = {
        "full_name": user.full_name,
        "email": user.email,
        "password": hashed_password,
        "role": "patient",
        "phone": user.phone
    }

    # Save user to MongoDB
    result = db.users.insert_one(new_user)

    return {
        "id": str(result.inserted_id),
        "full_name": new_user["full_name"],
        "email": new_user["email"],
        "role": new_user["role"],
        "phone": new_user["phone"]
    }