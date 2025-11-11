from bson import ObjectId
from pydantic import BaseModel, Field
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    """Pydantic-compatible ObjectId for MongoDB."""

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        # Apenas valida o ObjectId — não tenta gerar schema automático
        def validate(value):
            if isinstance(value, ObjectId):
                return value
            if isinstance(value, str) and ObjectId.is_valid(value):
                return ObjectId(value)
            raise ValueError("Invalid ObjectId")

        # Retorna apenas o validador, sem esquema complexo
        return core_schema.no_info_plain_validator_function(validate)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler):
        # Retorna um schema fixo e simples para o Swagger
        return {"type": "string", "example": "507f1f77bcf86cd799439011"}
