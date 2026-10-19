import type { Launch } from './types';

export interface State {
  status: 'loading' | 'success' | 'error';
  launches: Launch[];
  error: string | null;
  selected: Launch | null;
}

export type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Launch[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'OPEN_MODAL'; payload: Launch }
  | { type: 'CLOSE_MODAL' };

export const initialState: State = {
  status: 'loading',
  launches: [],
  error: null,
  selected: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'success', launches: action.payload };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.payload };
    case 'OPEN_MODAL':
      return { ...state, selected: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, selected: null };
    default:
      return state;
  }
}
