from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.test_kit import TestKitCreate, TestKitUpdate, TestKitOut
from app.repositories import test_kit_repository, user_repository

router = APIRouter(prefix="/test-kits", tags=["Test Kits"])


@router.post("/", response_model=TestKitOut, status_code=status.HTTP_201_CREATED)
def create_test_kit(kit: TestKitCreate, db: Session = Depends(get_db)):
    adder = user_repository.get_user(db, kit.added_by)
    if not adder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cannot create test kit: added_by user does not exist",
        )
    return test_kit_repository.create_test_kit(db, kit)


@router.get("/", response_model=list[TestKitOut])
def list_test_kits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return test_kit_repository.get_test_kits(db, skip, limit)


@router.get("/{kit_id}", response_model=TestKitOut)
def get_test_kit(kit_id: str, db: Session = Depends(get_db)):
    db_kit = test_kit_repository.get_test_kit(db, kit_id)
    if not db_kit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test kit not found")
    return db_kit


@router.put("/{kit_id}", response_model=TestKitOut)
def update_test_kit(kit_id: str, kit_update: TestKitUpdate, db: Session = Depends(get_db)):
    db_kit = test_kit_repository.update_test_kit(db, kit_id, kit_update)
    if not db_kit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test kit not found")
    return db_kit


@router.delete("/{kit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_test_kit(kit_id: str, db: Session = Depends(get_db)):
    deleted = test_kit_repository.delete_test_kit(db, kit_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test kit not found")
    return None
