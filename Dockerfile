FROM node:22-alpine

WORKDIR /app

# 👇 necesario para prisma en build
ENV DATABASE_URL="postgresql://amadeostore:Amadeo123@postgres:5432/amadeo-store"

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5173

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev -- --host"]
