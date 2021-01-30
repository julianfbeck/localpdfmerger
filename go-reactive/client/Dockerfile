# build environment
FROM node:15.7.0-alpine3.10 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn install 
RUN yarn global add  --ignore-optional react-scripts 
COPY ./scripts ./
COPY . ./
RUN node scripts/build.js

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]