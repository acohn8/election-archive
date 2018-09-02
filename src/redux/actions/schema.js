import { schema } from 'normalizr';

const resultSchema = new schema.Entity('results');
export const resultListSchema = [resultSchema];

const candidateSchema = new schema.Entity('candidates');
export const candidateListSchema = [candidateSchema];

const officeSchema = new schema.Entity('offices');
export const officeListSchema = [officeSchema];

const financeSchema = new schema.Entity('finance');
export const financeListSchema = [financeSchema];
