import { useCallback, useEffect, useReducer } from 'react';
import { Alert, Center, Container, Loader, SimpleGrid, Title } from '@mantine/core';
import { fetchLaunches } from './api';
import { initialState, reducer } from './reducer';
import type { Launch } from './types';
import { LaunchCard } from './components/LaunchCard';
import { LaunchModal } from './components/LaunchModal';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'FETCH_START' });
    fetchLaunches(controller.signal)
      .then((launches) => dispatch({ type: 'FETCH_SUCCESS', payload: launches }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        dispatch({
          type: 'FETCH_ERROR',
          payload: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    return () => controller.abort();
  }, []);

  const handleSeeMore = useCallback((launch: Launch) => {
    dispatch({ type: 'OPEN_MODAL', payload: launch });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  return (
    <Container size={840} py="xl">
      <Title order={1} ta="center" mb="xl">
        SpaceX Launches 2020
      </Title>

      {state.status === 'loading' && (
        <Center>
          <Loader aria-label="Loading" />
        </Center>
      )}

      {state.status === 'error' && (
        <Alert color="red" title="Failed to load launches">
          {state.error}
        </Alert>
      )}

      {state.status === 'success' && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {state.launches.map((launch) => (
            <LaunchCard key={launch.flight_number} launch={launch} onSeeMore={handleSeeMore} />
          ))}
        </SimpleGrid>
      )}

      {state.selected && <LaunchModal launch={state.selected} onClose={handleClose} />}
    </Container>
  );
}
