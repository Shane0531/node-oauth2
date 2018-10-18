FROM node:8.11.2-slim
RUN groupadd -r makestar && useradd -m -r -g makestar makestar
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
RUN npm i yarn@1.7.0 -g
COPY . /usr/src/app
RUN yarn
RUN chown -R makestar:makestar /usr/src/app/
USER makestar
EXPOSE 9999
CMD yarn start
