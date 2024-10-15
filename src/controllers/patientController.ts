import { Request, Response } from "express";
import { Patient, createPatient as createNewPatient } from "../models/patient";
import { dynamoDBService } from "../services/dynamoDBService";
import { openSearchService } from "../services/openSearchService";
import { error } from "console";
import logger from "../utils/logger";

export const createPatient = async (req: Request, res: Response) => {
  const { name, address, conditions, allergies } = req.body;
  const patient = createNewPatient(name, address, conditions, allergies);

  try {
    await dynamoDBService.createPatient(patient);
    await openSearchService.indexPatient(patient);
    res.status(201).json({ data: patient, message: "patient created" });
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error creating patient", data: err });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  const { address, condition } = req.query;
  try {
    if (address) {
      const patients = await dynamoDBService.findPatientsByAddress(
        address as string
      );
      if (patients) {
        res.status(200).json({ data: patients, message: "patients found" });
      } else {
        res.status(412).json({ data: patients, message: "patients not found" });
      }
    } else if (condition) {
      const patients = await openSearchService.searchPatientsByCondition(
        condition as string
      );
      if (patients) {
        res.status(200).json({ data: patients, message: "patients found" });
      } else {
        res.status(412).json({ data: patients, message: "patients not found" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Provide a valid query address or condition" });
    }
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error fetching patients" });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, conditions, allergies } = req.body;
  try {
    let openSearchCheckForUpdate: any;
    let openSearchData: any = {};
    const updatedPatient = await dynamoDBService.updatePatient(id, {
      name,
      address,
      conditions,
      allergies,
    });
    const checkPatient = await openSearchService.searchPatientsByPatientId(id);
    if (checkPatient.length) {
      const openSearchID = checkPatient[0]._id;
      openSearchCheckForUpdate = await openSearchService.updatePatientIndex(
        openSearchID,
        updatedPatient
      );
      if (
        openSearchCheckForUpdate &&
        openSearchCheckForUpdate.body.result == "updated"
      ) {
        openSearchData = await openSearchService.searchPatientsByPatientId(id);
      } else {
        openSearchData = openSearchCheckForUpdate;
      }
    }
    res
      .status(200)
      .json({
        data: updatedPatient,
        openSearch: openSearchData,
        message: "data updated",
      });
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error updating patient" });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await dynamoDBService.deletePatient(id);
    res.status(204).json({ data: data, message: "patient is deleted" });
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error deleting patient" });
  }
};

export const searchPatientsByCondition = async (
  req: Request,
  res: Response
) => {
  const { condition } = req.query;
  try {
    const patients = await openSearchService.searchPatientsByCondition(
      condition as string
    );
    res.status(201).json(patients);
  } catch (err) {
    logger.error("error", { stack: err });
    res.status(500).json({ error: "Error searching patients by condition" });
  }
};
