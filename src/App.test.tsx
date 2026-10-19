import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import App from './App';
import type { Launch } from './types';

const launches: Launch[] = [
  {
    flight_number: 1,
    mission_name: 'Starlink 2',
    details: 'Second batch of Starlink satellites.',
    rocket: { rocket_name: 'Falcon 9' },
    links: { mission_patch: 'big-1.png', mission_patch_small: 'small-1.png' },
  },
  {
    flight_number: 2,
    mission_name: 'CRS-20',
    details: 'Cargo mission to the ISS.',
    rocket: { rocket_name: 'Falcon 9' },
    links: { mission_patch: 'big-2.png', mission_patch_small: 'small-2.png' },
  },
];

const renderApp = () =>
  render(
    <MantineProvider>
      <App />
    </MantineProvider>,
  );

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('shows a loader and then the list of launches', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ launches }), { status: 200 }),
    );
    renderApp();

    expect(screen.getByText('SpaceX Launches 2020')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();

    expect(await screen.findByText('Starlink 2')).toBeInTheDocument();
    expect(screen.getByText('CRS-20')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'See more' })).toHaveLength(2);
  });

  it('shows an error when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 500 }));
    renderApp();

    expect(await screen.findByText('Failed to load launches')).toBeInTheDocument();
  });

  it('opens a modal with launch details and closes it', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ launches }), { status: 200 }),
    );
    const user = userEvent.setup();
    renderApp();

    await user.click((await screen.findAllByRole('button', { name: 'See more' }))[0]);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Mission name:')).toBeInTheDocument();
    expect(within(dialog).getByText('Rocket name:')).toBeInTheDocument();
    expect(within(dialog).getByText('Second batch of Starlink satellites.')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the modal in a portal outside the app container', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ launches }), { status: 200 }),
    );
    const user = userEvent.setup();
    const { container } = renderApp();

    await user.click((await screen.findAllByRole('button', { name: 'See more' }))[0]);

    const dialog = await screen.findByRole('dialog');
    expect(container.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
  });

  it('closes the modal on Escape and on overlay click', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ launches }), { status: 200 }),
    );
    const user = userEvent.setup();
    renderApp();

    const buttons = await screen.findAllByRole('button', { name: 'See more' });

    await user.click(buttons[0]);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(buttons[1]);
    await screen.findByRole('dialog');
    await user.click(screen.getByTestId('modal-overlay'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
