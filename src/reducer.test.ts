import { initialState, reducer } from './reducer';
import type { Launch } from './types';

const launch: Launch = {
  flight_number: 1,
  mission_name: 'Starlink 2',
  details: 'Details',
  rocket: { rocket_name: 'Falcon 9' },
  links: { mission_patch: 'big.png', mission_patch_small: 'small.png' },
};

describe('reducer', () => {
  it('starts in loading state', () => {
    expect(initialState.status).toBe('loading');
    expect(initialState.selected).toBeNull();
  });

  it('stores launches on FETCH_SUCCESS', () => {
    const state = reducer(initialState, { type: 'FETCH_SUCCESS', payload: [launch] });
    expect(state.status).toBe('success');
    expect(state.launches).toEqual([launch]);
  });

  it('stores error message on FETCH_ERROR', () => {
    const state = reducer(initialState, { type: 'FETCH_ERROR', payload: 'boom' });
    expect(state.status).toBe('error');
    expect(state.error).toBe('boom');
  });

  it('opens and closes the modal', () => {
    const opened = reducer(initialState, { type: 'OPEN_MODAL', payload: launch });
    expect(opened.selected).toEqual(launch);
    const closed = reducer(opened, { type: 'CLOSE_MODAL' });
    expect(closed.selected).toBeNull();
  });
});
