from fastapi import APIRouter, HTTPException
from api.services.user_services import UserService
from api.schemas.user_schemas import UserCreate

router = APIRouter()

user_service = UserService()

@router.post("/register")
async def create_user_route(user: UserCreate):
    try:
        created_user = await user_service.create_user(user)
        return created_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
