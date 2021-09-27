FROM node:16-alpine

# install node dependencies
RUN npm install -g npm@7.20.1 && \
    npm install -g @nestjs/cli && \
    npm install -g typeorm

# clean cache
RUN apk add --no-cache bash && \
    rm -rf /tmp/* /var/cache/apk/*

WORKDIR /authServer

# set right timezone
RUN apk add --no-cache tzdata && \
    ln -snf /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo Europe/Moscow > /etc/timezone

# setup server
COPY ./authServer.start.sh /tmp
EXPOSE ${AUTH_SERVER_CONTAINER_PORT}
ENTRYPOINT ["/bin/bash", "/tmp/authServer.start.sh"]