import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { Navigation, NavigationPill, TextContentTitle, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

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
      <div style={{ flex: 1, padding: "var(--sds-size-space-400)" }}>
        <h1 style={{ fontSize: "var(--sds-typography-font-size-400)" }}>Article Title</h1>
        <p style={{ fontSize: "var(--sds-typography-font-size-200)" }}>
          This is the body text of the article. It provides detailed information and insights on the topic.
        </p>
        <h2 style={{ fontSize: "var(--sds-typography-font-size-300)" }}>Related Cards</h2>
        <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
          <div style={{ flex: 1, padding: "var(--sds-size-space-200)" }}>
            <h3 style={{ fontSize: "var(--sds-typography-font-size-200)" }}>Card Title 1</h3>
            <p style={{ fontSize: "var(--sds-typography-font-size-150)" }}>
              This is a related card with additional information.
            </p>
          </div>
          <div style={{ flex: 1, padding: "var(--sds-size-space-200)" }}>
            <h3 style={{ fontSize: "var(--sds-typography-font-size-200)" }}>Card Title 2</h3>
            <p style={{ fontSize: "var(--sds-typography-font-size-150)" }}>
              This is another related card with additional information.
            </p>
          </div>
        </div>
      </div>
      <Footer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sds-size-space-400)" }}>
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <TextListItem>Use case 1</TextListItem>
            <TextListItem>Use case 2</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <TextListItem>Explore 1</TextListItem>
            <TextListItem>Explore 2</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <TextListItem>Resource 1</TextListItem>
            <TextListItem>Resource 2</TextListItem>
          </TextLinkList>
        </div>
      </Footer>
    </div>
  );
}
