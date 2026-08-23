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
      Role: { type: "string", enum: ["ADMIN", "MEMBER"] },
      Priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
      Status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE"] },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { $ref: "#/components/schemas/Role" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          createdBy: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ProjectProgress: {
        type: "object",
        properties: {
          totalTasks: { type: "integer" },
          todoTasks: { type: "integer" },
          inProgressTasks: { type: "integer" },
          completedTasks: { type: "integer" },
          progressPercentage: { type: "integer" },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          priority: { $ref: "#/components/schemas/Priority" },
          status: { $ref: "#/components/schemas/Status" },
          deadline: { type: "string", format: "date-time" },
          assignedTo: { type: "string", format: "uuid", nullable: true },
          createdBy: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      DeadlineChange: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          taskId: { type: "string", format: "uuid" },
          oldDeadline: { type: "string", format: "date-time" },
          newDeadline: { type: "string", format: "date-time" },
          changedBy: { type: "string", format: "uuid" },
          changedAt: { type: "string", format: "date-time" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          taskId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          user: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
          errors: {
            type: "array",
            items: { type: "object" },
            description: "Present on validation failures only",
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
