import { Footer } from "compositions";
import { Hero } from "compositions";
import { Header } from "compositions";
import { HeaderAuth } from "compositions";
import { Panel } from "compositions";
import { CardGridIcon } from "layout";
import { TextContentHeading } from "primitives";
import { TextContentTitle } from "primitives";
import { ButtonGroup } from "primitives";
import { TextLinkList } from "primitives";
import { placeholder } from "images";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header platform="Desktop" state="Default">
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop" src={placeholder}>
        <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
        <ButtonGroup align="center">
          {/* Button Group content goes here */}
        </ButtonGroup>
      </Hero>
      <Panel platform="Desktop" />
      <CardGridIcon platform="Desktop">
        <TextContentHeading heading="Heading" subheading="Subheading" align="start" />
        {/* Card Grid content goes here */}
      </CardGridIcon>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <VectorIcon />
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            {/* Footer Button List content goes here */}
          </div>
        </div>
        <TextLinkList title="Has Title" density="default">
          {/* Text Link List content goes here */}
        </TextLinkList>
        <TextLinkList title="Has Title" density="default">
          {/* Text Link List content goes here */}
        </TextLinkList>
        <TextLinkList title="Has Title" density="default">
          {/* Text Link List content goes here */}
        </TextLinkList>
      </Footer>
    </div>
  );
}
