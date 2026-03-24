import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import usersRouter from "./users";
import emailsRouter from "./emails";
import tasksRouter from "./tasks";
import leaderboardRouter from "./leaderboard";
import claudeRouter from "./claude";
import aiRouter from "./ai";
import dealsRouter from "./deals";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(usersRouter);
router.use(emailsRouter);
router.use(tasksRouter);
router.use(leaderboardRouter);
router.use(claudeRouter);
router.use(aiRouter);
router.use(dealsRouter);

export default router;
