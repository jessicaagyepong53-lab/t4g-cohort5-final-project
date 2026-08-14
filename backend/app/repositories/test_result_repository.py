from sqlalchemy.orm import Session

from app.models.test_result import TestResult
from app.schemas.test_result import TestResultCreate, TestResultUpdate


def get_test_result(db: Session, result_id: str) -> TestResult | None:
    return db.query(TestResult).filter(TestResult.id == result_id).first()


def get_test_results(db: Session, skip: int = 0, limit: int = 100) -> list[TestResult]:
    return db.query(TestResult).offset(skip).limit(limit).all()


def get_test_results_by_user(db: Session, user_id: str) -> list[TestResult]:
    return db.query(TestResult).filter(TestResult.user_id == user_id).all()


def create_test_result(db: Session, result: TestResultCreate) -> TestResult:
    db_result = TestResult(
        user_id=result.user_id,
        test_type=result.test_type,
        result_data=result.result_data,
        notes=result.notes,
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result


def update_test_result(
    db: Session, result_id: str, result_update: TestResultUpdate
) -> TestResult | None:
    db_result = get_test_result(db, result_id)
    if not db_result:
        return None

    update_data = result_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_result, field, value)

    db.commit()
    db.refresh(db_result)
    return db_result


def delete_test_result(db: Session, result_id: str) -> bool:
    db_result = get_test_result(db, result_id)
    if not db_result:
        return False
    db.delete(db_result)
    db.commit()
    return True
