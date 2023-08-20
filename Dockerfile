# Use the official Node.js image as a base image
FROM node:18 AS builder

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install the application's dependencies
RUN yarn install

# Copy the rest of the application's code to the working directory
COPY . .

ARG DB_USER
ARG DB_HOST
ARG DB_DATABASE
ARG DB_PASSWORD
ARG DB_PORT
ENV DB_USER ${DB_USER}
ENV DB_HOST ${DB_HOST}
ENV DB_DATABASE ${DB_DATABASE}
ENV DB_PASSWORD ${DB_PASSWORD}
ENV DB_PORT ${DB_PORT}

# Build the Next.js app
RUN yarn build

# Start a new stage for the production image
FROM node:18-slim

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Set environment variables
ARG DB_USER
ARG DB_HOST
ARG DB_DATABASE
ARG DB_PASSWORD
ARG DB_PORT
ENV DB_USER=${DB_USER}
ENV DB_HOST=${DB_HOST}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_PORT=${DB_PORT}

EXPOSE 3000
# Specify the command to run when the container starts
CMD ["yarn", "start"]
