import { Footer, Header, HeaderAuth, Hero, TestimonialCard } from "compositions";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Avatar, AvatarBlock, Button, ButtonGroup, Navigation, NavigationPill, TextContentHeading, TextContentTitle, TextHeading, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

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
        <ButtonGroup align="justify">
          <Button variant="primary">Button</Button>
        </ButtonGroup>
      </Hero>
      <Section padding="1200">
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <TextContentHeading heading="Heading" subheading="Subheading" />
          <FlexItem>
            <Flex wrap type="third" gap="1200">
              <TestimonialCard heading="“Quote”" src={placeholder} name="Name" username="Username" />
              <TestimonialCard heading="“Quote”" src={placeholder} name="Name" username="Username" />
              <TestimonialCard heading="“Quote”" src={placeholder} name="Name" username="Username" />
              <TestimonialCard heading="“Quote”" src={placeholder} name="Name" username="Username" />
              <TestimonialCard heading="“Quote”" src={placeholder} name="Name" username="Username" />
              <TestimonialCard heading="“Quote”" src={placeholder} name="Name" username="Username" />
            </Flex>
          </FlexItem>
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
