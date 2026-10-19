import { Box, Button, Card, Flex, Grid, Heading, Icon, Text, Accordion, AccordionItem } from 'primitives';
import { NavigationPillList, PricingCard } from 'compositions';
import { usePricingData } from 'hooks';

export default function Screen() {
  const { plans, faqItems } = usePricingData();

  return (
    <Box padding="var(--sds-size-space-1600)" background="var(--sds-color-background-default-secondary)">
      <Box padding="var(--sds-size-space-800)" background="var(--sds-color-background-default-default)" border="1px solid var(--sds-color-border-default-default)">
        <Flex direction="column" gap="var(--sds-size-space-200)" align="center">
          <Heading level={1} style="Title Hero">Pricing</Heading>
          <Text style="Subtitle">Choose the plan that fits your needs.</Text>
        </Flex>
      </Box>
      <Grid gap="var(--sds-size-space-1200)" padding="var(--sds-size-space-1600)" columns="repeat(auto-fill, minmax(300px, 1fr))">
        {plans.map((plan, index) => (
          <PricingCard key={index} title={plan.title} price={plan.price} features={plan.features} buttonText={plan.buttonText} />
        ))}
      </Grid>
      <Box padding="var(--sds-size-space-1600)" background="var(--sds-color-background-default-default)" border="1px solid var(--sds-color-border-default-default)">
        <Flex direction="column" gap="var(--sds-size-space-200)" align="center">
          <Heading level={2} style="Heading">Frequently Asked Questions</Heading>
          <Text style="Subheading">Answers to common questions about our pricing.</Text>
        </Flex>
        <Accordion>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} title={item.title} content={item.content} />
          ))}
        </Accordion>
      </Box>
    </Box>
  );
}
