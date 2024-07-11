# ./customize.sh vrsc
# ./customize.sh pbaas/varrr
SOURCE=custom/$1
DEST_ROOT=public/
DEST_APP=$DEST_ROOT/src/js/
DEST_IMG1=$DEST_ROOT/img/
DEST_CSS1=$DEST_ROOT/src/css/
DEST_ICON=$DEST_IMG1/icons/

cp -p $SOURCE/index.html $DEST_ROOT
cp -p $SOURCE/*.css $DEST_CSS1
cp -p $SOURCE/*.png $DEST_IMG1
cp -p $SOURCE/icons/favicon.ico $DEST_ICON
cp -p $SOURCE/app_conf.js $DEST_APP