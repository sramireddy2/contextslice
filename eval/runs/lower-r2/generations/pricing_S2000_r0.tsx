import { Footer, Header, HeaderAuth, Hero, PricingCard } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Navigation, NavigationPill, TextContentHeading, TextContentTitle, TextHeading, TextLink, TextLinkList, TextList, TextListItem, TextPrice, TextStrong } from "primitives";

export default function Screen() {
  return (
    <Flex direction="column" gap="var(--sds-size-space-400)">
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
      <Section>
        <Navigation direction="row">
          <NavigationPill isSelected>Monthly</NavigationPill>
          <NavigationPill>Yearly</NavigationPill>
        </Navigation>
        <Flex direction="row" gap="var(--sds-size-space-400)">
          <PricingCard variant="stroke" heading="Basic Plan" action={{ label: "Sign Up", icon: "arrow-right", variant: "primary" }} listSlot={<TextList density="default"><TextListItem>List item</TextListItem></TextList>} price="$50" priceCurrency="$" priceLabel="/ mo" />
          <PricingCard variant="brand" heading="Premium Plan" action={{ label: "Sign Up", icon: "arrow-right", variant: "primary" }} listSlot={<TextList density="default"><TextListItem>List item</TextListItem></TextList>} price="$100" priceCurrency="$" priceLabel="/ mo" />
          <PricingCard variant="stroke" heading="Enterprise Plan" action={{ label: "Sign Up", icon: "arrow-right", variant: "primary" }} listSlot={<TextList density="default"><TextListItem>List item</TextListItem></TextList>} price="$200" priceCurrency="$" priceLabel="/ mo" />
        </Flex>
      </Section>
      <Section>
        <TextContentHeading align="center" heading="Frequently Asked Questions" subheading="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." />
        <Accordion>
          <AccordionItem title="What is the difference between the Basic and Premium plans?">
            The Basic plan includes essential features, while the Premium plan offers additional tools and support.
          </AccordionItem>
          <AccordionItem title="How do I upgrade my plan?">
            You can upgrade your plan by visiting your account settings and selecting the desired plan.
          </AccordionItem>
          <AccordionItem title="What is the refund policy?">
            Our refund policy is subject to our terms and conditions. Please refer to our website for more details.
          </AccordionItem>
          <AccordionItem title="Can I cancel my subscription?">
            Yes, you can cancel your subscription at any time by visiting your account settings.
          </AccordionItem>
        </Accordion>
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
    </Flex>
  );
}
