import { Footer, Header, HeaderAuth, Hero, PricingCard } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, Navigation, TextContentHeading } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header>
        <Navigation direction="row">
          {/* Slot "Slot" (+6 elided) */}
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        {/* Hero content */}
      </Hero>
      <CardGridPricing />
      <PageAccordion padding="1600" gap="1200">
        <TextContentHeading align="center" heading="Pricing FAQs" subheading="Frequently Asked Questions">
          {/* FAQ content */}
        </TextContentHeading>
        <Accordion>
          {/* FAQ items */}
        </Accordion>
      </PageAccordion>
      <Footer>
        {/* Footer content */}
      </Footer>
    </div>
  );
}

function CardGridPricing() {
  const { monthlyPlans } = usePricing();
  const { isMobile } = useMediaQuery();
  const padding = isMobile ? "600" : "1200";
  const gap = isMobile ? "600" : "1200";
  const gapCards = isMobile ? "600" : "1200";
  const size = isMobile ? "small" : "large";

  return (
    <Section padding={padding}>
      <Flex container direction="column" gap={gap}>
        {/* Schedule content */}
        <Flex container direction="row" gap={gapCards}>
          {monthlyPlans.map((option, i) => (
            <PricingCard key={option.sku} size={size} {...pricingPlanToPricingCardProps(option, i)} />
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}

function PageAccordion({ padding, gap, children }) {
  return (
    <Section padding={padding}>
      <Flex container alignSecondary="center" direction="column" gap={gap}>
        {children}
      </Flex>
    </Section>
  );
}
