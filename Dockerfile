# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy the package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app for production (this generates the dist/ folder)
RUN npm run build --verbose

# Stage 2: Serve app with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's default directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80
