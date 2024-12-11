import { v4 as uuidv4 } from 'uuid';

export interface CorrelationOptions {
  header: string;
  generateId: () => string;
  validateId: (id: string) => boolean;
}

// Default Configuration
export const DEFAULT_CORRELATION_OPTIONS: CorrelationOptions = {
  header: 'x-correlation-id',
  generateId: () => uuidv4(),
  validateId: (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  },
};
