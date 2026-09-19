import { Box, Flex, Heading, Link, Text } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header } from 'layout';
import { Icon } from 'icons';
import { images } from 'images';

export default function Screen() {
  return (
    <Box style={{ backgroundColor: 'var(--sds-color-background-default-default)' }}>
      <Header />
      <Box style={{ padding: 'var(--sds-size-space-800)' }}>
        <Box style={{ display: 'flex', alignItems: 'center', gap: 'var(--sds-size-space-600)' }}>
          <Box style={{ width: '40px', height: '35px' }}>
            <Icon name="Figma" />
          </Box>
          <NavigationPillList direction="row">
            <NavigationPill label="Products" state="active" />
            <NavigationPill label="Solutions" state="default" />
            <NavigationPill label="Community" state="default" />
            <NavigationPill label="Resources" state="default" />
            <NavigationPill label="Pricing" state="default" />
            <NavigationPill label="Contact" state="default" />
          </NavigationPillList>
        </Box>
        <Box style={{ padding: 'var(--sds-size-space-800)' }}>
          <Heading level={1}>Welcome to Simple Design System</Heading>
          <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
            Explore our components, guidelines, and tools to build beautiful and consistent user interfaces.
          </Text>
        </Box>
        <Box style={{ padding: 'var(--sds-size-space-800)' }}>
          <Heading level={2}>Features</Heading>
          <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
            - Consistent design language
            - Reusable components
            - Accessibility features
            - TypeScript support
          </Text>
        </Box>
        <Box style={{ padding: 'var(--sds-size-space-800)' }}>
          <Heading level={2}>Get Started</Heading>
          <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
            Visit our <Link href="#">documentation</Link> to learn more about how to use the Simple Design System.
          </Text>
        </Box>
      </Box>
      <Box style={{ backgroundColor: 'var(--sds-color-background-brand-tertiary)', padding: 'var(--sds-size-space-800)' }}>
        <Text style={{ color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>
          © 2023 Simple Design System. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}
