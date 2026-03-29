# Todo List REST API

## About
This project is a simple RESTful API for managing a Todo list, built with [NestJS](https://nestjs.com/). The API was generated using Claude Code and leverages modern technologies such as:

- **NestJS** (Node.js framework)
- **TypeScript**
- **TypeORM** (with PostgreSQL)
- **class-validator** and **class-transformer** (for DTO validation)

My goal as a DevOps Engineer is to configure and adapt this project to be production-ready, ensuring best practices for deployment, scalability, and maintainability.

## Folder Structure
```
todo-project/
├── .env                        # Environment variables for local/dev/prod
├── api.http                    # REST Client requests for API testing
├── devops.md                   # DevOps and deployment instructions
├── devops/
│   └── docker/
│       ├── Dockerfile          # Docker build instructions for the app
│       └── compose.yml         # Docker Compose for local/dev
├── nest-cli.json               # NestJS CLI configuration
├── package.json                # Project metadata and npm scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.build.json         # TypeScript build configuration
├── src/
│   ├── app.module.ts           # Main application module
│   ├── app.module.spec.ts      # App module tests
│   ├── main.ts                 # Application entry point
│   └── todos/
│       ├── todos.controller.ts       # Todos API controller
│       ├── todos.controller.spec.ts  # Todos controller tests
│       ├── todos.module.ts           # Todos feature module
│       ├── todos.service.ts          # Todos business logic
│       ├── todos.service.spec.ts     # Todos service tests
│       ├── dto/
│       │   ├── create-todo.dto.ts    # DTO for creating todos
│       │   └── update-todo.dto.ts    # DTO for updating todos
│       └── entities/
│           └── todo.entity.ts        # Todo entity definition
├── README.md                   # Project overview and usage
```

## Available npm Commands
- `npm run start` — Start the application
- `npm run start:dev` — Start in development mode (with hot reload)
- `npm run build` — Build the project
- `npm run test` — Run all tests
- `npm run test:watch` — Run tests in watch mode
- `npm run test:cov` — Run tests with coverage
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier

## Available Routes
All routes are prefixed with `/todos`:

- `POST   /todos` — Create a new todo
- `GET    /todos` — Get all todos
- `GET    /todos/:id` — Get a todo by ID
- `PATCH  /todos/:id` — Update a todo by ID
- `DELETE /todos/:id` — Delete a todo by ID

### Example Todo Object
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "completed": false,
  "createdAt": "2026-03-22T00:00:00.000Z",
  "updatedAt": "2026-03-22T00:00:00.000Z"
}
```

## DevOps
To understand how this project is built from scratch, from DevOps setup to deployment, please refer to the [devops.md](devops.md) file. There you will find professional, step-by-step instructions:

Follow the DevOps section to ensure a smooth and reliable workflow from initial setup to production deployment.

---

Feel free to contribute or use this project as a starting point for your own NestJS REST APIs!
