# FROM node:16-alpine as builder
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
COPY . .
# Install app dependencies
RUN npm install
RUN npm install -g serve
ARG REACT_APP_TOKEN_ENDPOINT
ENV REACT_APP_TOKEN_ENDPOINT ${REACT_APP_TOKEN_ENDPOINT}
RUN npm run build

# FROM nginx
# COPY --from=builder /usr/src/build /usr/share/nginx/html

EXPOSE 3000
# CMD [ "npm", "run", "dev" ]
CMD [ "serve", "-s", "build" ]
