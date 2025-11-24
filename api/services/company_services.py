from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.errors import PyMongoError
from ..schemas.company_schemas import CompanyCreate, CompanyInDB

class CompanyService:
    """
    Service layer for company-related operations.
    Handles business logic, validation and DB interactions.
    """

    def __init__(self, db_client):
        self.db = db_client
        self.company_collection = self.db.get_collection("company")
        self.user_collection = self.db.get_collection("user")

    async def create_company(self, company_data: CompanyCreate) -> CompanyInDB:
        """
        Creates a new company linked to a user (ownerId).

        Args:
            company_data (CompanyCreate): Schema containing company info.

        Returns:
            CompanyInDB: The created company document.
        """
        try:
            # Validate if user exists
            owner = await self.user_collection.find_one({"_id": ObjectId(company_data.ownerId)})
            if not owner:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner user not found")

            # ✅ Prepare company document
            company_doc = {
                "name": company_data.name,
                "taxId": company_data.taxId,
                "ownerId": ObjectId(company_data.ownerId),
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow(),
                "clients": [],
                "inventory": [],
                "sales": []
            }

            # Insert into DB
            result = await self.company_collection.insert_one(company_doc)
            created_company = await self.company_collection.find_one({"_id": result.inserted_id})

            return CompanyInDB(**created_company)

        except PyMongoError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_company_public_info(self, company_id: str) -> dict:
        try:
            company = await self.company_collection.find_one({"_id": ObjectId(company_id)})

            if not company:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Company not found"
                )

            owner = await self.user_collection.find_one({"_id": company["ownerId"]})

            if not owner:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Owner user not found"
                )

            return {
                "name": company.get("name", "") or "",
                "cpf_cnpj": company.get("taxId", "") or "",
                "email": owner.get("email", "") or "",
                "phone_number": owner.get("phone_number", "") or "",
                "address": company.get("address", "") or "",
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


    async def update_company_public_info(
        self,
        company_id: str,
        name: str = "",
        cpf_cnpj: str = "",
        email: str = "",
        telephone: str = "",
        address: str = ""
    ) -> dict:
        try:
            company = await self.company_collection.find_one({"_id": ObjectId(company_id)})

            if not company:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Company not found"
                )

            owner_id = company["ownerId"]

            # Atualizar COMPANY
            update_company = {
                "name": name,
                "taxId": cpf_cnpj,
                "address": address,
                "updatedAt": datetime.utcnow()
            }

            await self.company_collection.update_one(
                {"_id": ObjectId(company_id)},
                {"$set": update_company}
            )

            # Atualizar USER (email e telephone)
            update_user = {
                "email": email,
                "telephone": telephone,
                "updatedAt": datetime.utcnow()
            }

            await self.user_collection.update_one(
                {"_id": owner_id},
                {"$set": update_user}
            )

            # Buscar dados atualizados para retorno
            updated_company = await self.company_collection.find_one({"_id": ObjectId(company_id)})
            updated_owner = await self.user_collection.find_one({"_id": owner_id})

            return {
                "name": updated_company.get("name", "") or "",
                "cpf_cnpj": updated_company.get("taxId", "") or "",
                "email": updated_owner.get("email", "") or "",
                "phone_number": updated_owner.get("phone_number", "") or "",
                "address": updated_company.get("address", "") or "",
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

