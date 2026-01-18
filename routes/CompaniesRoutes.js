import express from "express";
import { getCompanies, createCompany,getCompaniesName} from "../controllers/CompaniesController.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/search", getCompaniesName);
router.post("/", createCompany);


export default router;