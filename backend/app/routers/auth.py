from fastapi import APIRouter, Response, HTTPException, Cookie, Form
from app.models.user import User
from app.hashing import verify_password
from app.services.authentificateUser import create_access_token
from app.services.authentificateUser import decode_access_token
from app.hashing import hash_password


router = APIRouter(prefix="/auth", tags=["auth"])


def add_cookie(response, user):
    token = create_access_token({"sub": str(user.id), "role": user.role})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False
    )


@router.post("/login")
async def login(response: Response, email: str = Form(...), password: str = Form(...)):
    user = await User.find_one(User.email == email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    
    add_cookie(response, user)

    return {"message": "Logged in"}


@router.post("/register")
async def register(response: Response, email: str = Form(...), name: str= Form(...), password: str = Form(...)):
    hashed_psw= hash_password(password)
    user = User(name= name, email= email, hashed_password= hashed_psw)
    #dumb register need to check for duplicate usernames or smth...
    await user.create()
    
    add_cookie(response, user) 

    return {"message": "User Registered"}


@router.post("/logout") 
async def logout(response: Response): 
    response.delete_cookie("access_token") 
    return {"message": "Logged out"}


@router.get("/me")
async def me(access_token: str = Cookie(None)):
    if not access_token:
        return {"role": "visitor"}
    payload = decode_access_token(access_token)
    if not payload:
        return {"role": "visitor"}
    return {"id": payload.get("sub"), "role": payload.get("role", "visitor")}