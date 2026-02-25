from fastapi import APIRouter, Response, HTTPException, Cookie, Form
from app.models.user import User
from app.hashing import verify_password
from app.services.authentificateUser import create_access_token
from app.services.authentificateUser import decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(response: Response, email: str = Form(...), password: str = Form(...)):
    user = await User.find_one(User.email == email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    
    token = create_access_token({"sub": str(user.id), "role": user.role})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return {"message": "Logged in"}

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