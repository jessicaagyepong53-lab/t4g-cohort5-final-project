from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone

from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    TokenResponse
)

from app.security import (
    pwd_context,
    verify_password,
    create_access_token,
    get_current_user,
    require_roles
)

from app.database.connection import db


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate):

    # Check if email already exists
    existing_user = db.users.find_one(
        email = user.email.lower()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists."
        )

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create user document
    now = datetime.now(timezone.utc)

    new_user = {
    "full_name": user.full_name,
    "email": user.email.lower(),
    "password": hashed_password,
    "role": "patient",
    "phone": user.phone,
    "is_active": True,
    "created_at": now,
    "updated_at": now
  }

    if not existing_user.get("is_active", True):
     raise HTTPException(
        status_code=403,
        detail="This account has been deactivated."
    )    

    # Save user to MongoDB
    result = db.users.insert_one(new_user)

    return {
        "id": str(result.inserted_id),
        "full_name": new_user["full_name"],
        "email": new_user["email"],
        "role": new_user["role"],
        "phone": new_user["phone"]
    }


@router.post("/login", response_model=TokenResponse)
def login_user(user: UserLogin):

    # Find user by email
    existing_user = db.users.find_one({
        "email": user.email
    })

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Verify password
    password_is_valid = verify_password(
        user.password,
        existing_user["password"]
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Create JWT access token
    access_token = create_access_token({
        "sub": str(existing_user["_id"]),
        "role": existing_user["role"]
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_my_profile(
    current_user: dict = Depends(get_current_user)
):
    return {
        "message": "You are authenticated!",
        "user_id": current_user["user_id"],
        "role": current_user["role"]
    }


@router.get("/admin-test")
def admin_test(
    current_user: dict = Depends(require_roles("admin"))
):
    return {
        "message": "You are Welcome, Administrator!",
        "user_id": current_user["user_id"],
        "role": current_user["role"]
    }