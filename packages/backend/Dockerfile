FROM node:8
COPY package.json /app/package.json
RUN cd /app && yarn install && yarn
COPY . /app
WORKDIR /app
EXPOSE 8000/tcp
CMD yarn start
