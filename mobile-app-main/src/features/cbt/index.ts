import { apiConfig } from '@/api/config';
import { getSessionManager } from '@/auth';
import { createCbtApi, type CbtApi } from './api';

let instance: CbtApi | null = null;

/** The CBT client for this app's session and tenant. */
export function cbtApi(): CbtApi {
  if (!instance) instance = createCbtApi(getSessionManager().client, apiConfig().tenantSlug);
  return instance;
}
