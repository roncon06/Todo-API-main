import { PrismaClient } from "@prisma/client";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { opts, specs } from "./common/swagger/swagger-config";
import { errorMiddleware } from "./common/middlewares/error-handler.middleware";
import taskRoutes from "./task/task.router";
import appRoutes from "./routes";

const prismaClient = new PrismaClient();

export class App {
  app: express.Application;

  constructor() {
    this.app = express();
    this.cors();
    this.database();
    this.middlewares();
    this.routes();
    this.app.use(errorMiddleware);
  }

  private cors(){
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, PATCH");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      next();
    });
  }

  private middlewares() {
    // this.app.use(cors());

    this.app.use(express.json());
  }

  private routes() {
    this.app.use("/api", swaggerUi.serve, swaggerUi.setup(specs, opts));
    this.app.use(appRoutes);
    this.app.use(taskRoutes);
  }

  private async database() {
    await prismaClient
      .$connect()
      .then(() => {
        console.log("Connected to database!");
      })
      .catch(async (error) => {
        await prismaClient.$disconnect();
        console.error("Error connecting to database: ", error);
      });
  }
}

export default new App().app;
