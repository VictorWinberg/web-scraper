import express from "express";
import bodyParser from "body-parser";
import Pool from "./config/db";
import CoworkersRouter from "./api/coworkers/coworkers-router";

class Server {
  private app;

  constructor() {
    this.app = express();
    this.config();
    this.routerConfig();
    this.dbConnect();
  }

  private config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private dbConnect() {
    Pool.connect(function (err, _client, _done) {
      if (err) throw new Error(err.message);
      console.log("Database connected");
    });
  }

  private routerConfig() {
    this.app.use("/api", CoworkersRouter);

    this.app.get("*", (_req, res) => {
      res.status(404).json({
        message: "404 - Route not found",
      });
    });
  }

  public start = (port: number) => {
    return new Promise((resolve, reject) => {
      this.app
        .listen(port, () => {
          resolve(port);
        })
        .on("error", (err: Object) => reject(err));
    });
  };
}

export default Server;
