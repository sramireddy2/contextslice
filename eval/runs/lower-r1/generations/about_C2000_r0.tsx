import { Card, Footer, Header, Hero, Panel } from "compositions";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Text, TextContentHeading, TextContentTitle, TextHeading, TextLinkList, TextListItem, TextStrong } from "primitives";

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
          <Slot name="Cards">
            <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
              <TextHeading>Title</TextHeading>
              <Text>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
            </Card>
            <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
              <TextHeading>Title</TextHeading>
              <Text>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
            </Card>
            <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
              <TextHeading>Title</TextHeading>
              <Text>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
            </Card>
          </Slot>
        </CardGridContentList>
      </Panel>
      <Panel gap="1200">
        <CardGridImage gap="1200" padding="1200">
          <TextContentHeading heading="Heading" subheading="Subheading" />
          <Slot name="Slot">
            <Frame direction="row" wrap gap="1200" align="min/center" w="fill" h="357">
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Title</TextHeading>
                <Text>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
              </Card>
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Title</TextHeading>
                <Text>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
              </Card>
            </Frame>
          </Slot>
        </CardGridImage>
      </Panel>
      <Footer>
        <Slot name="Title">
          <Frame direction="row" align="center/center" w="hug" h="hug">
            <Vector w="23.33" h="35" stroke="var(--sds-color-icon-default-default)" stroke-w="3.5" />
          </Frame>
          <Frame direction="row" gap="1200" align="min/center" w="hug" h="hug">
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
        </Slot>
        <Slot name="Slot">
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <Slot name="Slot" (+7 elided) />
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <Slot name="Slot" (+6 elided) />
            <TextListItem>Design</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <Slot name="Slot" (+7 elided) />
          </TextLinkList>
        </Slot>
      </Footer>
    </Flex>
  );
}
