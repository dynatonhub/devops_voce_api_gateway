FROM node:18-alpine
WORKDIR /user/src/app
COPY . .
RUN yarn
RUN npx prisma generate
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]