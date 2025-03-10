import express from "express";
import { countriesList } from "../controllers/countryController.js";

const router = express.Router();

router.get("/all", countriesList);

export default router;
