import React from "react";
import { Footer, Header, HeaderAuth, Hero, PricingCard } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Navigation, NavigationPill, TextContentHeading, TextContentTitle, TextHeading, TextLinkList, TextListItem, TextPrice, TextStrong } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="var(--sds-size-space-400)">
      <Header>
        <Navigation direction="row">
          <NavigationPill isSelected>Products</NavigationPill>
          <NavigationPill>Solutions</NavigationPill>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill selected>Pricing</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
      </Hero>
      <PatternCardGridPricing>
        <Navigation direction="row">
          <NavigationPill isSelected>Monthly</NavigationPill>
          <NavigationPill>Yearly</NavigationPill>
        </Navigation>
        <Slot name="Card Grid">
          <PricingCard variant="stroke" heading="Basic Plan" action={{ label: "Get Started", icon: "arrow-right", variant: "primary" }} listSlot={<TextListItem>Feature 1</TextListItem><TextListItem>Feature 2</TextListItem><TextListItem>Feature 3</TextListItem><TextListItem>Feature 4</TextListItem><TextListItem>Feature 5</TextListItem>} interval="month" sku="basic" price="50" priceCurrency="$" priceLabel="/ mo" size="default" variant="stroke" />
          <PricingCard variant="brand" heading="Pro Plan" action={{ label: "Get Started", icon: "arrow-right", variant: "primary" }} listSlot={<TextListItem>Feature 1</TextListItem><TextListItem>Feature 2</TextListItem><TextListItem>Feature 3</TextListItem><TextListItem>Feature 4</TextListItem><TextListItem>Feature 5</TextListItem>} interval="month" sku="pro" price="100" priceCurrency="$" priceLabel="/ mo" size="default" variant="brand" />
          <PricingCard variant="stroke" heading="Enterprise Plan" action={{ label: "Get Started", icon: "arrow-right", variant: "primary" }} listSlot={<TextListItem>Feature 1</TextListItem><TextListItem>Feature 2</TextListItem><TextListItem>Feature 3</TextListItem><TextListItem>Feature 4</TextListItem><TextListItem>Feature 5</TextListItem>} interval="month" sku="enterprise" price="200" priceCurrency="$" priceLabel="/ mo" size="default" variant="stroke" />
        </Slot>
      </PatternCardGridPricing>
      <PatternPageAccordion padding="1600" gap="1200">
        <TextContentHeading align="center" heading="Frequently Asked Questions" subheading="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." />
        <Accordion>
          <AccordionItem title="What is the difference between the Basic, Pro, and Enterprise plans?">
            The Basic plan includes essential features for individuals and small teams. The Pro plan offers advanced features for growing teams. The Enterprise plan provides comprehensive features for large organizations.
          </AccordionItem>
          <AccordionItem title="How do I upgrade my plan?">
            To upgrade your plan, visit your account settings and select the desired plan from the options available.
          </AccordionItem>
          <AccordionItem title="What is the refund policy?">
            Our refund policy is subject to our terms and conditions. Please refer to our website for detailed information.
          </AccordionItem>
          <AccordionItem title="Can I cancel my subscription?">
            Yes, you can cancel your subscription at any time. Visit your account settings to manage your subscription.
          </AccordionItem>
          <AccordionItem title="What payment methods are accepted?">
            We accept credit cards, debit cards, and PayPal for payment.
          </AccordionItem>
        </Accordion>
      </PatternPageAccordion>
      <Footer>
        <Slot name="Title">
          <Frame row align="center/center" w="hug" h="hug">
            <Vector w="23.33" h="35" stroke="var(--sds-color-icon-default-default)" stroke-w="3.5" />
          </Frame>
          <Frame row gap="var(--sds-size-space-400)" align="min/center" w="hug" h="hug">
            <Frame w="23.98" h="24">
              <Vector />
            </Frame>
            <Frame w="24" h="24" clip>
              <Vector fill="var(--sds-color-icon-default-default)" />
            </Frame>
            <Frame w="24" h="24" clip>
              <Vector />
            </Frame>
            <Frame w="24" h="24" clip>
              <Vector fill="var(--sds-color-icon-default-default)" />
            </Frame>
          </Frame>
        </Slot>
        <Slot name="Slot">
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <TextListItem>UI design</TextListItem>
            <TextListItem>UX design</TextListItem>
            <TextListItem>Wireframing</TextListItem>
            <TextListItem>Diagramming</TextListItem>
            <TextListItem>Brainstorming</TextListItem>
            <TextListItem>Online whiteboard</TextListItem>
            <TextListItem>Team collaboration</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <TextListItem>Design</TextListItem>
            <TextListItem>Prototyping</TextListItem>
            <TextListItem>Development features</TextListItem>
            <TextListItem>Design systems</TextListItem>
            <TextListItem>Collaboration features</TextListItem>
            <TextListItem>Design process</TextListItem>
            <TextListItem>FigJam</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <TextListItem>Blog</TextListItem>
            <TextListItem>Best practices</TextListItem>
            <TextListItem>Colors</TextListItem>
            <TextListItem>Color wheel</TextListItem>
            <TextListItem>Support</TextListItem>
            <TextListItem>Developers</TextListItem>
            <TextListItem>Resource library</TextListItem>
          </TextLinkList>
        </Slot>
      </Footer>
    </Flex>
  );
}
