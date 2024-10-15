import express from "express";
import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
  searchPatientsByCondition,
} from "../controllers/patientController";
import { verifyToken } from "../middlewares/authentication";
import {
  confirmOTP,
  signin,
  signup,
} from "../controllers/cognitoSignupController";
import { validateCreatePatient, validateQueryByCondition, validateUpdatePatient } from "../middlewares/validations";


const router = express.Router();

router.post("/signup", signup);
router.post("/confirm", confirmOTP);
router.post("/signin", signin);

router.post("/patients", verifyToken,validateCreatePatient, createPatient);
router.put("/patients/:id", verifyToken,validateUpdatePatient, updatePatient);
router.delete("/patients/:id", verifyToken, deletePatient);
router.get("/patients", validateQueryByCondition,getPatients);
router.get("/patients/search",validateQueryByCondition, searchPatientsByCondition);

export default router;
