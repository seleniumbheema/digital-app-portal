#!/bin/bash

##################################################################################
# This script is used by the AWS Elastic beanstalk deployment.
#
# The purpose of this script is to export any required environment variables, and
# then rewrite the esure-env.js file with env vars from the elastic beanstalk
# environment, finally starting the nginx server
##################################################################################

echo "Exporting RECAPTCHA_SITEKEY environment variable by calling AWS parameter store..."
export RECAPTCHA_SITEKEY=$(aws ssm get-parameters --name /${ENV}/digital-app-portal/google-recaptcha-sitekey --with-decryption --region eu-west-1 --query Parameters[0].Value --output text)

if [ "$RECAPTCHA_SITEKEY" = "None" ]; then
  export RECAPTCHA_SITEKEY=""
  echo "ERROR: Unable to obtain param name: /${ENV}/digital-app-portal/google-recaptcha-sitekey"
fi

echo 'Setting NG environment file...'
echo CHANGES..
cat CHANGES

VERSION=$(<VERSION)
ENVJS=dist/scripts/esure-env.js

cat <<HERE >$ENVJS
window['esure-env'] = {
	XAPI_URL: '${XAPI_URL}',
	TAG_MANAGER_URL: '${TAG_MANAGER_URL}',
	OPTIMIZELY_URL: '${OPTIMIZELY_URL}',
	SITE_CAT_ACCOUNT: '${SITE_CAT_ACCOUNT}',
	VERSION: '${VERSION}',
  BRAND_URL: '${BRAND_URL}',
  LIVECHAT_URL: '${LIVECHAT_URL}',
  IOVATION_URL: '${IOVATION_URL}',
  RECAPTCHA_SITEKEY: '${RECAPTCHA_SITEKEY}'
};
HERE

cat $ENVJS


#######################################
echo 'Starting NGINX...'
exec nginx -g 'daemon off;'

#######################################
echo 'Done.'
