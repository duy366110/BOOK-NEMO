# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /booknemo
COPY . .
RUN yarn install --production
CMD ["npm", "start"]