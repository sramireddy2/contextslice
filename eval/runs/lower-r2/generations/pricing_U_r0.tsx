import { Footer, Header, HeaderAuth, Hero, PricingCard } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Navigation, NavigationPill, TextContentHeading, TextContentTitle, TextHeading, TextLinkList, TextListItem, TextPrice, TextStrong } from "primitives";

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
        <TextContentTitle align="center" title="Pricing" subtitle="Choose the plan that fits your needs" />
      </Hero>
      <Section padding="var(--sds-size-space-1200)">
        <Flex container alignSecondary="center" direction="column" gap="var(--sds-size-space-1200)">
          <TextContentHeading align="center" heading="Pricing Plans" subheading="Select the plan that best fits your needs" />
          <Navigation direction="row">
            <NavigationPill isSelected>Monthly</NavigationPill>
            <NavigationPill>Yearly</NavigationPill>
          </Navigation>
          <Flex container direction="row" gap="var(--sds-size-space-1200)">
            <PricingCard
              heading="Basic"
              action={{ label: "Get Started", icon: "arrow-right", variant: "primary" }}
              listSlot={
                <TextList density="default">
                  <TextListItem>1 User</TextListItem>
                  <TextListItem>10 GB Storage</TextListItem>
                  <TextListItem>Basic Support</TextListItem>
                </TextList>
              }
              interval="month"
              sku="basic"
              price="19"
              priceCurrency="$"
              priceLabel="/ mo"
              size="large"
              variant="stroke"
            />
            <PricingCard
              heading="Pro"
              action={{ label: "Get Started", icon: "arrow-right", variant: "primary" }}
              listSlot={
                <TextList density="default">
                  <TextListItem>5 Users</TextListItem>
                  <TextListItem>50 GB Storage</TextListItem>
                  <TextListItem>Priority Support</TextListItem>
                </TextList>
              }
              interval="month"
              sku="pro"
              price="49"
              priceCurrency="$"
              priceLabel="/ mo"
              size="large"
              variant="brand"
            />
            <PricingCard
              heading="Enterprise"
              action={{ label: "Get Started", icon: "arrow-right", variant: "primary" }}
              listSlot={
                <TextList density="default">
                  <TextListItem>Unlimited Users</TextListItem>
                  <TextListItem>Unlimited Storage</TextListItem>
                  <TextListItem>24/7 Support</TextListItem>
                </TextList>
              }
              interval="month"
              sku="enterprise"
              price="99"
              priceCurrency="$"
              priceLabel="/ mo"
              size="large"
              variant="stroke"
            />
          </Flex>
        </Flex>
      </Section>
      <Section padding="var(--sds-size-space-1200)">
        <PageAccordion padding="var(--sds-size-space-1600)" gap="var(--sds-size-space-1200)">
          <TextContentHeading align="center" heading="Frequently Asked Questions" subheading="Answering your questions" />
          <Accordion>
            <AccordionItem title="What is the difference between the plans?">
              <TextListItem>Basic plan includes 1 user, 10 GB storage, and basic support.</TextListItem>
              <TextListItem>Pro plan includes 5 users, 50 GB storage, and priority support.</TextListItem>
              <TextListItem>Enterprise plan includes unlimited users, unlimited storage, and 24/7 support.</TextListItem>
            </AccordionItem>
            <AccordionItem title="How do I upgrade my plan?">
              <TextListItem>Contact our support team to upgrade your plan.</TextListItem>
            </AccordionItem>
            <AccordionItem title="What is included in the free trial?">
              <TextListItem>Free trial includes 1 user, 5 GB storage, and basic support for 30 days.</TextListItem>
            </AccordionItem>
            <AccordionItem title="Can I cancel my subscription?">
              <TextListItem>Yes, you can cancel your subscription at any time.</TextListItem>
            </AccordionItem>
          </Accordion>
        </PageAccordion>
      </Section>
      <Footer>
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
      </Footer>
    </div>
  );
}
