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
        <TextContentTitle align="center" title="Pricing" subtitle="Choose the plan that fits your needs" />
      </Hero>
      <div style={{ padding: "var(--sds-size-space-400)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--sds-size-space-400)" }}>
          <div style={{ width: "300px" }}>
            <div style={{ padding: "var(--sds-size-space-200)" }}>
              <TextStrong>Basic Plan</TextStrong>
              <TextLink href="#">View Details</TextLink>
            </div>
            <div style={{ padding: "var(--sds-size-space-200)" }}>
              <TextStrong>Standard Plan</TextStrong>
              <TextLink href="#">View Details</TextLink>
            </div>
            <div style={{ padding: "var(--sds-size-space-200)" }}>
              <TextStrong>Enterprise Plan</TextStrong>
              <TextLink href="#">View Details</TextLink>
            </div>
          </div>
          <div style={{ width: "500px" }}>
            <TextContentTitle align="center" title="FAQ" />
            <TextLinkList density="default">
              <TextStrong>What is included in the Basic Plan?</TextStrong>
              <TextListItem>Feature 1</TextListItem>
              <TextListItem>Feature 2</TextListItem>
              <TextListItem>Feature 3</TextListItem>
            </TextLinkList>
            <TextLinkList density="default">
              <TextStrong>What is included in the Standard Plan?</TextStrong>
              <TextListItem>Feature 1</TextListItem>
              <TextListItem>Feature 2</TextListItem>
              <TextListItem>Feature 3</TextListItem>
            </TextLinkList>
            <TextLinkList density="default">
              <TextStrong>What is included in the Enterprise Plan?</TextStrong>
              <TextListItem>Feature 1</TextListItem>
              <TextListItem>Feature 2</TextListItem>
              <TextListItem>Feature 3</TextListItem>
            </TextLinkList>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
