FROM node:12.19.0-alpine3.12
COPY . /app
WORKDIR /app
RUN npm install --only=prod && \
    echo "ROOT_DIR=./build" >> .env && \
    echo "TYPEORM_URL=\$DATABASE_URL" >> .env && \
    echo "TYPEORM_MIGRATIONS=\$ROOT_DIR/infra/migration/*.js" >> .env && \
    echo "TYPEORM_MIGRATIONS_DIR=\$ROOT_DIR/infra/migration" >> .env
CMD npm start
