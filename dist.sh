#!/bin/bash
MAIN_CONFIG_FILE=main.min.js
MAIN_TEMP_CONFIG_FILE=main.min.js.template

echo "Compiling UI ..."
grunt compile

echo "Removing old build directory ..."
rm -rf ./dist
mkdir -p ./dist/{views,js,css,fonts,img}


echo "Copying built files ..."
cp -rp public/views/** dist/views/
cp -rp public/js/*.min.js dist/js/
cp -rp public/css/*.min.css dist/css/
cp -rp public/fonts/** dist/fonts/
cp -rp public/img/** dist/img/
cp -rp public/index.html     dist/
cp -rp public/robots.txt     dist/
# Used for docker env update later - see docker_statup.sh

echo "Creating template file ..."
cp dist/js/$MAIN_CONFIG_FILE dist/js/$MAIN_TEMP_CONFIG_FILE
