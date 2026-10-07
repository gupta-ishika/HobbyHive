from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.community import Community, CommunityMember
from app.models.post import Post
from app.models.user import User
from app.schemas.community import CommunityCreate, CommunityUpdate, CommunityResponse, CommunityDetailResponse, CommunityMemberResponse


def get_community_by_id(db: Session, community_id: int) -> Optional[Community]:
    return db.query(Community).filter(Community.id == community_id).first()


def get_community_by_normalized_name(db: Session, normalized_name: str) -> Optional[Community]:
    return db.query(Community).filter(Community.normalized_name == normalized_name).first()


def format_community_response(
    db: Session,
    community: Community,
    current_user_id: Optional[int] = None
) -> CommunityResponse:
    members_count = (
        db.query(func.count(CommunityMember.id))
        .filter(CommunityMember.community_id == community.id)
        .scalar() or 0
    )
    posts_count = (
        db.query(func.count(Post.id))
        .filter(Post.community_id == community.id)
        .scalar() or 0
    )
    is_member = False
    if current_user_id:
        is_member = (
            db.query(CommunityMember)
            .filter(
                CommunityMember.community_id == community.id,
                CommunityMember.user_id == current_user_id
            )
            .first() is not None
        )

    return CommunityResponse(
        id=community.id,
        name=community.name,
        normalized_name=community.normalized_name,
        description=community.description,
        category=community.category,
        avatar_url=community.avatar_url,
        banner_url=community.banner_url,
        rules=community.rules,
        hobby_id=community.hobby_id,
        creator_id=community.creator_id,
        created_at=community.created_at,
        members_count=members_count,
        posts_count=posts_count,
        is_member=is_member,
        hobby=community.hobby,
        creator=community.creator,
    )


def create_community(db: Session, community_in: CommunityCreate, creator: User) -> CommunityResponse:
    normalized = community_in.name.strip().lower()
    if get_community_by_normalized_name(db, normalized):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A community with this name already exists"
        )

    community = Community(
        name=community_in.name.strip(),
        normalized_name=normalized,
        description=community_in.description.strip(),
        category=community_in.category.strip(),
        avatar_url=community_in.avatar_url,
        banner_url=community_in.banner_url,
        rules=community_in.rules,
        hobby_id=community_in.hobby_id,
        creator_id=creator.id,
    )
    db.add(community)
    db.flush()

    # Automatically add creator as admin member
    membership = CommunityMember(
        user_id=creator.id,
        community_id=community.id,
        role="admin"
    )
    db.add(membership)
    db.commit()
    db.refresh(community)

    return format_community_response(db, community, current_user_id=creator.id)


def list_communities(
    db: Session,
    category: Optional[str] = None,
    hobby_id: Optional[int] = None,
    search: Optional[str] = None,
    current_user_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0
) -> List[CommunityResponse]:
    query = db.query(Community)

    if category and category.lower() != "all":
        query = query.filter(func.lower(Community.category) == category.strip().lower())

    if hobby_id:
        query = query.filter(Community.hobby_id == hobby_id)

    if search:
        search_pattern = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Community.name).like(search_pattern),
                func.lower(Community.description).like(search_pattern)
            )
        )

    communities = query.order_by(Community.created_at.desc()).offset(offset).limit(limit).all()
    return [format_community_response(db, c, current_user_id) for c in communities]


def get_community_detail(
    db: Session,
    community_id: int,
    current_user_id: Optional[int] = None
) -> CommunityDetailResponse:
    community = get_community_by_id(db, community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )

    base_resp = format_community_response(db, community, current_user_id)
    members = (
        db.query(CommunityMember)
        .filter(CommunityMember.community_id == community.id)
        .order_by(CommunityMember.joined_at.desc())
        .limit(20)
        .all()
    )

    return CommunityDetailResponse(
        **base_resp.model_dump(),
        members=[CommunityMemberResponse.model_validate(m) for m in members]
    )


def update_community(
    db: Session,
    community_id: int,
    update_data: CommunityUpdate,
    current_user: User
) -> CommunityResponse:
    community = get_community_by_id(db, community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )

    # Author/Owner check
    if community.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the community owner can edit community details"
        )

    if update_data.name is not None:
        normalized = update_data.name.strip().lower()
        if normalized != community.normalized_name:
            existing = get_community_by_normalized_name(db, normalized)
            if existing and existing.id != community.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A community with this name already exists"
                )
            community.name = update_data.name.strip()
            community.normalized_name = normalized

    if update_data.description is not None:
        community.description = update_data.description.strip()
    if update_data.category is not None:
        community.category = update_data.category.strip()
    if update_data.avatar_url is not None:
        community.avatar_url = update_data.avatar_url
    if update_data.banner_url is not None:
        community.banner_url = update_data.banner_url
    if update_data.rules is not None:
        community.rules = update_data.rules
    if update_data.hobby_id is not None:
        community.hobby_id = update_data.hobby_id

    db.add(community)
    db.commit()
    db.refresh(community)
    return format_community_response(db, community, current_user.id)


def delete_community(db: Session, community_id: int, current_user: User) -> None:
    community = get_community_by_id(db, community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )

    if community.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the community owner can delete the community"
        )

    db.delete(community)
    db.commit()


def join_community(db: Session, community_id: int, user: User) -> CommunityResponse:
    community = get_community_by_id(db, community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )

    existing_membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community.id,
            CommunityMember.user_id == user.id
        )
        .first()
    )

    if not existing_membership:
        membership = CommunityMember(
            user_id=user.id,
            community_id=community.id,
            role="member"
        )
        db.add(membership)
        db.commit()

    return format_community_response(db, community, user.id)


def leave_community(db: Session, community_id: int, user: User) -> CommunityResponse:
    community = get_community_by_id(db, community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )

    if community.creator_id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Community owner cannot leave without transferring ownership first"
        )

    membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community.id,
            CommunityMember.user_id == user.id
        )
        .first()
    )

    if membership:
        db.delete(membership)
        db.commit()

    return format_community_response(db, community, user.id)


def transfer_community_ownership(
    db: Session,
    community_id: int,
    new_owner_id: int,
    current_user: User
) -> CommunityResponse:
    community = get_community_by_id(db, community_id)
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found"
        )

    if community.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the current owner can transfer community ownership"
        )

    # Check target member exists
    new_owner_membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community.id,
            CommunityMember.user_id == new_owner_id
        )
        .first()
    )
    if not new_owner_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New owner must be a member of the community"
        )

    community.creator_id = new_owner_id
    new_owner_membership.role = "admin"

    # Ensure old owner remains admin
    old_owner_membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community.id,
            CommunityMember.user_id == current_user.id
        )
        .first()
    )
    if old_owner_membership:
        old_owner_membership.role = "admin"

    db.add(community)
    db.commit()
    db.refresh(community)
    return format_community_response(db, community, current_user.id)
