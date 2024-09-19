from openai import OpenAI
from dotenv import load_dotenv
import os

# .env dosyasından ortam değişkenlerini yükle
load_dotenv()

# OpenAI istemcisini oluştur
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_story(title: str, genre: str, target_age: str, max_tokens: int = 1500) -> str:
    try:
        prompt = f"""Bir çocuk hikayesi yazarısın. Aşağıdaki kriterlere uygun bir hikaye yaz:

        Başlık: {title}
        Tür: {genre}
        Hedef Yaş Grubu: {target_age}

        Hikaye şu özelliklere sahip olmalı:
        1. Başlık ile uyumlu bir konu
        2. Hedef yaş grubuna uygun dil ve içerik
        3. Belirtilen türe uygun özellikler
        4. Eğlenceli ve ilgi çekici bir anlatım
        5. Eğitici veya ahlaki bir mesaj
        6. Açık bir başlangıç, gelişme ve sonuç bölümü
        7. Canlı ve renkli karakter tanımlamaları
        8. Diyaloglar ve betimlemeler arasında iyi bir denge

        Lütfen hikayeyi yaz:
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {"role": "system", "content": "Sen yetenekli bir çocuk hikayesi yazarısın."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            n=1,
            temperature=0.7,  # Yaratıcılık ve tutarlılık arasında iyi bir denge
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI API hatası: {str(e)}")
        return None