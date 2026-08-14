from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base
from app.models import User, TestResult, TestKit, UserTestKit  # noqa: F401
from app.routes import users, test_results, test_kits, user_test_kits

app = FastAPI(title="AFRA Connect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this before you deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(test_results.router)
app.include_router(test_kits.router)
app.include_router(user_test_kits.router)


@app.get("/")
def root():
    return {"message": "AFRA Connect API is running"}
