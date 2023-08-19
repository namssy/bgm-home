# Use the official Node.js image as a base image
FROM node:18

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package.json ./
COPY yarn.lock ./

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

# Specify the command to run when the container starts
CMD ["yarn", "start"]
