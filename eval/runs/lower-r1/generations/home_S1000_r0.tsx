import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { Button, ButtonGroup, Navigation, NavigationPill, TextContentTitle, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

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
        <ButtonGroup align="justify">
          <Button variant="primary">Button</Button>
        </ButtonGroup>
      </Hero>
      <div style={{ flex: 1, backgroundColor: "var(--sds-color-slate-200)" }}>
        {/* Section content goes here */}
      </div>
      <Footer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLink href="#">Use cases</TextLink>
          </div>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLink href="#">Explore</TextLink>
          </div>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLink href="#">Resources</TextLink>
          </div>
        </div>
        <TextLinkList density="default">
          <TextStrong>Use cases</TextStrong>
          <TextListItem>Design</TextListItem>
          <TextListItem>Prototyping</TextListItem>
          <TextListItem>Development features</TextListItem>
          <TextListItem>Design systems</TextListItem>
          <TextListItem>Design process</TextListItem>
          <TextListItem>FigJam</TextListItem>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>Explore</TextStrong>
          <TextListItem>Design</TextListItem>
          <TextListItem>Prototyping</TextListItem>
          <TextListItem>Development features</TextListItem>
          <TextListItem>Design systems</TextListItem>
          <TextListItem>Design process</TextListItem>
          <TextListItem>FigJam</TextListItem>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>Resources</TextStrong>
          <TextListItem>Blog</TextListItem>
          <TextListItem>Best practices</TextListItem>
          <TextListItem>Colors</TextListItem>
          <TextListItem>Color wheel</TextListItem>
          <TextListItem>Support</TextListItem>
        </TextLinkList>
      </Footer>
    </div>
  );
}
