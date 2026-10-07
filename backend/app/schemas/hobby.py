from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class HobbyBase(BaseModel):
    name: str
    icon: Optional[str] = None
    image_url: Optional[str] = None


class HobbyCreate(HobbyBase):
    pass


class HobbyResponse(HobbyBase):
    id: int
    normalized_name: str

    model_config = ConfigDict(from_attributes=True)


class UserHobbiesUpdate(BaseModel):
    hobby_ids: List[int]
