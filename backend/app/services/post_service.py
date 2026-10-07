from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.community import Community
from app.models.post import Post, PostImage, Comment, PostLike
from app.models.user import User
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    CommentCreate,
    CommentResponse,
    LikeToggleResponse,
)


def get_post_by_id(db: Session, post_id: int) -> Optional[Post]:
    return db.query(Post).filter(Post.id == post_id).first()


def format_comment_response(comment: Comment) -> CommentResponse:
    replies = sorted(comment.replies or [], key=lambda r: r.created_at)
    return CommentResponse(
        id=comment.id,
        content=comment.content,
        author_id=comment.author_id,
        post_id=comment.post_id,
        parent_comment_id=comment.parent_comment_id,
        created_at=comment.created_at,
        author=comment.author,
        replies=[format_comment_response(r) for r in replies],
    )


def format_post_response(
    db: Session,
    post: Post,
    current_user_id: Optional[int] = None,
) -> PostResponse:
    likes_count = (
        db.query(func.count(PostLike.id))
        .filter(PostLike.post_id == post.id)
        .scalar() or 0
    )
    comments_count = (
        db.query(func.count(Comment.id))
        .filter(Comment.post_id == post.id)
        .scalar() or 0
    )
    is_liked = False
    if current_user_id:
        is_liked = (
            db.query(PostLike)
            .filter(
                PostLike.post_id == post.id,
                PostLike.user_id == current_user_id,
            )
            .first()
            is not None
        )

    top_level_comments = (
        db.query(Comment)
        .filter(
            Comment.post_id == post.id,
            Comment.parent_comment_id.is_(None),
        )
        .order_by(Comment.created_at.asc())
        .all()
    )

    return PostResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        community_id=post.community_id,
        author_id=post.author_id,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author=post.author,
        likes_count=likes_count,
        comments_count=comments_count,
        is_liked=is_liked,
        images=post.images,
        comments=[format_comment_response(c) for c in top_level_comments],
    )


def create_post(db: Session, post_in: PostCreate, author: User) -> PostResponse:
    community = db.query(Community).filter(Community.id == post_in.community_id).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found",
        )

    post = Post(
        title=post_in.title.strip(),
        content=post_in.content.strip(),
        community_id=post_in.community_id,
        author_id=author.id,
    )
    db.add(post)
    db.flush()

    for image_in in post_in.images or []:
        db.add(
            PostImage(
                post_id=post.id,
                url=image_in.url.strip(),
                public_id=image_in.public_id,
                position=image_in.position,
            )
        )
    db.commit()
    db.refresh(post)

    return format_post_response(db, post, current_user_id=author.id)


def list_posts(
    db: Session,
    community_id: Optional[int] = None,
    author_id: Optional[int] = None,
    search: Optional[str] = None,
    current_user_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
) -> List[PostResponse]:
    query = db.query(Post)

    if community_id:
        query = query.filter(Post.community_id == community_id)

    if author_id:
        query = query.filter(Post.author_id == author_id)

    if search:
        search_pattern = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Post.title).like(search_pattern),
                func.lower(Post.content).like(search_pattern),
            )
        )

    posts = query.order_by(Post.created_at.desc()).offset(offset).limit(limit).all()
    return [format_post_response(db, p, current_user_id) for p in posts]


def get_post_detail(
    db: Session,
    post_id: int,
    current_user_id: Optional[int] = None,
) -> PostResponse:
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    return format_post_response(db, post, current_user_id)


def update_post(
    db: Session,
    post_id: int,
    update_data: PostUpdate,
    current_user: User,
) -> PostResponse:
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the post author can edit this post",
        )

    if update_data.title is not None:
        post.title = update_data.title.strip()
    if update_data.content is not None:
        post.content = update_data.content.strip()

    db.add(post)
    db.commit()
    db.refresh(post)
    return format_post_response(db, post, current_user.id)


def delete_post(db: Session, post_id: int, current_user: User) -> None:
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the post author can delete this post",
        )

    db.delete(post)
    db.commit()


def toggle_like(db: Session, post_id: int, user: User) -> LikeToggleResponse:
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    existing = (
        db.query(PostLike)
        .filter(PostLike.post_id == post.id, PostLike.user_id == user.id)
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        is_liked = False
    else:
        db.add(PostLike(user_id=user.id, post_id=post.id))
        db.commit()
        is_liked = True

    likes_count = (
        db.query(func.count(PostLike.id))
        .filter(PostLike.post_id == post.id)
        .scalar() or 0
    )

    return LikeToggleResponse(
        post_id=post.id,
        is_liked=is_liked,
        likes_count=likes_count,
    )


def create_comment(
    db: Session,
    post_id: int,
    comment_in: CommentCreate,
    author: User,
) -> CommentResponse:
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    if comment_in.parent_comment_id is not None:
        parent = (
            db.query(Comment)
            .filter(Comment.id == comment_in.parent_comment_id)
            .first()
        )
        if not parent or parent.post_id != post.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent comment does not belong to this post",
            )

    comment = Comment(
        content=comment_in.content.strip(),
        author_id=author.id,
        post_id=post.id,
        parent_comment_id=comment_in.parent_comment_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return format_comment_response(comment)


def delete_comment(
    db: Session,
    post_id: int,
    comment_id: int,
    current_user: User,
) -> None:
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment or comment.post_id != post.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )

    if comment.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the comment author can delete this comment",
        )

    db.delete(comment)
    db.commit()
