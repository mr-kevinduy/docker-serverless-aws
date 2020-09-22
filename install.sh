#!/bin/bash

apt-get update

# Install aws cli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Install ecs cli
curl -Lo /usr/local/bin/ecs-cli \
https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest
chmod +x /usr/local/bin/ecs-cli

# Install node.js and yarn
rm -rf /var/lib/apt/lists/*
curl -sL https://deb.nodesource.com/setup_12.x > node_install.sh
chmod +x ./node_install.sh
./node_install.sh
curl -sS http://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y apt-utils nodejs yarn groff rsync
