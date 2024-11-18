# Dockerfile for React (frontend)
FROM node:16

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app/

# Build the React app
RUN npm run build

# Run the development server
CMD ["npm", "start"]
