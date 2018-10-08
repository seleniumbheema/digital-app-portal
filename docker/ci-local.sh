#!/bin/bash

# This script is used by the travis ci pipeline.
#
# The purpose of this script is to build the es, sw, fa, and documentation sites
# ready to be placed into docker containers.
#

START_TIME=$SECONDS

# Remove any previous local ci installs
rm -rf docker/dist_es
rm -rf docker/dist_sw
rm -rf docker/dist_fa
docker-compose down

# Build each job and place into a local folder ready for docker
npm run ci:es
mv dist docker/dist_es
npm run ci:sw
mv dist docker/dist_sw
npm run ci:fa
mv dist docker/dist_fa

# Add each into a docker container and serve on localhost
docker-compose up -d

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "The installation took: $(($ELAPSED_TIME/60)) min $(($ELAPSED_TIME%60)) sec"
