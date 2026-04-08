from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str = "college-project-secret-123"
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    FRONTEND_URL: str = "*"

    class Config:
        env_file = ".env"

settings = Settings()