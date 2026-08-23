import swaggerJsdoc from "swagger-jsdoc";

const definition = {
  openapi: "3.0.3",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description:
      "TaskFlow backend API. Authentication uses short-lived JWT access tokens (Bearer) and a httpOnly refresh-token cookie.",
  },
  servers: [
    {
      url: "/api",
      description: "Current host",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Projects" },
    { name: "Tasks" },
    { name: "Comments" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      refreshTokenCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
      },
    },
    schemas: {
      Role: {
        type: "string",
        description: "User role. ADMIN can manage projects, tasks and users; MEMBER is a participant.",
        enum: ["ADMIN", "MEMBER"],
      },
      Priority: {
        type: "string",
        description: "Task urgency.",
        enum: ["LOW", "MEDIUM", "HIGH"],
      },
      Status: {
        type: "string",
        description: "Task workflow state.",
        enum: ["TODO", "IN_PROGRESS", "DONE"],
      },
      User: {
        type: "object",
        description: "Registered account.",
        required: ["id", "name", "email", "role", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid", description: "Unique user ID." },
          name: { type: "string", example: "Ayesha Khan", description: "Display name." },
          email: { type: "string", format: "email", example: "ayesha@example.com", description: "Unique login email." },
          role: {
            type: "string",
            description: "User role. ADMIN manages users/projects/tasks; MEMBER participates.",
            enum: ["ADMIN", "MEMBER"],
          },
          createdAt: { type: "string", format: "date-time", example: "2026-08-23T10:00:00.000Z", description: "Account creation timestamp." },
        },
      },
      Project: {
        type: "object",
        description: "Container for tasks with a member list.",
        required: ["id", "name", "createdBy", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid", description: "Unique project ID." },
          name: { type: "string", example: "Website Redesign", description: "Project title." },
          description: { type: "string", nullable: true, example: "Revamp the marketing site", description: "Optional summary." },
          createdBy: { type: "string", format: "uuid", description: "User ID of the project creator." },
          createdAt: { type: "string", format: "date-time", example: "2026-08-23T10:00:00.000Z" },
        },
      },
      ProjectProgress: {
        type: "object",
        description: "Task counters for a single project, returned by GET /projects/{id}.",
        required: ["totalTasks", "todoTasks", "inProgressTasks", "completedTasks", "progressPercentage"],
        properties: {
          totalTasks: { type: "integer", example: 12 },
          todoTasks: { type: "integer", example: 5 },
          inProgressTasks: { type: "integer", example: 4 },
          completedTasks: { type: "integer", example: 3 },
          progressPercentage: { type: "integer", minimum: 0, maximum: 100, example: 25, description: "completedTasks / totalTasks, rounded." },
        },
      },
      Task: {
        type: "object",
        description: "Unit of work inside a project.",
        required: ["id", "projectId", "title", "priority", "status", "deadline", "createdBy", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid", description: "Unique task ID." },
          projectId: { type: "string", format: "uuid", description: "Owning project." },
          title: { type: "string", example: "Design homepage hero section" },
          description: { type: "string", nullable: true, example: "Two hero variants for A/B testing" },
          priority: {
            type: "string",
            description: "Urgency of the task.",
            enum: ["LOW", "MEDIUM", "HIGH"],
          },
          status: {
            type: "string",
            description: "Workflow state, defaults to TODO on creation.",
            enum: ["TODO", "IN_PROGRESS", "DONE"],
          },
          deadline: { type: "string", format: "date-time", example: "2026-09-15T18:00:00.000Z", description: "Due date; changes are logged to deadline history." },
          assignedTo: { type: "string", format: "uuid", nullable: true, description: "Assignee user ID; must be an active project member when set." },
          createdBy: { type: "string", format: "uuid", description: "User ID who created the task." },
          createdAt: { type: "string", format: "date-time", example: "2026-08-23T10:00:00.000Z" },
        },
      },
      DeadlineChange: {
        type: "object",
        description: "Audit entry created whenever a task's deadline changes.",
        required: ["id", "taskId", "oldDeadline", "newDeadline", "changedBy", "changedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          taskId: { type: "string", format: "uuid" },
          oldDeadline: { type: "string", format: "date-time", example: "2026-09-01T18:00:00.000Z" },
          newDeadline: { type: "string", format: "date-time", example: "2026-09-15T18:00:00.000Z" },
          changedBy: { type: "string", format: "uuid", description: "User who made the change." },
          changedAt: { type: "string", format: "date-time", example: "2026-08-23T12:30:00.000Z" },
        },
      },
      Comment: {
        type: "object",
        description: "Discussion message attached to a task.",
        required: ["id", "taskId", "userId", "content", "createdAt", "user"],
        properties: {
          id: { type: "string", format: "uuid" },
          taskId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid", description: "Author's user ID." },
          content: { type: "string", example: "Looks great! Can we try a darker shade for the CTA button?", maxLength: 5000 },
          createdAt: { type: "string", format: "date-time", example: "2026-08-23T12:35:00.000Z" },
          user: {
            type: "object",
            description: "Author details, embedded for display.",
            required: ["id", "name", "email"],
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string", example: "Ayesha Khan" },
              email: { type: "string", format: "email", example: "ayesha@example.com" },
            },
          },
        },
      },
      ValidationErrorItem: {
        type: "object",
        description: "Single field-level validation failure (Zod issue).",
        required: ["path", "message", "code"],
        properties: {
          path: { type: "array", items: { type: "string" }, example: ["body", "email"], description: "Location of the invalid field." },
          message: { type: "string", example: "Invalid email address" },
          code: { type: "string", example: "invalid_string" },
        },
      },
      Error: {
        type: "object",
        description: "Standard error envelope returned by all endpoints on failure.",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            description: "Field-level details, present only on validation failures (HTTP 400).",
            items: { $ref: "#/components/schemas/ValidationErrorItem" },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  definition,
  apis: ["src/modules/**/*.routes.ts"],
};

export const openapiSpec = swaggerJsdoc(options);
