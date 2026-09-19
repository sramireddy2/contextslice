import { Footer, HeaderAuth, Hero, PricingCard, PageAccordion, TextContentHeading, TextLinkList } from "compositions";
import { Flex, Section } from "layout";

export default function Screen() {
  return (
    <Section>
      <HeaderAuth state="Logged Out" />
      <Hero variant="subtle">
        <TextContentTitle hasSubtitle title="Title" subtitle="Subtitle" align="center" />
      </Hero>
      <Flex direction="column" gap="var(--sds-size-space-400)">
        <CardGridPricing>
          <PricingCard device="desktop" variant="stroke">
            <TextHeading text="Title" />
            <TextList hasTitle={false} density="default">
              {/* Slot content */}
            </TextList>
          </PricingCard>
          <PricingCard device="desktop" variant="brand">
            <TextHeading text="Title" />
            <TextList hasTitle={false} density="default">
              {/* Slot content */}
            </TextList>
          </PricingCard>
          <PricingCard device="desktop" variant="stroke">
            <TextHeading text="Title" />
            <TextList hasTitle={false} density="default">
              {/* Slot content */}
            </TextList>
          </PricingCard>
        </CardGridPricing>
        <PageAccordion>
          <TextContentHeading hasSubheading subheading="Subheading" heading="Heading" align="center" />
          <Accordion>
            {/* Slot items */}
          </Accordion>
        </PageAccordion>
      </Flex>
      <Footer />
    </Section>
  );
}
