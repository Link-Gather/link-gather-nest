import * as bcrypt from 'bcrypt';

export async function compareHash(target: string, encrypted: string) {
  return bcrypt.compare(target, encrypted);
}
