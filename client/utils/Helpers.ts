import { LIMIT } from './Settings';
import axios from 'axios';

export const atLimit = (x: number): boolean => x >= LIMIT;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendAPIRequest = async (path: string): Promise<any> => {
  const response = await axios.get(path);
  if (response.data) {
    return response.data;
  } else {
    throw new Error(`Received invalid response body: ${JSON.stringify(response.data)}`);
  }
};