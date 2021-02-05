FROM node:latest
RUN  mkdir -p /root/src
WORKDIR   /root/src/
COPY   .  .
RUN  npm install
EXPOSE  3000
CMD  ["node", "app.js"]