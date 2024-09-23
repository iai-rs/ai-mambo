FROM node:21-alpine

RUN npm install -g pnpm

# Create a directory to hold the application code inside the image
WORKDIR /usr/src/app

# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY prisma ./prisma/

# If you are building your code for production
# RUN npm ci --only=production
RUN pnpm install

RUN pnpm prisma generate

# Bundle app source
COPY . .

# Build the Next.js app
# RUN pnpm build

# Next.js collects completely on the server side and serves static assets.
# If you are using Next.js 9 or newer it might be necessary to use next start
CMD [ "pnpm", "build-and-start"]

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000
