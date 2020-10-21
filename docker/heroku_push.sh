#!/bin/bash
./docker/build_production_image.sh
docker tag payments-service:latest registry.heroku.com/payments-service-$TRAVIS_BRANCH/web
echo "$HEROKU_API_KEY" | docker login --username=_ --password-stdin registry.heroku.com
docker push registry.heroku.com/payments-service-$TRAVIS_BRANCH/web
curl https://cli-assets.heroku.com/install.sh | sh  #install heroku
heroku container:release web -a payments-service-$TRAVIS_BRANCH
