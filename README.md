## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Docker

Using composer
```bash
docker compose up
```

or just build image
```bash
docker build -t nextjs-docker .
```

Start docker container: 

```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_PATH=http://192.168.0.14/api nextjs-docker
```
