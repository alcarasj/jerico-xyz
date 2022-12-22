import { EASTER_EGG_COUNTER_LIMIT } from './Settings';
import { HttpMethod, HttpStatus } from './Types';
import axios from 'axios';

export const atEasterEggCounterLimit = (x: number): boolean => x >= EASTER_EGG_COUNTER_LIMIT;

export async function sendAPIRequest<T>(url: string, method: HttpMethod = HttpMethod.GET, 
  expectedStatus: HttpStatus = HttpStatus.OK, headers: object = null, data: object = null): Promise<T> {
  const response = await axios({ url, method, data, headers });
  if (response.status !== expectedStatus) {
    throw new Error(`${method} ${url} returned ${response.status}: ${response.data.error}`)
  }
  return response.data;
}
