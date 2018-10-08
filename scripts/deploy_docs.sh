#!/bin/bash

# This script is designed for running within Travis only, to push the portal documentation to an S3 bucket.
# It assumes the following environment variables have been set in Travis:
# DOCS_S3_BUCKET
# APP_BUCKET_FOLDER

# This is needed for Travis to fail script immediately on any errors in external commands
set -ev

pip install --user awscli
aws configure set aws_access_key_id $DEV_AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $DEV_AWS_SECRET_ACCESS_KEY
aws configure set region $REGION

FULL_BUCKET_PATH=$DOCS_S3_BUCKET/$APP_BUCKET_FOLDER

echo "Deploying docs to S3 bucket: $FULL_BUCKET_PATH"

aws s3 sync documentation s3://$FULL_BUCKET_PATH --delete
