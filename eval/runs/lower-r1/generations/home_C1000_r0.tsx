import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Button, ButtonGroup, Navigation, TextContentHeading, TextContentTitle, TextLinkList } from "primitives";

export default function Screen() {
  return (
    <Flex direction="column" fill="background-default-default">
      <Header>
        <Navigation direction="row">
          {/* Slot "Slot" (+6 elided) */}
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
          <FlexItem>
            <Flex wrap type="third" gap="1200">
              {/* Slot "Card Grid" (+1 elided) */}
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Footer>
        <Slot name="Title">
          <Frame direction="row" align="center/center" w="hug" h="hug">
            <Vector name="Icon" w="23.33" h="35" stroke="icon-default-default" stroke-w="3.5" />
            <Frame name="Button List" direction="row" gap="size-space-400" align="min/center" w="hug" h="hug">
              {/* Slot "Slot" (+2 elided) */}
            </Frame>
          </Frame>
        </Slot>
        <Slot name="Slot">
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
        </Slot>
      </Footer>
    </Flex>
  );
}
