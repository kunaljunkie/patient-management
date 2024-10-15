import { Patient } from '../models/patient';
import { dynamoDBClient } from './awsConfig';
const TableName = 'Patients';

export const dynamoDBService = {
  createPatient: async (patient: Patient) => {
    const params = {
      TableName,
      Item: patient,
    };
    const result = await dynamoDBClient.put(params).promise();
    return result
  },

  findPatientsByAddress: async (address: string) => {
    const params = {
      TableName,
      IndexName: 'AddressIndex', 
      KeyConditionExpression: 'address = :address',
      ExpressionAttributeValues: {
        ':address': address,
      },
    };
    const result = await dynamoDBClient.query(params).promise();
    return result.Items;
  },

  findPatientsByCondition: async (condition: string) => {
    const params = {
      TableName,
      IndexName: 'ConditionIndex', 
      KeyConditionExpression: 'conditions = :condition',
      ExpressionAttributeValues: {
        ':condition': condition,
      },
    };
    const result = await dynamoDBClient.query(params).promise();
    return result.Items;
  },

  updatePatient: async (patientId: string, data: Partial<Patient>) => {
    const params = {
      TableName,
      Key: { patientId },
      UpdateExpression: 'set #name = :name, #address = :address, #conditions = :conditions, #allergies = :allergies',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#address': 'address',
        '#conditions': 'conditions',
        '#allergies': 'allergies',
      },
      ExpressionAttributeValues: {
        ':name': data.name,
        ':address': data.address,
        ':conditions': data.conditions,
        ':allergies': data.allergies,
      },
      ReturnValues: 'ALL_NEW',
    };
    const result = await dynamoDBClient.update(params).promise();
    return result.Attributes;
  },

  deletePatient: async (patientId: string) => {
    const params = {
      TableName,
      Key: { patientId },
    };
   const result =  await dynamoDBClient.delete(params).promise();
   return result
  },
};
