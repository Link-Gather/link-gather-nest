import * as bcrypt from 'bcrypt';
import { getConfig } from '@config';

const SALT_ROUNDS = getConfig('/saltRounds');

export async function compareHash(target: string, encrypted: string) {
  return bcrypt.compare(target, encrypted);
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
  return bcrypt.hash(password, salt);
}
