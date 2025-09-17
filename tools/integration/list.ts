import { getIntegrations } from '../../lib/context';

/**
 * Lists all available integrations.
 * @returns {Promise<any>} List of integrations
 */
export async function listIntegrations(): Promise<any> {
  return await getIntegrations();
}
