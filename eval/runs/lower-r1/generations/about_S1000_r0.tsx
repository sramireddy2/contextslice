import React from "react";
import { Footer, Header, Hero, NavigationPill, Navigation, TextContentTitle, TextLinkList, TextListItem, TextStrong } from "compositions";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
      <div style={{ display: "flex", justifyContent: "space-around", padding: "var(--sds-size-space-400)" }}>
        <div style={{ flex: 1, marginRight: "var(--sds-size-space-400)" }}>
          <TextLinkList density="default" title="Use cases">
            <TextListItem>UI design</TextListItem>
            <TextListItem>UX design</TextListItem>
            <TextListItem>Wireframing</TextListItem>
            <TextListItem>Diagramming</TextListItem>
            <TextListItem>Brainstorming</TextListItem>
            <TextListItem>Online whiteboard</TextListItem>
            <TextListItem>Team collaboration</TextListItem>
          </TextLinkList>
        </div>
        <div style={{ flex: 1, marginRight: "var(--sds-size-space-400)" }}>
          <TextLinkList density="default" title="Explore">
            <TextListItem>Design</TextListItem>
            <TextListItem>Prototyping</TextListItem>
            <TextListItem>Development features</TextListItem>
            <TextListItem>Design systems</TextListItem>
            <TextListItem>Collaboration features</TextListItem>
            <TextListItem>Design process</TextListItem>
            <TextListItem>FigJam</TextListItem>
          </TextLinkList>
        </div>
        <div style={{ flex: 1 }}>
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
      </div>
      <Footer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLinkList density="default" title="Social">
              <TextListItem>LinkedIn</TextListItem>
              <TextListItem>Instagram</TextListItem>
              <TextListItem>YouTube</TextListItem>
            </TextLinkList>
          </div>
          <div>
            <TextLinkList density="default" title="Explore">
              <TextListItem>Design</TextListItem>
              <TextListItem>Prototyping</TextListItem>
              <TextListItem>Development features</TextListItem>
              <TextListItem>Design systems</TextListItem>
              <TextListItem>Collaboration features</TextListItem>
              <TextListItem>Design process</TextListItem>
              <TextListItem>FigJam</TextListItem>
            </TextLinkList>
          </div>
        </div>
      </Footer>
    </div>
  );
}
