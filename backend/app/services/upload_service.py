import os, uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

async def upload_images(files: list[UploadFile]) -> str:
    urls = []
    for file in files:
        if not file or not file.filename:
            continue
        contents = await file.read()
        public_id = f"lost-found/{uuid.uuid4()}"
        result = cloudinary.uploader.upload(
            contents,
            public_id=public_id,
            folder="lost-found",
            resource_type="image",
        )
        urls.append(result["secure_url"])
    return ",".join(urls)

async def upload_image(file: UploadFile | None, folder: str = "") -> str | None:
    if not file or not file.filename:
        return None
    result = await upload_images([file])
    return result or None