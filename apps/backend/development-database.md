# Development Database

This project uses Docker Compose to run a local PostgreSQL development database and pgAdmin.

## Services

The Docker Compose setup includes:

- **PostgreSQL 15**
- **pgAdmin 4**

## Database settings

The development PostgreSQL database uses:

```txt
Database: postgres
Username: development
Password: W1yN4vhSQab2G5qp
Host: localhost
Port: 5432
```

Your local database URL will usually look like this:

```env
DATABASE_URL="postgresql://development:W1yN4vhSQab2G5qp@localhost:5432/postgres"
```

## Start the database

Run:

```bash
pnpm run dk:start
```

This starts the PostgreSQL development database and pgAdmin using Docker Compose.

## Stop the database

When you are done, stop the containers with:

```bash
pnpm run dk:stop
```

If that script does not exist, use the Docker Compose command configured for the project.

For example:

```bash
docker compose down
```

## pgAdmin

pgAdmin is available at:

```txt
http://localhost:5050
```

Login with:

```txt
Email: admin@admin.com
Password: admin
```

To connect pgAdmin to the database, create a new server with:

```txt
Host: postgres
Port: 5432
Database: postgres
Username: development
Password: W1yN4vhSQab2G5qp
```

Use `postgres` as the host inside pgAdmin because both containers are on the same Docker network.

## Docker Compose configuration

```yaml
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=development
      - POSTGRES_PASSWORD=W1yN4vhSQab2G5qp
    ports:
      - "5432:5432"
    networks:
      - prisma-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U development -d postgres"]
      interval: 5s
      timeout: 2s
      retries: 20
    volumes:
      - postgres_data:/var/lib/postgresql/data
    logging:
      options:
        max-size: "10m"
        max-file: "3"

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    networks:
      - prisma-network

networks:
  prisma-network:

volumes:
  postgres_data:
```

## When to use it

Use the development database when you are:

- running the app locally
- testing database changes
- working on Prisma migrations
- testing seed data
- inspecting data through pgAdmin

## Notes

- Make sure Docker is running before starting the database.
- Keep the database running while developing locally.
- If the app cannot connect, check your `DATABASE_URL`.
- If Prisma cannot connect, restart the database and wait for the healthcheck to pass.
- The database data is stored in the `postgres_data` Docker volume, so it will persist after stopping the containers.
