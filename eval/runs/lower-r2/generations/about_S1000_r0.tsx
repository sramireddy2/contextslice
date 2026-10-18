import { Footer, Header, Hero } from "compositions";
import { NavigationPill, TextContentTitle, TextLinkList, TextListItem, TextStrong } from "primitives";

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
        <TextContentTitle align="center" title="About Simple Design System" subtitle="Empowering designers and developers with a unified language and toolkit." />
      </Hero>
      <div style={{ display: "flex", justifyContent: "space-around", padding: "var(--sds-size-space-400)" }}>
        <div style={{ width: "45%" }}>
          <h2 style={{ fontSize: "var(--sds-size-font-600)" }}>Why Choose Simple Design System?</h2>
          <p style={{ fontSize: "var(--sds-size-font-400)" }}>Our design system is built with the needs of designers and developers in mind, providing a consistent and scalable solution for creating beautiful and functional user interfaces.</p>
        </div>
        <div style={{ width: "45%" }}>
          <h2 style={{ fontSize: "var(--sds-size-font-600)" }}>Our Mission</h2>
          <p style={{ fontSize: "var(--sds-size-font-400)" }}>Our mission is to empower designers and developers to create the best possible user experiences by providing a comprehensive and accessible design system.</p>
        </div>
      </div>
      <Footer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Simple Design System Logo" style={{ width: "23.98px", height: "24px", marginRight: "var(--sds-size-space-200)" }} />
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <TextListItem>UI design</TextListItem>
            <TextListItem>UX design</TextListItem>
            <TextListItem>Wireframing</TextListItem>
            <TextListItem>Diagramming</TextListItem>
            <TextListItem>Team collaboration</TextListItem>
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
            <TextListItem>Developers</TextListItem>
            <TextListItem>Resource library</TextListItem>
          </TextLinkList>
        </div>
      </Footer>
    </div>
  );
}
