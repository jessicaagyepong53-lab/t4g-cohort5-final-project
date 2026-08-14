from sqlalchemy.orm import Session

from app.models.user_test_kit import UserTestKit
from app.schemas.user_test_kit import UserTestKitCreate, UserTestKitUpdate


def get_user_test_kit(db: Session, kit_id: str) -> UserTestKit | None:
    return db.query(UserTestKit).filter(UserTestKit.id == kit_id).first()


def get_user_test_kits(db: Session, skip: int = 0, limit: int = 100) -> list[UserTestKit]:
    return db.query(UserTestKit).offset(skip).limit(limit).all()


def get_user_test_kits_by_user(db: Session, user_id: str) -> list[UserTestKit]:
    return db.query(UserTestKit).filter(UserTestKit.user_id == user_id).all()


def create_user_test_kit(db: Session, kit: UserTestKitCreate) -> UserTestKit:
    db_kit = UserTestKit(
        user_id=kit.user_id,
        kit_type=kit.kit_type,
        serial_number=kit.serial_number,
        manufacturer=kit.manufacturer,
        purchase_date=kit.purchase_date,
        expiry_date=kit.expiry_date,
        notes=kit.notes,
    )
    db.add(db_kit)
    db.commit()
    db.refresh(db_kit)
    return db_kit


def update_user_test_kit(
    db: Session, kit_id: str, kit_update: UserTestKitUpdate
) -> UserTestKit | None:
    db_kit = get_user_test_kit(db, kit_id)
    if not db_kit:
        return None

    update_data = kit_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_kit, field, value)

    db.commit()
    db.refresh(db_kit)
    return db_kit


def delete_user_test_kit(db: Session, kit_id: str) -> bool:
    db_kit = get_user_test_kit(db, kit_id)
    if not db_kit:
        return False
    db.delete(db_kit)
    db.commit()
    return True
