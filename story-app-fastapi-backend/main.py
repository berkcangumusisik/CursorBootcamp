from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data.database import engine
from models import Base, User, Story, Criteria, StoryCriteria
from controllers import story_controller  # story_controller'ı import ediyoruz

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

# FastAPI uygulamasını oluştur
app = FastAPI(
    title="Hikaye Oluşturma API'si",
    description="Hikaye oluşturmak ve yönetmek için bir API",
    version="1.0.0"
)

# CORS'u yapılandır
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],  # Sadece localhost:5173'e izin ver
    allow_credentials=True,
    allow_methods=["*"],  # Tüm metodlara izin ver
    allow_headers=["*"],  # Tüm başlıklara izin ver
)

# Hikaye rotalarını dahil et
app.include_router(story_controller.router, prefix="/stories", tags=["stories"])

# Kök endpoint
@app.get("/")
def read_root():
    return {"mesaj": "Hikaye Oluşturma API'sine Hoş Geldiniz"}

# Veritabanı test endpoint'i
@app.get("/db-test")
def test_db():
    return {"mesaj": "Veritabanı bağlantısı başarılı!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
