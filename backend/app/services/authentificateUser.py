from app.models.user import User
from app.hashing import verify_password
from fastapi import Depends, Cookie
from fastapi import HTTPException
from datetime import datetime, timedelta
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from jose import jwt, JWTError 


load_dotenv()
SECRET = quote_plus(os.getenv("JWT_SECRET")) 
ALG = quote_plus(os.getenv("JWT_ALGORITHM")) 
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(401, "Not authenticated")

    payload = jwt.decode(access_token, SECRET, algorithms=["HS256"])
    user_id = payload["sub"]
    role = payload["role"]

    return {"id": user_id, "role": role}


def require_role(required: str):
    def wrapper(user = Depends(get_current_user)):
        if user["role"] != required:
            raise HTTPException(403, "Forbidden")
        return user
    return wrapper



def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET, algorithm=ALG)

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=[ALG])
    except JWTError:
        return None


async def authenticateUser(email: str, password: str):
    user = await User.find_one(User.email == email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
