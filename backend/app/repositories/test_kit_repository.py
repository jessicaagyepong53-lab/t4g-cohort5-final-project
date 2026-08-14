from sqlalchemy.orm import Session

from app.models.test_kit import TestKit
from app.schemas.test_kit import TestKitCreate, TestKitUpdate


def get_test_kit(db: Session, kit_id: str) -> TestKit | None:
    return db.query(TestKit).filter(TestKit.id == kit_id).first()


def get_test_kits(db: Session, skip: int = 0, limit: int = 100) -> list[TestKit]:
    return db.query(TestKit).offset(skip).limit(limit).all()


def create_test_kit(db: Session, kit: TestKitCreate) -> TestKit:
    db_kit = TestKit(
        name=kit.name,
        kit_type=kit.kit_type,
        manufacturer=kit.manufacturer,
        kit_code=kit.kit_code,
        status=kit.status,
        description=kit.description,
        instructions=kit.instructions,
        added_by=kit.added_by,
    )
    db.add(db_kit)
    db.commit()
    db.refresh(db_kit)
    return db_kit


def update_test_kit(db: Session, kit_id: str, kit_update: TestKitUpdate) -> TestKit | None:
    db_kit = get_test_kit(db, kit_id)
    if not db_kit:
        return None

    update_data = kit_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_kit, field, value)

    db.commit()
    db.refresh(db_kit)
    return db_kit


def delete_test_kit(db: Session, kit_id: str) -> bool:
    db_kit = get_test_kit(db, kit_id)
    if not db_kit:
        return False
    db.delete(db_kit)
    db.commit()
    return True
