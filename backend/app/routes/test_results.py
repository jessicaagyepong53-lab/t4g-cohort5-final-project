from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.test_result import TestResultCreate, TestResultUpdate, TestResultOut
from app.repositories import test_result_repository, user_repository

router = APIRouter(prefix="/test-results", tags=["Test Results"])


@router.post("/", response_model=TestResultOut, status_code=status.HTTP_201_CREATED)
def create_test_result(result: TestResultCreate, db: Session = Depends(get_db)):
    owner = user_repository.get_user(db, result.user_id)
    if not owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cannot create test result: user_id does not exist",
        )
    return test_result_repository.create_test_result(db, result)


@router.get("/", response_model=list[TestResultOut])
def list_test_results(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return test_result_repository.get_test_results(db, skip, limit)


@router.get("/user/{user_id}", response_model=list[TestResultOut])
def get_results_for_user(user_id: str, db: Session = Depends(get_db)):
    owner = user_repository.get_user(db, user_id)
    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return test_result_repository.get_test_results_by_user(db, user_id)


@router.get("/{result_id}", response_model=TestResultOut)
def get_test_result(result_id: str, db: Session = Depends(get_db)):
    db_result = test_result_repository.get_test_result(db, result_id)
    if not db_result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test result not found")
    return db_result


@router.put("/{result_id}", response_model=TestResultOut)
def update_test_result(result_id: str, result_update: TestResultUpdate, db: Session = Depends(get_db)):
    db_result = test_result_repository.update_test_result(db, result_id, result_update)
    if not db_result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test result not found")
    return db_result


@router.delete("/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_test_result(result_id: str, db: Session = Depends(get_db)):
    deleted = test_result_repository.delete_test_result(db, result_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test result not found")
    return None