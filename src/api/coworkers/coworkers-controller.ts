import { Request, Response } from "express";
import Pool from "../../config/db";

class CoworkersController {
  public async get(_req: Request, res: Response) {
    try {
      const client = await Pool.connect();

      const sql = "SELECT * FROM users ORDER BY id";
      const { rows } = await client.query(sql);
      const users = rows;

      client.release();

      res.send(users);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default CoworkersController;
