import { Footer } from "compositions";
import { PricingCard } from "compositions";
import { Flex, Section } from "layout";
import { usePricing } from "hooks";
import { useMediaQuery } from "react";

export default function Screen() {
  const { monthlyPlans } = usePricing();
  const { isMobile } = useMediaQuery();
  const padding = isMobile ? "600" : "1200";
  const gap = isMobile ? "600" : "1200";
  const gapCards = isMobile ? "600" : "1200";
  const size = isMobile ? "small" : "large";

  return (
    <Section padding={padding}>
      <Flex container direction="column" gap={gap}>
        <Header />
        <HeaderAuth />
        <Hero variant="subtle">Pricing</Hero>
        <CardGridPricing platform="desktop" />
        <PageAccordion platform="desktop">
          <TextContentHeading hasSubheading={true} subheading="Frequently Asked Questions" heading="FAQ" align="center" />
          <Accordion>
            <AccordionItem title="What is the difference between the monthly and yearly plans?" state="open">
              <TextList hasTitle={false} density="default">
                <TextListItem>Monthly plans are billed on a monthly basis.</TextListItem>
                <TextListItem>Yearly plans are billed annually with a discount.</TextListItem>
              </TextList>
            </AccordionItem>
            <AccordionItem title="How can I cancel my subscription?" state="closed">
              <TextList hasTitle={false} density="default">
                <TextListItem>Go to your account settings and click on the "Cancel Subscription" button.</TextListItem>
                <TextListItem>You will receive a confirmation email and your subscription will be canceled at the end of the current billing period.</TextListItem>
              </TextList>
            </AccordionItem>
            <AccordionItem title="What is included in the free plan?" state="closed">
              <TextList hasTitle={false} density="default">
                <TextListItem>Free plan includes basic features.</TextListItem>
                <TextListItem>No access to premium features.</TextListItem>
              </TextList>
            </AccordionItem>
            <AccordionItem title="Can I upgrade my plan?" state="closed">
              <TextList hasTitle={false} density="default">
                <TextListItem>Yes, you can upgrade to a paid plan from your account settings.</TextListItem>
                <TextListItem>Choose the plan that best fits your needs.</TextListItem>
              </TextList>
            </AccordionItem>
          </Accordion>
        </PageAccordion>
        <Footer />
      </Flex>
    </Section>
  );
}
