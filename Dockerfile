FROM node:18-bullseye-slim
# FROM node:18-alpine

# Accept build arguments
ARG DATABASE_URL
ARG ORACLE_S3_KEY_FILE_ENCODED
ARG ORACLE_S3_USER
ARG ORACLE_S3_TENANCY
ARG ORACLE_S3_FINGERPRINT
ARG ORACLE_NAMESPACE_NAME
ARG MINIO_SECRET_KEY
ARG MINIO_ACCESS_KEY
ARG MINIO_ENDPOINT
ARG NEXTAUTH_URL
ARG AUTH_TRUST_HOST

# Set environment variables
ENV DATABASE_URL=$DATABASE_URL
ENV ORACLE_S3_KEY_FILE_ENCODED=$ORACLE_S3_KEY_FILE_ENCODED
ENV ORACLE_S3_USER=$ORACLE_S3_USER
ENV ORACLE_S3_TENANCY=$ORACLE_S3_TENANCY
ENV ORACLE_S3_FINGERPRINT=$ORACLE_S3_FINGERPRINT
ENV ORACLE_NAMESPACE_NAME=$ORACLE_NAMESPACE_NAME
ENV MINIO_SECRET_KEY=$MINIO_SECRET_KEY
ENV MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY
ENV MINIO_ENDPOINT=$MINIO_ENDPOINT
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST

# RUN wget http://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/libcrypto1.1-1.1.1u-r1.apk && \
    # wget http://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/libssl1.1-1.1.1u-r1.apk && \
    # wget http://dl-cdn.alpinelinux.org/alpine/v3.18/community/x86_64/openssl1.1-compat-dev-1.1.1u-r1.apk

# RUN apk add --allow-untrusted libcrypto1.1-1.1.1u-r1.apk && \
    # apk add --allow-untrusted libssl1.1-1.1.1u-r1.apk && \
    # apk add --allow-untrusted openssl1.1-compat-dev-1.1.1u-r1.apk

# RUN rm -f libcrypto1.1-1.1.1u-r1.apk libssl1.1-1.1.1u-r1.apk openssl1.1-compat-dev-1.1.1u-r1.apk

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
RUN pnpm build

# Next.js collects completely on the server side and serves static assets.
# If you are using Next.js 9 or newer it might be necessary to use next start
# CMD [ "pnpm", "build-and-start"]
# CMD [ "pnpm", "dev"]
CMD [ "pnpm", "start"]

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000
