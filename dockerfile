FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
COPY . .
# Install app dependencies
RUN npm install


ARG REACT_APP_TOKEN_ENDPOINT
ENV REACT_APP_TOKEN_ENDPOINT ${REACT_APP_TOKEN_ENDPOINT}

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
