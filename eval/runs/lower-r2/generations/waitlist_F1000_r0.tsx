import { Box, Button, Form, Input, Text } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header } from 'layout';
import { Icon } from 'icons';
import { useNavigate } from 'react-router-dom';

export default function Screen() {
  const navigate = useNavigate();

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle signup logic here
    navigate('/waitlist-confirmation');
  };

  return (
    <Box style={{ background: 'var(--sds-color-background-default-default)' }}>
      <Header>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Icon name="Figma" style={{ width: '23.33px', height: '35px', stroke: 'var(--sds-color-icon-default-default)', strokeWidth: '3.5px' }} />
        </Box>
        <NavigationPillList>
          <NavigationPill label="Products" state="active" />
          <NavigationPill label="Solutions" state="default" />
          <NavigationPill label="Community" state="default" />
          <NavigationPill label="Resources" state="default" />
          <NavigationPill label="Pricing" state="default" />
          <NavigationPill label="Contact" state="default" />
        </NavigationPillList>
      </Header>
      <Box style={{ padding: 'var(--sds-size-space-800)' }}>
        <Text style={{ fontSize: 'var(--sds-typography-font-size-heading-1)', color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>Join our waitlist</Text>
        <Text style={{ fontSize: 'var(--sds-typography-font-size-body-base)', color: 'var(--sds-color-text-default-default)' }}>Be the first to know when we launch!</Text>
        <Form onSubmit={handleSignup}>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sds-size-space-400)' }}>
            <Input type="email" placeholder="Enter your email" required />
            <Button type="submit">Join Waitlist</Button>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
