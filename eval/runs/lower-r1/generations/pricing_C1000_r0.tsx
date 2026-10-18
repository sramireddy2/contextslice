import { Footer, Header, Hero, PricingCard } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, Navigation, TextContentHeading } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="var(--sds-size-space-1200)">
      <Header />
      <Hero variant="subtle">
        Discover the best pricing plans for your needs.
      </Hero>
      <Navigation direction="row">
        <Slot name="Slot" />
      </Navigation>
      <Section padding="var(--sds-size-space-1200)">
        <Flex container direction="column" gap="var(--sds-size-space-1200)">
          <TextContentHeading align="center" heading="Pricing Plans" subheading="Choose the plan that fits your needs." />
          <Navigation direction="row">
            <Slot name="Card Grid" />
          </Navigation>
        </Flex>
      </Section>
      <Pattern name="PageAccordion" padding="var(--sds-size-space-1600)" gap="var(--sds-size-space-1200)">
        <TextContentHeading align="center" heading="FAQ" subheading="Frequently Asked Questions" />
        <Accordion>
          <Slot name="Items" />
        </Accordion>
      </Pattern>
      <Footer />
    </Flex>
  );
}
