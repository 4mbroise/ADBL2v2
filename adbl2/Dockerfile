FROM node:lts-alpine

COPY adbl2/ adbl2/

WORKDIR adbl2

RUN npm install
EXPOSE 27019

CMD ["npm", "run", "dev"]
