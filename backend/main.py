from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import databases
import sqlalchemy
from fastapi.middleware.cors import CORSMiddleware

# Настройки базы данных
DATABASE_URL = "postgresql://postgres:12345@db:5432/To-Do-List"
database = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

store = sqlalchemy.Table(
    "store",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.BigInteger, primary_key=True, index=True),
    sqlalchemy.Column("val", sqlalchemy.Text, nullable=False)
)

engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)

class Item(BaseModel):
    id: int
    val: str

async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",  # Добавьте URL вашего фронтенда
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/store")
async def read_all_items():
    query = store.select()
    all_items = await database.fetch_all(query)
    return all_items

@app.post("/store", response_model=Item)
async def create_item(item: Item):
    query = store.insert().values(id=item.id, val=item.val)
    try:
        await database.execute(query)
        return item
    except sqlalchemy.exc.IntegrityError as e:
        raise HTTPException(status_code=400, detail=f"Error creating item: {e}")

@app.delete("/store/{item_id}", status_code=204)
async def delete_item(item_id: int):
    query = store.delete().where(store.c.id == item_id)
    try:
        await database.execute(query)
        return {"message": f"Item with id {item_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)