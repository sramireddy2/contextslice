import React from "react";
import { Footer } from "compositions";
import { Header } from "compositions";
import { Hero } from "compositions";
import { Panel } from "compositions";
import { Section } from "layout";
import { placeholder } from "images";
import { Image } from "primitives";
import { TextContentTitle } from "primitives";
import { TextLinkList } from "primitives";
import { TextListItem } from "primitives";
import { TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ gap: "var(--sds-size-space-400)" }}>
      <Header platform="Desktop" state="Default" />
      <Hero platform="Desktop">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
      </Hero>
      <Section style={{ gap: "var(--sds-size-space-400)" }}>
        <Panel platform="Desktop">
          <p>
            This is the body text of the article. It provides detailed information
            and insights on the topic at hand.
          </p>
        </Panel>
        <Panel platform="Desktop">
          <TextLinkList title="Related Cards" density="default">
            <TextListItem>
              <TextLink href="#">Card 1</TextLink>
            </TextListItem>
            <TextListItem>
              <TextLink href="#">Card 2</TextLink>
            </TextListItem>
            <TextListItem>
              <TextLink href="#">Card 3</TextLink>
            </TextListItem>
          </TextLinkList>
        </Panel>
      </Section>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src={placeholder} alt="Icon" width={23.33} height={35} style={{ stroke: "var(--sds-color-icon-default-default)", strokeWidth: 3.5 }} />
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: 23.98, height: 24 }}>
              <Image src={placeholder} alt="Icon" width={23.98} height={24} />
            </div>
            <div style={{ width: 24, height: 24, clip: "rect(0 24 24 0)" }}>
              <Image src={placeholder} alt="Icon" width={24} height={24} />
            </div>
            <div style={{ width: 24, height: 24, clip: "rect(0 24 24 0)" }}>
              <Image src={placeholder} alt="Icon" width={24} height={24} />
            </div>
            <div style={{ width: 24, height: 24, clip: "rect(0 24 24 0)" }}>
              <Image src={placeholder} alt="Icon" width={24} height={24} />
            </div>
          </div>
        </div>
        <TextLinkList title="Explore" density="default">
          <TextListItem>
            <TextLink href="#">Design</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Prototyping</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Development features</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Design systems</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Collaboration features</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Design process</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">FigJam</TextLink>
          </TextListItem>
        </TextLinkList>
        <TextLinkList title="Resources" density="default">
          <TextListItem>
            <TextLink href="#">Blog</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Best practices</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Colors</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Color wheel</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Support</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Developers</TextLink>
          </TextListItem>
          <TextListItem>
            <TextLink href="#">Resource library</TextLink>
          </TextListItem>
        </TextLinkList>
      </Footer>
    </div>
  );
}
