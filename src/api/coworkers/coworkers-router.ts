import { Router } from "express";
import CoworkersController from './coworkers-controller';

const router = Router();
const controller = new CoworkersController();

router.get("/coworkers", controller.get)

export default router;
