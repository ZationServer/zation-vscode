FROM node:12.21.0

LABEL appName="{{name}/kc}"
LABEL version="0.0.1"
LABEL description="{{description}}"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN npm install

RUN npm install pm2 -g

RUN npm run build

RUN rm -rf /usr/src/src

EXPOSE {{port}}

CMD ["npm", "run", "start:docker"]