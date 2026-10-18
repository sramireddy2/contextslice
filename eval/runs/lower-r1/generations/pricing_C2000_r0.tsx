import { Footer, Header, HeaderAuth, Hero, PricingCard } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Navigation, NavigationPill, TextContentHeading, TextContentTitle, TextHeading, TextLink, TextLinkList, TextList, TextListItem, TextPrice, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div>
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
      <Section padding="1600">
        <Flex container alignSecondary="center" direction="column" gap="1200">
          <TextContentHeading align="center" heading="Pricing" subheading="Choose the plan that fits your needs" />
          <Navigation direction="row">
            <NavigationPill isSelected>Monthly</NavigationPill>
            <NavigationPill>Yearly</NavigationPill>
          </Navigation>
          <Flex container direction="row" gap="1200">
            <PricingCard variant="stroke" heading="Basic" action={{ label: "Get Started", icon: "ArrowRight" }} listSlot={<TextList density="default"><TextListItem>Feature 1</TextListItem><TextListItem>Feature 2</TextListItem><TextListItem>Feature 3</TextListItem></TextList>} price="50" priceCurrency="$" priceLabel="/ mo" />
            <PricingCard variant="brand" heading="Pro" action={{ label: "Get Started", icon: "ArrowRight" }} listSlot={<TextList density="default"><TextListItem>Feature 1</TextListItem><TextListItem>Feature 2</TextListItem><TextListItem>Feature 3</TextListItem></TextList>} price="100" priceCurrency="$" priceLabel="/ mo" />
            <PricingCard variant="stroke" heading="Enterprise" action={{ label: "Get Started", icon: "ArrowRight" }} listSlot={<TextList density="default"><TextListItem>Feature 1</TextListItem><TextListItem>Feature 2</TextListItem><TextListItem>Feature 3</TextListItem></TextList>} price="200" priceCurrency="$" priceLabel="/ mo" />
          </Flex>
        </Flex>
      </Section>
      <Section padding="1600">
        <Flex container alignSecondary="center" direction="column" gap="1200">
          <TextContentHeading align="center" heading="FAQ" subheading="Frequently Asked Questions" />
          <Accordion>
            <AccordionItem title="What is the difference between the plans?">
              <TextList density="default">
                <TextListItem>Basic plan includes essential features.</TextListItem>
                <TextListItem>Pro plan includes advanced features.</TextListItem>
                <TextListItem>Enterprise plan includes all features and dedicated support.</TextListItem>
              </TextList>
            </AccordionItem>
            <AccordionItem title="How do I upgrade my plan?">
              <TextList density="default">
                <TextListItem>Contact our support team for assistance.</TextListItem>
                <TextListItem>Visit your account dashboard to update your plan.</TextListItem>
              </TextList>
            </AccordionItem>
            <AccordionItem title="What is the refund policy?">
              <TextList density="default">
                <TextListItem>Refunds are available within 30 days of purchase.</TextListItem>
                <TextListItem>Refund requests must be submitted through your account dashboard.</TextListItem>
              </TextList>
            </AccordionItem>
            <AccordionItem title="How do I cancel my subscription?">
              <TextList density="default">
                <TextListItem>Visit your account dashboard to cancel your subscription.</TextListItem>
                <TextListItem>Canceling your subscription will take effect at the end of your current billing cycle.</TextListItem>
              </TextList>
            </AccordionItem>
          </Accordion>
        </Flex>
      </Section>
      <Footer>
        <TextLinkList density="default">
          <TextStrong>Use cases</TextStrong>
          <TextListItem>Feature 1</TextListItem>
          <TextListItem>Feature 2</TextListItem>
          <TextListItem>Feature 3</TextListItem>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>Explore</TextStrong>
          <TextListItem>Explore 1</TextListItem>
          <TextListItem>Explore 2</TextListItem>
          <TextListItem>Explore 3</TextListItem>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>Resources</TextStrong>
          <TextListItem>Resource 1</TextListItem>
          <TextListItem>Resource 2</TextListItem>
          <TextListItem>Resource 3</TextListItem>
        </TextLinkList>
      </Footer>
    </div>
  );
}
