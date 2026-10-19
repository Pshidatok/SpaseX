import { Button, Card, Image, Stack, Text } from '@mantine/core';
import type { Launch } from '../types';

interface LaunchCardProps {
  launch: Launch;
  onSeeMore: (launch: Launch) => void;
}

export function LaunchCard({ launch, onSeeMore }: LaunchCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack align="center" gap="xs">
        <Image
          src={launch.links?.mission_patch_small}
          alt={launch.mission_name}
          w={100}
          h={100}
          fit="contain"
          referrerPolicy="no-referrer"
        />
        <Text size="sm" fw={500} truncate w="100%" ta="center">
          {launch.mission_name}
        </Text>
        <Text size="sm" c="dimmed">
          {launch.rocket?.rocket_name}
        </Text>
      </Stack>
      <Button fullWidth mt="md" radius="md" onClick={() => onSeeMore(launch)}>
        See more
      </Button>
    </Card>
  );
}
