from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base
from app.models import User, TestResult  # noqa: F401 (registers models with Base)
from app.routes import users, test_results

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


@app.get("/")
def root():
    return {"message": "AFRA Connect API is running"}