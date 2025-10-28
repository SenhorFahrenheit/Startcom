from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import Optional

class PyObjectId(ObjectId):
    """
    Custom Pydantic-compatible ObjectId for MongoDB integration.
    Works with both validation and serialization.
    """

    @classmethod
    def __get_pydantic_core_schema__(cls, *args, **kwargs):
        # This is for Pydantic v2 internal schema generation
        from pydantic_core import core_schema

        def validate_objectid(value):
            if isinstance(value, ObjectId):
                return value
            if isinstance(value, str) and ObjectId.is_valid(value):
                return ObjectId(value)
            raise ValueError("Invalid ObjectId")

        return core_schema.no_info_plain_validator_function(validate_objectid)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler):
        schema.update(type="string")
        return schema

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Company name")
    taxId: str = Field(..., description="Unique company tax identifier (e.g., CNPJ)")

class CompanyCreate(CompanyBase):
    ownerId: PyObjectId = Field(..., description="ID of the user who owns the company")

class CompanyInDB(CompanyBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    ownerId: PyObjectId
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    clients: list = Field(default_factory=list)
    inventory: list = Field(default_factory=list)
    sales: list = Field(default_factory=list)

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
