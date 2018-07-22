import { schema } from 'normalizr';

const stateSchema = new schema.Entity('state');
const countySchema = new schema.Entity('counties');

const candidateSchema = new schema.Entity('candidates');
export const candidateListSchema = [candidateSchema];

export const stateCounties = {
  state: stateSchema,
  counties: [countySchema],
};
