import React from 'react';
import { Box, Button, Card, Flex, Heading, Paragraph, Text } from 'primitives';
import { FaqItem } from 'compositions';
import { Grid } from 'layout';
import { CheckCircleIcon } from 'icons';

const PricingPlan = ({ title, description, features, price }) => (
  <Card>
    <Heading level={3}>{title}</Heading>
    <Paragraph>{description}</Paragraph>
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sds-size-space-200)' }}>
      {features.map((feature, index) => (
        <Box key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sds-size-space-100)' }}>
          <CheckCircleIcon style={{ color: 'var(--sds-color-success)' }} />
          <Text>{feature}</Text>
        </Box>
      ))}
    </Box>
    <Button variant="primary">{price}</Button>
  </Card>
);

const Pricing = () => (
  <Box style={{ padding: 'var(--sds-size-space-600)' }}>
    <Heading level={1}>Pricing</Heading>
    <Paragraph style={{ maxWidth: 'var(--sds-size-max-width-1200)', margin: 'var(--sds-size-space-400) auto 0' }}>
      Choose the plan that best fits your needs.
    </Paragraph>
    <Grid columns={3} gap="var(--sds-size-space-400)">
      <PricingPlan
        title="Basic"
        description="For small teams"
        features={['10 users', '100GB storage', 'Basic support']}
        price="$19/month"
      />
      <PricingPlan
        title="Pro"
        description="For growing teams"
        features={['50 users', '500GB storage', 'Priority support', 'Advanced features']}
        price="$49/month"
      />
      <PricingPlan
        title="Enterprise"
        description="For large organizations"
        features={['Unlimited users', 'Unlimited storage', '24/7 support', 'Custom features']}
        price="$99/month"
      />
    </Grid>
    <Box style={{ marginTop: 'var(--sds-size-space-600)' }}>
      <Heading level={2}>FAQ</Heading>
      <FaqItem question="What is the difference between the plans?" answer="The Basic plan is for small teams, the Pro plan is for growing teams, and the Enterprise plan is for large organizations." />
      <FaqItem question="How do I upgrade my plan?" answer="You can upgrade your plan by logging into your account and selecting the plan that best fits your needs." />
      <FaqItem question="What is your refund policy?" answer="We offer a 30-day money-back guarantee. If you are not satisfied with your plan, you can request a refund within 30 days of signing up." />
    </Box>
  </Box>
);

export default function Screen() {
  return <Pricing />;
}
