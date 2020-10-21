#!/bin/sh
docker-compose run app npm install && npm run build
docker build . -f docker/Dockerfile -t payments-service
