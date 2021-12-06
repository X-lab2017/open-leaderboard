FROM node:lts
RUN npm install \
    && npm run build

EXPOSE 3000

CMD ["serve","-s","build"]