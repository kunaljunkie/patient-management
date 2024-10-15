import { config } from 'dotenv'; 
import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { fromEnv } from '@aws-sdk/credential-providers';

config()
const client = new Client({
  ...AwsSigv4Signer({
    region: `${process.env.AWS_REGION}`,
    getCredentials: fromEnv(), 
  }),
  node: process.env.AWS_DOMAIN_ENDPOINT,
});

const index = 'patients';

export const openSearchService = {
  indexPatient: async (patient: any) => {
    const result = await client.index({
      index,
      body: patient,
    });
    return result;
  },

  searchPatientsByCondition: async (condition: string) => {
    const result = await client.search({
      index,
      body: {
        query: {
          match: {
            conditions: condition,
          },
        },
      },
    });
    return result.body.hits.hits;
  },

  searchPatientsByPatientId: async (patientId: string) => {
    const result = await client.search({
      index,
      body: {
        query: {
          match: {
            patientId: patientId,
          },
        },
      },
    });
    return result.body.hits.hits;
  },

  updatePatientIndex: async (id: string, updatedData: any) => {
    const result = await client.update({
       index:index,
      id: id,
      body: {
        doc: updatedData,
      },
    });
    return result;
  },
};
