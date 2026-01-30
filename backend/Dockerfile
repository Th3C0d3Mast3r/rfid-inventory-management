FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of backend code
COPY . .

# Backend runs on 7500
EXPOSE 7500

# Start backend
CMD ["npm", "start"]
