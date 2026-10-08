FROM node:20-alpine

WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları kur
RUN npm install --omit=dev

# Uygulama dosyalarını kopyala
COPY . .

# Port aç
EXPOSE 3000

# Ortam değişkenleri
ENV NODE_ENV=production
ENV PORT=3000

# Sunucuyu başlat
CMD ["node", "server.js"]
