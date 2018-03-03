#!/bin/sh
set -o errexit
set -o xtrace

# Publish documentation to the Monax website.

name=db.js
repository=monax.io
doc=$PWD/doc

# Use only the major and minor version numbers.
version=$(jq --raw-output .version package.json | cut -d . -f 1-2)

# Build
npm run doc
cd $HOME
git clone git@github.com:eris-ltd/$repository.git
cd $repository/content/docs/documentation
mkdir --parents $name
cd $name
rm --force --recursive $version
mv $doc $version
rm --force --recursive latest
cp --archive $version latest

# Commit and push.
git config user.name "Billings the Bot"
git config user.email "Billings@Monax.io"
git add --all
git commit --message "$name build number $CIRCLE_BUILD_NUM doc generation"
git push origin staging
