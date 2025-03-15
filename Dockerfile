# Use a lightweight Node.js image
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i --legacy-peer-deps

# Copy the rest of the app's source code
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight server to serve the built files
FROM nginx:alpine AS runner

# Remove the default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
