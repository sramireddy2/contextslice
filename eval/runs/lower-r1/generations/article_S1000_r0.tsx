import React from "react";
import { Footer, Header, HeaderAuth, Hero, Navigation, NavigationPill, TextContentTitle, TextLink, TextLinkList, TextListItem, TextStrong } from "compositions";
import { colorBackgroundDefaultDefault, colorSlate200 } from "tokens";

export default function Screen() {
  return (
    <div style={{ background: colorBackgroundDefaultDefault, padding: "var(--sds-size-space-400)" }}>
      <Header>
        <Navigation direction="row">
          <NavigationPill isSelected={true}>Products</NavigationPill>
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
      <div style={{ background: colorSlate200, padding: "var(--sds-size-space-400)" }}>
        <TextLinkList density="default" title="Use cases">
          <TextListItem>UI design</TextListItem>
          <TextListItem>UX design</TextListItem>
          <TextListItem>Diagramming</TextListItem>
          <TextListItem>Team collaboration</TextListItem>
        </TextLinkList>
        <TextLinkList density="default" title="Explore">
          <TextListItem>Design</TextListItem>
          <TextListItem>Prototyping</TextListItem>
          <TextListItem>Development features</TextListItem>
          <TextListItem>Design systems</TextListItem>
          <TextListItem>Design process</TextListItem>
          <TextListItem>FigJam</TextListItem>
        </TextLinkList>
        <TextLinkList density="default" title="Resources">
          <TextListItem>Blog</TextListItem>
          <TextListItem>Best practices</TextListItem>
          <TextListItem>Colors</TextListItem>
          <TextListItem>Color wheel</TextListItem>
          <TextListItem>Support</TextListItem>
          <TextListItem>Developers</TextListItem>
          <TextListItem>Resource library</TextListItem>
        </TextLinkList>
      </div>
      <Footer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLink href="#">Privacy Policy</TextLink>
          </div>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLink href="#">Terms of Service</TextLink>
          </div>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLink href="#">Contact Us</TextLink>
          </div>
        </div>
      </Footer>
    </div>
  );
}
