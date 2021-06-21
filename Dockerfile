FROM node:latest AS client
WORKDIR /app
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node
COPY client .
RUN pnpm install
RUN pnpm run build

# Deno is acting up
# FROM deno:latest AS server
# WORKDIR /app
# COPY server/* .
# RUN deno bumdle --unstable webserver.ts build

FROM denoland/deno:latest AS server
WORKDIR /app
COPY *.ts ./
RUN deno compile --allow-net --allow-read webserver.ts


FROM ubuntu:latest
WORKDIR /app
COPY --from=client /app/build ./client/build
COPY --from=server /app/webserver ./
EXPOSE 8000
CMD ["./webserver"]
