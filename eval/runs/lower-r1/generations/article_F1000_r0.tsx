import { Box, Button, Card, Heading, Text } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Flex, Grid } from 'layout';
import { Icon } from 'icons';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      bg={theme.colors.background.default.default}
      border={theme.colors.border.default.default}
      borderRadius={theme.sizes.radius[200]}
      padding={theme.sizes.space[800]}
    >
      <Flex direction="row" wrap="wrap" gap={theme.sizes.space[600]} align="min" justify="center">
        <Box>
          <Icon name="Figma" width={23.33} height={35} stroke={theme.colors.icon.default.default} strokeWidth={3.5} />
        </Box>
        <NavigationPillList direction="row" wrap="wrap" gap={theme.sizes.space[200]} align="max" justify="min">
          <NavigationPill label="Products" state="active" />
          <NavigationPill label="Solutions" state="default" />
          <NavigationPill label="Community" state="default" />
          <NavigationPill label="Resources" state="default" />
          <NavigationPill label="Pricing" state="default" />
          <NavigationPill label="Contact" state="default" />
        </NavigationPillList>
      </Flex>

      <Box marginY={theme.sizes.space[800]}>
        <Heading level={1}>Article Title</Heading>
        <Text style="Single Line/Body Base">Article body text goes here.</Text>
      </Box>

      <Grid templateColumns="repeat(3, 1fr)" gap={theme.sizes.space[600]}>
        <Card>
          <Heading level={2}>Related Card 1</Heading>
          <Text style="Single Line/Body Base">Card content goes here.</Text>
        </Card>
        <Card>
          <Heading level={2}>Related Card 2</Heading>
          <Text style="Single Line/Body Base">Card content goes here.</Text>
        </Card>
        <Card>
          <Heading level={2}>Related Card 3</Heading>
          <Text style="Single Line/Body Base">Card content goes here.</Text>
        </Card>
      </Grid>
    </Box>
  );
}
