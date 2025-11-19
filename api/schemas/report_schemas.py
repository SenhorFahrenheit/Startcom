from pydantic import BaseModel, Field

class SalesPeriodRequest(BaseModel):
    """
    Request body model for retrieving sales metrics based on a time period.
    """
    period: str = Field(
        ...,
        description="Time period to calculate category distribution and sales totals. "
                    "Accepted values: '7d', '30d', '6m', '1y'."
    )
