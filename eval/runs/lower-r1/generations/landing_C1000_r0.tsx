import { Footer, Header, HeaderAuth, Hero, Panel } from "compositions";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Button, ButtonGroup, Image, Navigation, TextContentHeading, TextContentTitle, TextLinkList } from "primitives";

export default function Screen() {
  return (
    <Flex direction="column" gap="var(--sds-size-space-400)">
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
      <Panel gap="var(--sds-size-space-400)">
        <TextContentHeading heading="Heading" subheading="Subheading" />
        {/* Slot "Cards" (+3 elided) */}
      </Panel>
      <Footer>
        {/* Slot "Title" */}
        <Frame direction="row" align="center/center">
          <Vector />
        </Frame>
        <Frame direction="row" gap="var(--sds-size-space-400)" align="min/center">
          <Frame>
            {/* X Logo (+1 elided) */}
          </Frame>
          <Frame direction="row" w="24" h="24" clip>
            <Vector />
          </Frame>
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
      </Footer>
    </Flex>
  );
}
