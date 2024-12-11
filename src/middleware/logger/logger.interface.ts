export interface LogContext {
  userId?: string;
  requestId?: string;
  service?: string;
  metadata?: Record<string, any>;
}
