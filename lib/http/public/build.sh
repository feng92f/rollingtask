#!/bin/bash

BASEDIR=$(dirname $0)

#copy stuff to deploy folder


mv index.ejs index.html

echo "copying assets into deploy folder..."
#清空和初始化部署目录

rm -rf $BASEDIR/deploy
mkdir $BASEDIR/deploy
mkdir $BASEDIR/deploy/js
mkdir $BASEDIR/deploy/css

cp $BASEDIR/js/main-built.js $BASEDIR/deploy/js/main-built.js

cp -R $BASEDIR/css $BASEDIR/deploy/
cp -R $BASEDIR/img $BASEDIR/deploy/img
cp $BASEDIR/index.html $BASEDIR/deploy/index.html
cp $BASEDIR/apple-touch-icon-precomposed.png $BASEDIR/deploy/apple-touch-icon-precomposed.png

# rewrite index.html

echo "rewriting script tag in" $BASEDIR"/deploy/templates/index.html"
#1. remove all current scripts
sed -i.bak '/<script.*\/script>/d' $BASEDIR/deploy/index.html

#2. replace <!-- MIN --> tag with min.js
sed -i.bak 's/<!-- MIN -->/<script src="js\/main-built.js"><\/script>/' $BASEDIR/deploy/index.html

#concate preload files 

#build js file
sh ./js-build.sh

#remove stuff no longer needed for deploy
echo "removing stuff no longer needed..."

#1. remove index.html backup
rm $BASEDIR/deploy/index.html.bak
#2. remove .DS_Store (if any)
find $BASEDIR/deploy -name .DS_Store -exec rm {} \;

mv index.html index.ejs

echo "code rolling well"

