### STAGE 1: Build ###
FROM hub.3tit.vn/rnd/node:12.16.1-stretch-slim AS build
WORKDIR /usr/src/app
RUN npm set registry http://npmjs.thinhtientech.com
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM hub.3tit.vn/rnd/devops/nginx:3t-final
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/
