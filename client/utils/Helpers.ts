import { LIMIT } from './Settings';
import { HttpMethod } from './Types';
import axios from 'axios';

export const atLimit = (x: number): boolean => x >= LIMIT;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendAPIRequest = async (url: string, method: HttpMethod = HttpMethod.GET): Promise<any> => {
  const response = await axios({ url, method });
  if (response.data) {
    return response.data;
  } else {
    throw new Error(`Received invalid response body: ${JSON.stringify(response.data)}`);
  }
};