from api.config.database import mongo
from api.schemas.user_schemas import UserCreate
from bson import ObjectId
import hashlib

class UserService:
    def __init__(self):
        self.collection = mongo.get_collection("user")

    async def create_user(self, user_data: UserCreate) -> dict:
        """
        Cria um usuário no banco de dados.
        """
        # Hash da senha (simples, só exemplo; para produção use bcrypt)
        hashed_password = hashlib.sha256(user_data.password.encode()).hexdigest()
        
        # Cria o documento que será salvo
        user_document = {
            "name": user_data.name,
            "email": user_data.email,
            "passwordHash": hashed_password
        }

        # Insere no MongoDB
        result = await self.collection.insert_one(user_document)

        # Busca o usuário criado para retornar
        user_created = await self.collection.find_one({"_id": result.inserted_id})

        # Converte ObjectId para string
        user_created["id"] = str(user_created["_id"])
        del user_created["_id"]
        del user_created["passwordHash"]  # nunca retorne senha

        return user_created
