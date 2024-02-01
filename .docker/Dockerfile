FROM node:20.9.0

ARG COMMIT_HASH=""
ENV COMMIT_HASH=${COMMIT_HASH}

RUN echo "COMMIT_HASH: ${COMMIT_HASH}"

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY src src
EXPOSE 8080
CMD npm start
