import type { Launch } from './types';

export const LAUNCHES_URL = 'https://kata-spacex.onrender.com/api/launches';

interface LaunchesResponse {
  launches: Launch[];
}

export async function fetchLaunches(signal?: AbortSignal): Promise<Launch[]> {
  const response = await fetch(LAUNCHES_URL, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = (await response.json()) as LaunchesResponse;
  return data.launches;
}