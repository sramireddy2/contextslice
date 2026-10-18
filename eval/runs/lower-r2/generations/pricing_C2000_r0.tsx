import { Footer, Header, HeaderAuth, Hero, PricingCard } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Navigation, NavigationPill, TextContentHeading, TextContentTitle, TextHeading, TextLinkList, TextList, TextListItem, TextPrice, TextStrong } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="var(--sds-size-space-400)">
      <Header>
        <Navigation direction="row">
          <NavigationPill isSelected>Products</NavigationPill>
          <NavigationPill>Solutions</NavigationPill>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill>Pricing</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
      </Hero>
      <PatternCardGridPricing />
      <PatternPageAccordion padding="var(--sds-size-space-400)" gap="var(--sds-size-space-400)">
        <TextContentHeading align="center" heading="Frequently Asked Questions" subheading="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." />
        <Accordion>
          <AccordionItem title="What is the difference between the monthly and yearly plans?">The monthly plan is ideal for individuals, while the yearly plan is better suited for businesses.</AccordionItem>
          <AccordionItem title="How do I cancel my subscription?">You can cancel your subscription by logging into your account and navigating to the billing section.</AccordionItem>
          <AccordionItem title="What is the refund policy?">We offer a 30-day money-back guarantee if you are not satisfied with your purchase.</AccordionItem>
          <AccordionItem title="Can I switch plans?">Yes, you can switch plans at any time by logging into your account and navigating to the billing section.</AccordionItem>
        </Accordion>
      </PatternPageAccordion>
      <Footer>
        <Frame row align="center/center" w="hug" h="hug">
          <Vector w="23.33" h="35" stroke="var(--sds-color-icon-default-default)" stroke-w="3.5" />
        </Frame>
        <Frame row gap="var(--sds-size-space-400)" align="min/center" w="hug" h="hug">
          <Frame w="23.98" h="24">
            <Vector w="23.98" h="24" fill="var(--sds-color-icon-default-default)" />
          </Frame>
          <Frame w="24" h="24" clip>
            <Vector w="24" h="24" fill="var(--sds-color-icon-default-default)" />
          </Frame>
          <Frame w="24" h="24" clip>
            <Vector w="24" h="18" fill="var(--sds-color-icon-default-default)" />
          </Frame>
          <Frame w="24" h="24" clip>
            <Vector w="24" h="24" fill="var(--sds-color-icon-default-default)" />
          </Frame>
        </Frame>
      </Footer>
    </Flex>
  );
}

function PatternCardGridPricing() {
  const { monthlyPlans } = usePricing();
  const { isMobile } = useMediaQuery();
  const padding = isMobile ? "var(--sds-size-space-400)" : "var(--sds-size-space-800)";
  const gap = isMobile ? "var(--sds-size-space-400)" : "var(--sds-size-space-800)";
  const gapCards = isMobile ? "var(--sds-size-space-400)" : "var(--sds-size-space-800)";
  const size = isMobile ? "small" : "large";

  return (
    <Section padding={padding}>
      <Flex container direction="column" gap={gap}>
        <Navigation direction="row">
          <NavigationPill isSelected>Monthly</NavigationPill>
          <NavigationPill>Yearly</NavigationPill>
        </Navigation>
        <Flex container direction="row" gap={gapCards}>
          {monthlyPlans.map((option, i) => (
            <PricingCard key={option.sku} size={size} {...pricingPlanToPricingCardProps(option, i)} />
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}

function PatternPageAccordion({ padding, gap, children }) {
  return (
    <Section padding={padding}>
      <Flex container alignSecondary="center" direction="column" gap={gap}>
        {children}
      </Flex>
    </Section>
  );
}

function usePricing() {
  // Mock implementation
  return {
    monthlyPlans: [
      {
        sku: "monthly-plan-1",
        heading: "Basic Plan",
        textPrice: { label: "/ mo", currency: "$", price: "50" },
        list: (
          <TextList density="default">
            <TextListItem>List item 1</TextListItem>
            <TextListItem>List item 2</TextListItem>
            <TextListItem>List item 3</TextListItem>
            <TextListItem>List item 4</TextListItem>
            <TextListItem>List item 5</TextListItem>
          </TextList>
        ),
      },
      {
        sku: "monthly-plan-2",
        heading: "Pro Plan",
        textPrice: { label: "/ mo", currency: "$", price: "100" },
        list: (
          <TextList density="default">
            <TextListItem>List item 1</TextListItem>
            <TextListItem>List item 2</TextListItem>
            <TextListItem>List item 3</TextListItem>
            <TextListItem>List item 4</TextListItem>
            <TextListItem>List item 5</TextListItem>
          </TextList>
        ),
      },
    ],
  };
}

function pricingPlanToPricingCardProps(option, i) {
  return {
    heading: option.heading,
    textPrice: option.textPrice,
    list: option.list,
    action: {
      label: "Sign Up",
      icon: "icon-sign-up",
      variant: "primary",
    },
  };
}
