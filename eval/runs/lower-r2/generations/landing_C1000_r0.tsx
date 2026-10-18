import { Footer, Header, HeaderAuth, Hero, Panel } from "compositions";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Button, ButtonGroup, Image, Navigation, TextContentHeading, TextContentTitle, TextLinkList } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="1200">
      <Header>
        <Navigation direction="row">
          {/* Slot "Slot" (+6 elided) */}
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="image" src={placeholder}>
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
        <ButtonGroup align="center">
          <Button variant="primary">Button</Button>
        </ButtonGroup>
      </Hero>
      <Panel gap="1200">
        <TextContentHeading heading="Heading" subheading="Subheading" />
        {/* Slot "Cards" (+3 elided) */}
      </Panel>
      <Footer>
        {/* Slot "Title" */}
        <Frame row align="center/center" w="hug" h="hug">
          <Vector "Icon" />
        </Frame>
        {/* Frame "Button List" (+3 elided) */}
        <Frame "LinkedIn" w="24" h="24" clip>
          <Vector "Icon" />
        </Frame>
        {/* Slot "Slot" (+7 elided) */}
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
      </Footer>
    </Flex>
  );
}
