from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.user_test_kit import UserTestKitCreate, UserTestKitUpdate, UserTestKitOut
from app.repositories import user_test_kit_repository, user_repository

router = APIRouter(prefix="/user-test-kits", tags=["User Test Kits"])


@router.post("/", response_model=UserTestKitOut, status_code=status.HTTP_201_CREATED)
def create_user_test_kit(kit: UserTestKitCreate, db: Session = Depends(get_db)):
    owner = user_repository.get_user(db, kit.user_id)
    if not owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cannot register test kit: user_id does not exist",
        )
    return user_test_kit_repository.create_user_test_kit(db, kit)


@router.get("/", response_model=list[UserTestKitOut])
def list_user_test_kits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_test_kit_repository.get_user_test_kits(db, skip, limit)


@router.get("/user/{user_id}", response_model=list[UserTestKitOut])
def get_kits_for_user(user_id: str, db: Session = Depends(get_db)):
    owner = user_repository.get_user(db, user_id)
    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user_test_kit_repository.get_user_test_kits_by_user(db, user_id)


@router.get("/{kit_id}", response_model=UserTestKitOut)
def get_user_test_kit(kit_id: str, db: Session = Depends(get_db)):
    db_kit = user_test_kit_repository.get_user_test_kit(db, kit_id)
    if not db_kit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registered test kit not found")
    return db_kit


@router.put("/{kit_id}", response_model=UserTestKitOut)
def update_user_test_kit(kit_id: str, kit_update: UserTestKitUpdate, db: Session = Depends(get_db)):
    db_kit = user_test_kit_repository.update_user_test_kit(db, kit_id, kit_update)
    if not db_kit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registered test kit not found")
    return db_kit


@router.delete("/{kit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_test_kit(kit_id: str, db: Session = Depends(get_db)):
    deleted = user_test_kit_repository.delete_user_test_kit(db, kit_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registered test kit not found")
    return None
