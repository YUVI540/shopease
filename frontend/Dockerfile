# Stage 1 — Build React app
FROM node:18-alpine AS build
WORKDIR /app

# Fix npm version warning
RUN npm install -g npm@9.8.1

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

ENV CI=false
ENV GENERATE_SOURCEMAP=false
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 10000
CMD ["nginx", "-g", "daemon off;"]
