from fastapi import Header

async def get_current_user(
    x_user_id: str | None = Header(default=None),
) -> dict:
    import hashlib, time
    # Generate a session-based anonymous ID if none provided
    if x_user_id:
        return {"user_id": x_user_id, "role": "user"}
    return {"user_id": "anonymous_user", "role": "user"}

async def get_admin_user(
    x_user_id: str | None = Header(default=None),
) -> dict:
    return {"user_id": x_user_id or "admin_user", "role": "admin"}