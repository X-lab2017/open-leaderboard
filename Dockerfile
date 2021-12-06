FROM node:lts
RUN mkdir -p /home/Service
WORKDIR /home/Service

COPY . /home/Service
RUN npm install \
    && npm run build \
    && npm install -g serve

EXPOSE 3000

CMD ["serve","-s","build"]