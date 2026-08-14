from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database.connection import db
from app.security import require_roles


router = APIRouter(
    prefix="/api/admin",
    tags=["Administration"]
)


@router.get("/users")
def get_all_users(
    current_user: dict = Depends(require_roles("admin"))
):
    users = db.users.find(
        {},
        {
            "password": 0
        }
    )

    return [
        {
            "id": str(user["_id"]),
            "full_name": user.get("full_name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "phone": user.get("phone"),
            "is_active": user.get("is_active", True),
            "created_at": user.get("created_at"),
        }
        for user in users
    ]


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: str,
    role: str,
    current_user: dict = Depends(require_roles("admin"))
):
    allowed_roles = {
        "patient",
        "doctor",
        "nurse",
        "admin",
        "management"
    }

    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid user role."
        )

    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID."
        )

    result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": role}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "message": "User role updated successfully.",
        "user_id": user_id,
        "role": role
    }


@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: str,
    is_active: bool,
    current_user: dict = Depends(require_roles("admin"))
):
    if user_id == current_user["user_id"]:
        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own account."
        )

    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID."
        )

    result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "is_active": is_active
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "message": "User status updated successfully.",
        "user_id": user_id,
        "is_active": is_active
    }