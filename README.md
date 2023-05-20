# nak-chat

This is a simple messaging project with SignalR. It includes a client (which is also a PWA) and the messaging server. 

## Setup

### Server
Add an `.env` file in the root of the repo directory. 

Your must include the following environment variables to setup the messaging server:

- `REDIS_PASSWORD=YOUR_SECRET`
- `REDIS_PORT=6379`
- `REDIS_HOST=YOUR_HOSTNAME`

- `KESTREL_SSL_PASSWORD=YOUR_DEV_CERT_PASSWORD`
- `KESTREL_SSL_PATH=YOUR_DEV_CERT_CONTAINER_PATH`

Once these environment variables are filled run the command below:

```bash
docker compose up -d
```
### Client

Change the directory to the client project:
```bash
$ cd source/nak-chat-client
$ yarn install
$ yarn dev
```

Dev Environment all setup!

