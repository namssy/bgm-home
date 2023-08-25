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

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

RUN npx prisma generate
# Build the Next.js app
RUN yarn build

# Start a new stage for the production image
FROM node:18-slim

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app ./

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

EXPOSE 3000
# Specify the command to run when the container starts
CMD ["yarn", "start"]
