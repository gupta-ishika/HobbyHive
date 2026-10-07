from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.communities import router as communities_router
from app.api.v1.posts import router as posts_router
from app.api.v1.events import router as events_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(communities_router)
api_router.include_router(posts_router)
api_router.include_router(events_router)
