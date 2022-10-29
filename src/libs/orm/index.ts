import { DataSource } from 'typeorm';
import { getConfig } from '../../config';

const ormConfig = getConfig('/ormConfig');

export const dataSource = new DataSource(ormConfig);
