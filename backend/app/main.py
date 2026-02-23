from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from contextlib import asynccontextmanager
from app.utils import create_admin_user



@asynccontextmanager
async def lifespan(app: FastAPI):
	await init_db()
	await create_admin_user()
	yield 

app = FastAPI(lifespan= lifespan)

app.add_middleware(CORSMiddleware,
				   allow_origins=["*"], 
				   allow_credentials=True,
				   allow_methods=["*"], 
				   allow_headers=["*"])


@app.get("/")
def root():
	return {"message":"Backend is running!"}

