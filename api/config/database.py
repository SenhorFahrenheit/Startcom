from motor.motor_asyncio import AsyncIOMotorClient  # Import the asynchronous MongoDB client from Motor
import asyncio  # Import asyncio to run asynchronous code

class MongoDB:
    def __init__(self, uri: str, db_name: str):
        # Create the MongoDB client using the provided URI
        self.client = AsyncIOMotorClient(uri)
        # Select the specific database
        self.db = self.client[db_name]

    def get_collection(self, collection_name: str):
        # Return a specific collection from the database
        return self.db[collection_name]


# Create a global instance of the MongoDB class
mongo = MongoDB(
    "mongodb+srv://db_developer:8EUR4H0fpaQY@starcomdb.uktxcfh.mongodb.net/?retryWrites=true&w=majority",
    "Startcom_Database"
)

# Define an asynchronous function to test MongoDB operations
async def test_mongo():
    # Get the 'user' collection from the database
    collection = mongo.get_collection("user")
    # Fetch the first 5 documents from the collection
    documents = await collection.find().to_list(5)
    # Print the retrieved documents
    print(documents)

# Run the asynchronous test function
asyncio.run(test_mongo())
