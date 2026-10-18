import { Footer, Header, HeaderAuth, Hero, NavigationPill, TextLinkList, TextListItem, TextStrong } from "compositions";
import { placeholder } from "images";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header>
        <Navigation direction="row">
          <NavigationPill isSelected={false}>Products</NavigationPill>
          <NavigationPill isSelected={false}>Solutions</NavigationPill>
          <NavigationPill isSelected={false}>Community</NavigationPill>
          <NavigationPill isSelected={false}>Resources</NavigationPill>
          <NavigationPill isSelected={false}>Pricing</NavigationPill>
          <NavigationPill isSelected={false}>Contact</NavigationPill>
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero />
      <Footer>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sds-size-space-400)" }}>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.98px", height: "24px" }} />
            <div style={{ width: "24px", height: "24px" }} />
            <div style={{ width: "24px", height: "24px" }} />
            <div style={{ width: "24px", height: "24px" }} />
          </div>
        </div>
        <TextLinkList density="default">
          <TextStrong>Use cases</TextStrong>
          <TextListItem>UI design</TextListItem>
          <TextListItem>UX design</TextListItem>
          <TextListItem>Wireframing</TextListItem>
          <TextListItem>Diagramming</TextListItem>
          <TextListItem>Brainstorming</TextListItem>
          <TextListItem>Online whiteboard</TextListItem>
          <TextListItem>Team collaboration</TextListItem>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>Explore</TextStrong>
          <TextListItem>Design</TextListItem>
          <TextListItem>Prototyping</TextListItem>
          <TextListItem>Development features</TextListItem>
          <TextListItem>Design systems</TextListItem>
          <TextListItem>Collaboration features</TextListItem>
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
          <TextListItem>Developers</TextListItem>
          <TextListItem>Resource library</TextListItem>
        </TextLinkList>
      </Footer>
    </div>
  );
}
