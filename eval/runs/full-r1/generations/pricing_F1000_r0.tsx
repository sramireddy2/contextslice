import { Box, Button, Card, Flex, Heading, Icon, Text } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header } from 'layout';
import { FaCheckCircle } from 'icons';

const PricingPlan = ({ title, description, features, price }) => (
  <Card>
    <Box padding="var(--sds-size-space-800)">
      <Heading level={3}>{title}</Heading>
      <Text>{description}</Text>
      <Box display="flex" alignItems="center" marginTop="var(--sds-size-space-800)">
        <Icon icon={FaCheckCircle} color="var(--sds-color-icon-default-default)" />
        <Text marginLeft="var(--sds-size-space-200)">Unlimited users</Text>
      </Box>
      <Box display="flex" alignItems="center" marginTop="var(--sds-size-space-200)">
        <Icon icon={FaCheckCircle} color="var(--sds-color-icon-default-default)" />
        <Text marginLeft="var(--sds-size-space-200)">24/7 support</Text>
      </Box>
      <Box display="flex" alignItems="center" marginTop="var(--sds-size-space-200)">
        <Icon icon={FaCheckCircle} color="var(--sds-color-icon-default-default)" />
        <Text marginLeft="var(--sds-size-space-200)">Advanced analytics</Text>
      </Box>
      <Box display="flex" justifyContent="center" marginTop="var(--sds-size-space-800)">
        <Text fontSize="var(--sds-font-size-heading-400)" color="var(--sds-color-text-brand-on-brand-secondary)">
          ${price} / month
        </Text>
      </Box>
      <Button marginTop="var(--sds-size-space-800)">Get Started</Button>
    </Box>
  </Card>
);

const Pricing = () => (
  <Box>
    <Header>
      <NavigationPillList>
        <NavigationPill label="Products" state="default" />
        <NavigationPill label="Solutions" state="default" />
        <NavigationPill label="Community" state="default" />
        <NavigationPill label="Resources" state="default" />
        <NavigationPill label="Pricing" state="active" />
        <NavigationPill label="Contact" state="default" />
      </NavigationPillList>
    </Header>
    <Box padding="var(--sds-size-space-800)" display="flex" justifyContent="center" gap="var(--sds-size-space-800)">
      <PricingPlan
        title="Basic"
        description="For small teams"
        features={['Unlimited users', '24/7 support', 'Advanced analytics']}
        price="19"
      />
      <PricingPlan
        title="Pro"
        description="For growing teams"
        features={['Unlimited users', '24/7 support', 'Advanced analytics', 'Custom reporting']}
        price="39"
      />
      <PricingPlan
        title="Enterprise"
        description="For large organizations"
        features={['Unlimited users', '24/7 support', 'Advanced analytics', 'Custom reporting', 'Priority support']}
        price="99"
      />
    </Box>
    <Box padding="var(--sds-size-space-800)" display="flex" justifyContent="center">
      <Box>
        <Heading level={2}>FAQ</Heading>
        <Box display="flex" alignItems="center" marginTop="var(--sds-size-space-200)">
          <Icon icon={FaCheckCircle} color="var(--sds-color-icon-default-default)" />
          <Text marginLeft="var(--sds-size-space-200)">What is the difference between the plans?</Text>
        </Box>
        <Box display="flex" alignItems="center" marginTop="var(--sds-size-space-200)">
          <Icon icon={FaCheckCircle} color="var(--sds-color-icon-default-default)" />
          <Text marginLeft="var(--sds-size-space-200)">How do I upgrade my plan?</Text>
        </Box>
        <Box display="flex" alignItems="center" marginTop="var(--sds-size-space-200)">
          <Icon icon={FaCheckCircle} color="var(--sds-color-icon-default-default)" />
          <Text marginLeft="var(--sds-size-space-200)">What is the refund policy?</Text>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default function Screen() {
  return <Pricing />;
}
