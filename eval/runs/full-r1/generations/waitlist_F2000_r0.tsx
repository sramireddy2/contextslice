import { Box, Button, Form, Input, Text } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header, HeaderAuth } from 'layout';
import { IconX, IconStar } from 'icons';

export default function Screen() {
  return (
    <Box style={{ background: 'var(--sds-color-background-default-default)' }}>
      <Header>
        <Box style={{ display: 'flex', gap: 'var(--sds-size-space-600)', padding: 'var(--sds-size-space-800)' }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Box style={{ width: '40px', height: '35px' }}>
              <IconStar stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
            </Box>
          </Box>
          <NavigationPillList>
            <NavigationPill label="Products" state="active" />
            <NavigationPill label="Solutions" state="default" />
            <NavigationPill label="Community" state="default" />
            <NavigationPill label="Resources" state="default" />
            <NavigationPill label="Pricing" state="default" />
            <NavigationPill label="Contact" state="default" />
          </NavigationPillList>
        </Box>
        <HeaderAuth>
          <Button variant="neutral" state="default" size="small">
            Sign in
          </Button>
          <Button variant="primary" state="default" size="small">
            Register
          </Button>
        </HeaderAuth>
      </Header>
      <Box style={{ display: 'flex', gap: 'var(--sds-size-space-800)', padding: 'var(--sds-size-space-4000) var(--sds-size-space-600) var(--sds-size-space-4000) var(--sds-size-space-600)', background: 'var(--sds-color-background-default-secondary)' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sds-size-space-200)', alignItems: 'center' }}>
          <Text style={{ fontSize: 'var(--sds-typography-title-hero)', color: 'var(--sds-color-text-default-default)' }}>Title</Text>
          <Text style={{ fontSize: 'var(--sds-typography-subtitle)', color: 'var(--sds-color-text-default-secondary)' }}>Subtitle</Text>
        </Box>
        <Form style={{ display: 'flex', flexDirection: 'row', gap: 'var(--sds-size-space-300)', width: '338px' }}>
          <Input
            value="you@example.com"
            description="Description"
            error="Error"
            hasError={false}
            hasDescription={false}
            label="Email address"
            hasLabel={false}
            state="default"
            valueType="default"
            style={{ display: 'flex', flexDirection: 'row', gap: 'var(--sds-size-space-200)', width: '100%' }}
          />
          <Button variant="primary" state="default" size="medium" style={{ display: 'flex', flexDirection: 'row', gap: 'var(--sds-size-space-200)', width: '100%' }}>
            Submit
          </Button>
        </Form>
      </Box>
    </Box>
  );
}
