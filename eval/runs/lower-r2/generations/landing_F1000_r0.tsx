import { Box, Flex, Heading, Text, Button, Link, Icon } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header } from 'layout';
import { FigmaIcon } from 'icons';
import { useNavigate } from 'react-router-dom';

export default function Screen() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      backgroundColor="var(--sds-color-background-default-default)"
    >
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex="1"
        padding="var(--sds-size-space-800)"
      >
        <Box display="flex" alignItems="center">
          <Icon as={FigmaIcon} width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
          <Heading as="h1" size="large" color="var(--sds-color-text-default-default)">
            Welcome to Simple Design System
          </Heading>
        </Box>
        <Text as="p" size="body" color="var(--sds-color-text-default-default)">
          Discover the latest design patterns and components.
        </Text>
        <Button
          size="large"
          onClick={() => navigate('/components')}
          style={{ marginTop: 'var(--sds-size-space-800)' }}
        >
          Explore Components
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        padding="var(--sds-size-space-800)"
        backgroundColor="var(--sds-color-background-brand-tertiary)"
      >
        <NavigationPillList direction="row">
          <NavigationPill label="Products" state="active" />
          <NavigationPill label="Solutions" state="default" />
          <NavigationPill label="Community" state="default" />
          <NavigationPill label="Resources" state="default" />
          <NavigationPill label="Pricing" state="default" />
          <NavigationPill label="Contact" state="default" />
        </NavigationPillList>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="var(--sds-size-space-800)"
        backgroundColor="var(--sds-color-background-default-default)"
      >
        <Text as="p" size="body" color="var(--sds-color-text-default-default)">
          © 2023 Simple Design System. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}
