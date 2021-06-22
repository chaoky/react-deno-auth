FROM node:latest AS client
WORKDIR /app
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm install
COPY * ./
RUN pnpm run build

FROM denoland/deno:latest AS server
WORKDIR /app
COPY *.ts ./
RUN deno compile --allow-net --allow-read webserver.ts

FROM debian:latest
WORKDIR /app
COPY --from=server /app/webserver .
COPY --from=client /app/build  ./client/build
EXPOSE 8000
CMD ["./webserver"]
