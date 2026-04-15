# Development Database

This project uses Docker Compose to run the development database.

## Start the database

Run:

```bash
pnpm run dk:start
```

This will start the development database defined for the project.

## Stop the database

When you are done, stop the containers with the matching shutdown command for this project.
If your project includes one, it is usually something like:

```bash
pnpm run dk:stop
```

If that script does not exist, use the Docker Compose command configured in the project.

## When to use it

Use the development database when you are:

- running the app locally
- testing database changes
- working on Prisma migrations or seed data

## Notes

- Make sure Docker is running before starting the database.
- Keep the database running while developing locally.
- If the app cannot connect, restart the database and check your environment variables.
