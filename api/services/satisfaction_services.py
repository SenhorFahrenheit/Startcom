from datetime import datetime, timedelta
import math
import os
from ..infra.database import mongo  # Adjust import path if needed


# --------------------------------------------------------------------
# "Heavier" configuration (commented out for future testing)
# These parameters make the satisfaction metric slower to change,
# suitable for large datasets or systems with high sales frequency.
# WINDOW_DAYS = 180
# HALF_LIFE_DAYS = 60
# REPEAT_CAP = 5
# WEIGHT_REPEAT = 0.7
# WEIGHT_RECENCY = 0.3
# --------------------------------------------------------------------

# "Lighter" configuration (active)
# These parameters make the metric more responsive to recent activity,
# ideal for smaller systems or early-stage testing.
WINDOW_DAYS = int(os.getenv("SAT_WINDOW_DAYS", 90))          # Analyze the last 90 days of activity
HALF_LIFE_DAYS = float(os.getenv("SAT_HALF_LIFE_DAYS", 30))  # Decay faster: recent sales matter more
REPEAT_CAP = int(os.getenv("SAT_REPEAT_CAP", 3))             # Reach max score after 3 repeat purchases
WEIGHT_REPEAT = float(os.getenv("SAT_WEIGHT_REPEAT", 0.4))   # Frequency matters less
WEIGHT_RECENCY = float(os.getenv("SAT_WEIGHT_RECENCY", 0.6)) # Recency matters more
# --------------------------------------------------------------------


class SatisfactionService:
    """
    Service responsible for computing and updating each company's 'average_satisfaction' field.
    This metric represents a 0.0–5.0 score that estimates client satisfaction based on
    how frequently and how recently clients make purchases.
    """

    def __init__(self):
        # Access the MongoDB 'company' collection
        self.company_col = mongo.get_collection("company")

    async def update_all_companies_satisfaction(self) -> None:
        """
        Iterate through all companies, compute their satisfaction score,
        and update the 'average_satisfaction' field directly in each document.

        The operation does NOT create or use any 'metrics' subdocument.
        """
        # Select only necessary fields for calculation
        cursor = self.company_col.find({}, {"_id": 1, "sales": 1, "clients": 1})

        async for company in cursor:
            # Compute the new satisfaction value
            value = self._compute_company_satisfaction(company)

            # Persist the result directly in the root document
            await self.company_col.update_one(
                {"_id": company["_id"]},
                {
                    "$set": {
                        "average_satisfaction": round(value, 2),  # e.g., 4.37
                        "updatedAt": datetime.utcnow()
                    }
                }
            )

            # Optional debug log
            # print(f"[SatisfactionService] Updated {company.get('name')} → {round(value, 2)}")

    def _compute_company_satisfaction(self, company: dict) -> float:
        """
        Compute a company's satisfaction score (0.0–5.0) using client recurrence and recency.

        Logic:
          - Analyze only sales within the last WINDOW_DAYS.
          - For each client:
              * Count how many purchases they made (recurrence).
              * Measure how recent their last purchase was (recency).
          - Combine both factors into a normalized score (0–1),
            then average across all clients and scale to 0–5.

        Returns:
            float: satisfaction score scaled to [0.0, 5.0].
        """
        now = datetime.utcnow()
        cutoff = now - timedelta(days=WINDOW_DAYS)
        sales = company.get("sales", []) or []
        clients = company.get("clients", []) or []

        # Get all valid client IDs
        client_ids = {str(c.get("_id")) for c in clients if c.get("_id")}
        if not client_ids:
            return 0.0

        # Prepare per-client stats
        per_client = {cid: {"purchases": 0, "last": None} for cid in client_ids}

        # Aggregate purchases within the analysis window
        for sale in sales:
            date = sale.get("date")
            cid = sale.get("clientId")
            if not date or not cid or date < cutoff:
                continue

            key = str(cid)
            if key not in per_client:
                # Handle sales referencing non-existing clients (data drift)
                per_client[key] = {"purchases": 0, "last": None}

            per_client[key]["purchases"] += 1
            if per_client[key]["last"] is None or date > per_client[key]["last"]:
                per_client[key]["last"] = date

        # Calculate scores per client
        client_scores = []
        for cid, stats in per_client.items():
            purchases = stats["purchases"]
            last = stats["last"]

            # Repeat score: more purchases = higher score (up to REPEAT_CAP)
            repeat_score = max(0.0, min(1.0, (purchases - 1) / float(REPEAT_CAP)))

            # Recency score: decays exponentially with time since last purchase
            if last is None:
                recency_score = 0.0
            else:
                days_since_last = (now - last).days
                recency_score = math.exp(-days_since_last / max(HALF_LIFE_DAYS, 1e-6))

            # Combine scores with weighted sum
            client_score = WEIGHT_REPEAT * repeat_score + WEIGHT_RECENCY * recency_score
            client_scores.append(client_score)

        # If no client has any activity, satisfaction = 0.0
        if not client_scores:
            return 0.0

        # Average client scores and scale to [0.0–5.0]
        avg_score = sum(client_scores) / len(client_scores)
        return 5.0 * avg_score
