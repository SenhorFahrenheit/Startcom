from passlib.context import CryptContext
import jwt, os
from datetime import datetime, timedelta

class AuthService:
    def __init__(self, client):
        # client é o AsyncIOMotorClient
        db_name = os.getenv("MONGO_DB")
        self.db = client[db_name]  # pega o database correto
        self.users_collection = self.db["user"]  # pega a coleção
        self.pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")
        self.secret_key = os.getenv("JWT_SECRET")
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30

    async def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    async def get_user_by_email(self, email):
        return await self.users_collection.find_one({"email": email})

    async def login(self, email, password):
        user = await self.get_user_by_email(email)
        if not user:
            raise Exception("Invalid email or password")
        
        if not await self.verify_password(password, user["passwordHash"]):
            raise Exception("Invalid email or password")
        
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        payload = {"sub": str(user["_id"]), "exp": expire}
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token
