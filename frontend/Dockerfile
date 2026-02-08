# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Inject VITE_API_URL during build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build Vite app
RUN npm run build


# =========================
# Production stage
# =========================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template to the templates directory
# Nginx's default entrypoint automatically runs envsubst on files in /etc/nginx/templates/
# and outputs them to /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose the port (Railway will override the PORT env var, but default to 3000)
ENV PORT=3000
EXPOSE 3000

# Use default CMD from nginx image to ensure entrypoint scripts run
# ensuring environment variables are substituted
CMD ["nginx", "-g", "daemon off;"]
