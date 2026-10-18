import { Footer, Header, HeaderAuth, Hero, Panel } from "compositions";
import { placeholder } from "images";
import { Section } from "layout";
import { Image, Navigation, NavigationPill, TextContentTitle, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
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
      <Section padding="1200">
        <Panel gap="1200">
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
        </Panel>
      </Section>
      <Footer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Vector width="23.33" height="35" stroke="#1e1e1e" strokeWidth="3.5" />
        </div>
        <div style={{ display: "flex", gap: "var(--sds-size-space-400)", alignItems: "center" }}>
          <div style={{ width: "23.98", height: "24" }}>
            <Vector width="23.98" height="24" fill="#1e1e1e" />
          </div>
          <div style={{ width: "24", height: "24", clip: "rect(0 24 24 0)" }}>
            <Vector width="24" height="24" fill="#1e1e1e" />
          </div>
          <div style={{ width: "24", height: "24", clip: "rect(0 24 18 0)" }}>
            <Vector width="24" height="18" fill="#1e1e1e" />
          </div>
          <div style={{ width: "24", height: "24", clip: "rect(0 24 24 0)" }}>
            <Vector width="24" height="24" fill="#1e1e1e" />
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
