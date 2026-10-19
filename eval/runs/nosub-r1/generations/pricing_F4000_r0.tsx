import { Box, Button, Card, Flex, Grid, Heading, Text } from 'primitives';
import { NavigationPill, PricingCard } from 'compositions';
import { IconStar, IconX } from 'icons';

export default function Screen() {
  return (
    <Box style={{ background: 'var(--sds-color-background-default-default)' }}>
      <Box style={{ padding: 'var(--sds-size-space-800)' }}>
        <Flex direction="row" wrap gap="var(--sds-size-space-600)" align="center">
          <Box>
            <Box style={{ width: '40px', height: '35px' }}>
              <IconStar stroke="var(--sds-color-icon-default-default)" stroke-width="3.5" />
            </Box>
          </Box>
          <NavigationPillList>
            <NavigationPill label="Products" state="default" />
            <NavigationPill label="Solutions" state="default" />
            <NavigationPill label="Community" state="default" />
            <NavigationPill label="Resources" state="default" />
            <NavigationPill label="Pricing" state="active" />
            <NavigationPill label="Contact" state="default" />
          </NavigationPillList>
          <Box style={{ gap: 'var(--sds-size-space-300)' }}>
            <Button variant="neutral" size="small" label="Sign in" />
            <Button variant="primary" size="small" label="Register" />
          </Box>
        </Flex>
      </Box>
      <Box style={{ padding: 'var(--sds-size-space-4000) var(--sds-size-space-1600)' }}>
        <TextContentTitle title="Title" subtitle="Subtitle" />
      </Box>
      <Box style={{ padding: 'var(--sds-size-space-1600)' }}>
        <NavigationPillList>
          <NavigationPill label="Monthly" state="active" />
          <NavigationPill label="Yearly" state="default" />
        </NavigationPillList>
        <Grid gap="var(--sds-size-space-1600)">
          <PricingCard
            device="desktop"
            variant="stroke"
            title="Title"
            price={{ currency: '$', value: '50', label: '/ mo' }}
            list={['List item', 'List item', 'List item', 'List item', 'List item', 'List item']}
            button={{ label: 'Button', variant: 'primary' }}
          />
          <PricingCard
            device="desktop"
            variant="brand"
            title="Title"
            price={{ currency: '$', value: '50', label: '/ mo' }}
            list={['List item', 'List item', 'List item', 'List item', 'List item', 'List item']}
            button={{ label: 'Button', variant: 'neutral' }}
          />
          <PricingCard
            device="desktop"
            variant="stroke"
            title="Title"
            price={{ currency: '$', value: '50', label: '/ mo' }}
            list={['List item', 'List item', 'List item', 'List item', 'List item', 'List item']}
            button={{ label: 'Button', variant: 'primary' }}
          />
        </Grid>
      </Box>
    </Box>
  );
}
