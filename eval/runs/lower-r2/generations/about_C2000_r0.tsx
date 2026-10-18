import { Card, Footer, Header, HeaderAuth, Hero, Panel } from "compositions";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { ButtonGroup, Image, Navigation, NavigationPill, Text, TextContentHeading, TextContentTitle, TextHeading, TextLinkList, TextStrong } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="1200">
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
      <Panel gap="1200">
        <CardGridContentList gap="1200" padding="1200">
          <TextContentHeading heading="Heading" subheading="Subheading" />
          <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
            Title
            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
          </Card>
          <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
            Title
            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
          </Card>
          <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
            Title
            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
          </Card>
        </CardGridContentList>
      </Panel>
      <Panel gap="1200">
        <CardGridImage gap="1200" padding="1200">
          <TextContentHeading heading="Heading" subheading="Subheading" />
          <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
            Title
            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
          </Card>
          <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
            Title
            Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
          </Card>
        </CardGridImage>
      </Panel>
      <Footer>
        <TextLinkList density="default">
          <TextStrong>Use cases</TextStrong>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>Explore</TextStrong>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>Resources</TextStrong>
        </TextLinkList>
      </Footer>
    </Flex>
  );
}
