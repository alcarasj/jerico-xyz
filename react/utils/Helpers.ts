import { LIMIT } from './Settings';
import axios from 'axios';

export const atLimit = (x: number): boolean => x >= LIMIT;

export const sendAPIRequest = async (path: string): Promise<unknown> => {
  const response = await axios.get(path);
  if (response.data) {
    return response.data;
  } else {
    throw new Error(`Received invalid response body: ${JSON.stringify(response.data)}`);
  }
};