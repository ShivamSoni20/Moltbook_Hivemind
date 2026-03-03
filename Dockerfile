# Node.js 20 base image
FROM node:20-slim

# Set working directory to root
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install project-wide dependencies
RUN npm install

# Copy the entire workspace (agents + docs + demo)
COPY . .

# Environment variables will be provided by Railway
ENV NODE_ENV=production

# The start script is in the root package.json
CMD ["npm", "start"]
