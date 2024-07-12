#!/bin/sh
BASE_DIR=/usr/share/nginx/html
MAIN_CONFIG_FILE=main.min.js
MAIN_BASE_CONFIG_FILE=main.min.js.template
MAIN_TEMP_CONFIG_FILE=main.min.js.template.tmp

cp $BASE_DIR/js/$MAIN_BASE_CONFIG_FILE $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE

# Replace placeholders with environment variables
sed -i "s|{{ENV_ENABLE_CONTAINER}}|true|g" $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE
sed -i "s|{{ENV_API_SERVER}}|${ENV_API_SERVER}|g" $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE
sed -i "s|{{ENV_API_TOKEN}}|${ENV_API_TOKEN}|g" $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE
sed -i "s|{{ENV_WS_SERVER}}|${ENV_WS_SERVER}|g" $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE

sed -i "s|{{ENV_API_VERSION}}|${ENV_API_VERSION}|g" $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE
sed -i "s|{{ENV_UI_VERSION}}|${ENV_UI_VERSION}|g" $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE
sed -i "s|{{ENV_TEXT_EXTRAS}}|${ENV_TEXT_EXTRAS}|g" $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE

# Move the processed template to the final location
mv $BASE_DIR/js/$MAIN_TEMP_CONFIG_FILE $BASE_DIR/js/$MAIN_CONFIG_FILE

# Execute the command passed to the script (i.e., start Nginx)
exec "$@"