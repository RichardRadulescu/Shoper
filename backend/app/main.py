from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from contextlib import asynccontextmanager
from app.utils import create_admin_user
from app.routers import auth, products, carts


@asynccontextmanager
async def lifespan(app: FastAPI):
	await init_db()
	await create_admin_user()
	yield 

app = FastAPI(lifespan= lifespan, root_path="/api")

app.add_middleware(CORSMiddleware,
				   allow_origins=["*"], 
				   allow_credentials=True,
				   allow_methods=["*"], 
				   allow_headers=["*"])

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(carts.router)

@app.get("/")
def root():
	return {"message":"Backend is running!"}


 