# ============================================
# TaskFlow backend - Docker build file
# ============================================

# 1. Base image: Node.js 22 on a small Linux (Node already installed)
FROM node:22-slim

# 2. All work happens inside /app in the container
WORKDIR /app

# 3. Production mode
ENV NODE_ENV=production

# 4. Install OpenSSL. Prisma needs it to connect to PostgreSQL.
RUN apt-get update && apt-get install -y openssl

# 5. Copy the files that list which librarcies to install
COPY package.json package-lock.json ./

# 6. Install all libraries (this creates node_modules).
#    --ignore-scripts = skip automatic scripts inside the libraries
RUN npm install --ignore-scripts

# 7. Copy the Prisma schema + config (database structure)
COPY prisma ./prisma
COPY prisma.config.ts ./

# 8. Generate the Prisma client (the code that talks to the database)
RUN npx prisma generate

# 9. Copy your backend source code into the container
COPY src ./src

# 10. Open port 5000 to the outside world
EXPOSE 5000

# 11. On container start: first apply DB migrations, then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/server.ts"]