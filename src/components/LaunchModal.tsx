import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CloseButton, Image, Paper, Text } from '@mantine/core';
import type { Launch } from '../types';

interface LaunchModalProps {
  launch: Launch;
  onClose: () => void;
}

export function LaunchModal({ launch, onClose }: LaunchModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      data-testid="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 1000,
      }}
    >
      <Paper
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-modal-title"
        radius="sm"
        p="md"
        w="100%"
        maw={520}
        mah="90vh"
        style={{ overflowY: 'auto' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text id="launch-modal-title" size="sm">
            {launch.mission_name}
          </Text>
          <CloseButton aria-label="Close" onClick={onClose} />
        </div>

        <Image
          src={launch.links?.mission_patch}
          alt={launch.mission_name}
          w={160}
          h={160}
          fit="contain"
          mx="auto"
          my="md"
          referrerPolicy="no-referrer"
        />

        <Text size="xs" fw={600}>
          Mission name:
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          {launch.mission_name}
        </Text>

        <Text size="xs" fw={600}>
          Rocket name:
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          {launch.rocket?.rocket_name}
        </Text>

        <Text size="xs" fw={600}>
          Details:
        </Text>
        <Text size="xs" c="dimmed">
          {launch.details}
        </Text>
      </Paper>
    </div>,
    document.body,
  );
}
