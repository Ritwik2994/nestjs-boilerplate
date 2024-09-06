import 'dotenv/config';

import { envSchema } from '../env.validation';

export default async () => envSchema.validateAsync(process.env, { allowUnknown: true });
