FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
COPY . .
# Install app dependencies
RUN npm install


# ARG DATABASE_URL
# ARG API_KEY

# ENV NODE_ENV production
# ENV DATABASE_URL ${DATABASE_URL}
# ENV API_KEY ${API_KEY}

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
