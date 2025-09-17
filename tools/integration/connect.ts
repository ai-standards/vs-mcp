import { connectToIntegration } from '../../lib/context';

/**
 * Connects to a specified integration.
 * @param {string} integrationId - The ID of the integration to connect
 * @param {any} options - Additional options for connection
 * @returns {Promise<any>} Connection result
 */
export async function connectIntegration(integrationId: string, options?: any): Promise<any> {
  return await connectToIntegration(integrationId, options);
}
