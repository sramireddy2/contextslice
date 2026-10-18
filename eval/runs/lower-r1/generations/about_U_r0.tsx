import { Card, Footer, Header, HeaderAuth, Hero, Panel } from "compositions";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { ButtonGroup, Image, Navigation, NavigationPill, Text, TextContentHeading, TextContentTitle, TextHeading, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

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
