# Web Scraper

## Technologies

Web Scraper is built with:

- Docker
- Makefile
- Node.js 14 w/ express
- PostgresQL 10.4

## Running with Docker (recommended)

> Using a Makefile (if you don't have Make install, install it or run the commands inside the `Makefile`)

### Setup

- Start docker

### Running locally in development

```
make up
```

### Running locally in production

```
make up-prod
```

### Stop running container

```
make down
```

### Remove container

```
make rm
```

## Running without Docker

### Setup

- Copy the `.env.example` to `.env`

- Install Node v14 (recommended using NVM)

- Install dependencies:

        npm install

- Install PostgresQL 10.4

- Create the PostgresQL database `web-scraper`

- Initialize the PostgresQL database with file `./src/migrations/dbinit.sql`

### Running locally in development

- Run the program

        npm run dev

### Running locally in production

1.  Build the program

        npm run build

2.  Run the built program

        node ./build/app.js
