import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { placeholder } from "images";
import { Navigation, NavigationPill, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

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
      <Hero
        title="Welcome to Simple Design System"
        subtitle="Streamline your design and development process with our comprehensive design system."
        image={placeholder}
      />
      <Footer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Vector src="icon" />
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <Frame>
              <Vector src="x-logo" />
            </Frame>
            <Frame>
              <Vector src="logo-instagram" />
            </Frame>
            <Frame>
              <Vector src="logo-youtube" />
            </Frame>
            <Frame>
              <Vector src="linkedin" />
            </Frame>
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
