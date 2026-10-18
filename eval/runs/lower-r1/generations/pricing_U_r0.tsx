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
      <Section padding="var(--sds-size-space-1600)">
        <Flex container alignSecondary="center" direction="column" gap="var(--sds-size-space-1200)">
          <TextContentHeading align="center" heading="Pricing" subheading="Choose the plan that fits your needs" />
          <Navigation direction="row">
            <NavigationPill isSelected>Monthly</NavigationPill>
            <NavigationPill>Yearly</NavigationPill>
          </Navigation>
          <Flex container direction="row" gap="var(--sds-size-space-1200)">
            <PricingCard
              variant="stroke"
              heading="Basic"
              action={{ label: "Get Started", icon: "ArrowRightIcon", variant: "primary" }}
              listSlot={
                <TextList density="default">
                  <TextListItem>10 users</TextListItem>
                  <TextListItem>100GB storage</TextListItem>
                  <TextListItem>Basic support</TextListItem>
                </TextList>
              }
              textPrice={{ label: "/ mo", currency: "$", price: "50" }}
            />
            <PricingCard
              variant="brand"
              heading="Pro"
              action={{ label: "Get Started", icon: "ArrowRightIcon", variant: "primary" }}
              listSlot={
                <TextList density="default">
                  <TextListItem>Unlimited users</TextListItem>
                  <TextListItem>Unlimited storage</TextListItem>
                  <TextListItem>Priority support</TextListItem>
                </TextList>
              }
              textPrice={{ label: "/ mo", currency: "$", price: "100" }}
            />
            <PricingCard
              variant="stroke"
              heading="Enterprise"
              action={{ label: "Get Started", icon: "ArrowRightIcon", variant: "primary" }}
              listSlot={
                <TextList density="default">
                  <TextListItem>Custom users</TextListItem>
                  <TextListItem>Custom storage</TextListItem>
                  <TextListItem>24/7 support</TextListItem>
                </TextList>
              }
              textPrice={{ label: "/ mo", currency: "$", price: "200" }}
            />
          </Flex>
        </Flex>
      </Section>
      <Section padding="var(--sds-size-space-1600)">
        <Flex container alignSecondary="center" direction="column" gap="var(--sds-size-space-1200)">
          <TextContentHeading align="center" heading="FAQ" />
          <Accordion>
            <AccordionItem title="What is the difference between the plans?">
              The Basic plan includes 10 users, 100GB storage, and basic support. The Pro plan includes unlimited users, unlimited storage, and priority support. The Enterprise plan includes custom users, custom storage, and 24/7 support.
            </AccordionItem>
            <AccordionItem title="How do I cancel my subscription?">
              You can cancel your subscription by contacting our support team. They will guide you through the process.
            </AccordionItem>
            <AccordionItem title="What payment methods are accepted?">
              We accept credit cards, debit cards, and PayPal.
            </AccordionItem>
            <AccordionItem title="Is there a free trial?">
              Yes, there is a 14-day free trial for all plans.
            </AccordionItem>
          </Accordion>
        </Flex>
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
