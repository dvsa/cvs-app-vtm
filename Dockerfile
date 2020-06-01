FROM node:10.20.1-stretch-slim

WORKDIR /www

COPY package.* /www/
RUN npm i
COPY . .
EXPOSE 4200
# TODO: For pipeline add build instead and use ngix layer to serve /dist
# Need Docker registry first
CMD node_modules/.bin/ng serve --host 0.0.0.0 