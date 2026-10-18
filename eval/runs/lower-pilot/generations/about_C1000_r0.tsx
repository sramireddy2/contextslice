import { Card, Footer, Header, HeaderAuth, Hero } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Image, Navigation, Text, TextContentHeading, TextContentTitle, TextHeading } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="1200">
      <Header>
        <Navigation direction="row">
          {/* Slot "Slot" content */}
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
      </Hero>
      <Section padding="1200">
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <FlexItem>
            <Flex wrap direction="column" gap="1200">
              <CardGridContentList gap="1200" padding="1200">
                <TextContentHeading heading="Heading" subheading="Subheading" />
                <Slot name="Cards">
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
                </Slot>
              </CardGridContentList>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Section padding="1200">
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <FlexItem>
            <Flex wrap type="third" gap="1200">
              <CardGridImage gap="1200" padding="1200">
                <TextContentHeading heading="Heading" subheading="Subheading" />
                <Slot name="Slot">
                  <Frame row wrap gap="var(--sds-size-space-1200)" align="min/center" w="fill" h="357">
                    <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                      Title
                      Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                    </Card>
                    <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                      Title
                      Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.
                    </Card>
                  </Frame>
                </Slot>
              </CardGridImage>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Footer>
        <Slot name="Title">
          <Frame>
            <Vector name="Icon" />
          </Frame>
        </Slot>
        <Slot name="Slot">
          {/* Slot "Slot" content */}
        </Slot>
      </Footer>
    </Flex>
  );
}
