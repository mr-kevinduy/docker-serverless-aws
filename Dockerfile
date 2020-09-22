FROM maven:3.6-jdk-11

MAINTAINER KevinDuy<mr.kevinduy@gmail.com>

# https://github.com/SoftInstigate/maven-aws-docker/blob/master/Dockerfile
# https://github.com/SoftInstigate/serverless-docker
# https://github.com/anishkny/realworld-dynamodb-lambda/blob/master/serverless.yml 

RUN mkdir -p var/www/app

# Install packages
ADD install.sh /install.sh
RUN chmod +x /*.sh
RUN bash /install.sh

# Install serverless cli
RUN npm install -g serverless

ENTRYPOINT [ "serverless" ]
