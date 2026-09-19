import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Header, HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { Button, ButtonGroup } from "primitives";
import { TextContentHeading, TextContentTitle } from "primitives";
import { TextLinkList } from "primitives";
import { IconStar, IconX } from "icons";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header platform="Desktop" state="Default">
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
        <ButtonGroup align="justify">
          <Button
            iconEnd={<IconX size="medium" />}
            hasIconStart={false}
            hasIconEnd={false}
            iconStart={<IconStar size="medium" />}
            label="Button"
            variant="primary"
            state="default"
            size="medium"
          />
        </ButtonGroup>
      </Hero>
      <Section padding="var(--sds-size-space-400)">
        <Flex container gap="var(--sds-size-space-400)" direction="column" alignSecondary="stretch">
          <TextContentHeading heading="Heading" subheading="Subheading" align="start" />
          <FlexItem>
            <Flex wrap type="third" gap="var(--sds-size-space-400)">
              {/* Card Grid Testimonials */}
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <svg width="23.33" height="35" stroke="#1e1e1e" strokeWidth="3.5" />
          </div>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            {/* Button List */}
          </div>
        </div>
        <div>
          <TextLinkList title="Link List Title" density="default">
            {/* Link List Items */}
          </TextLinkList>
          <TextLinkList title="Link List Title" density="default">
            {/* Link List Items */}
          </TextLinkList>
          <TextLinkList title="Link List Title" density="default">
            {/* Link List Items */}
          </TextLinkList>
        </div>
      </Footer>
    </div>
  );
}
