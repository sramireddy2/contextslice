import React from "react";
import { Footer, Header, HeaderAuth, Hero, Navigation, NavigationPill, TextContentTitle, TextLink, TextLinkList, TextListItem, TextStrong } from "compositions";
import { colorBackgroundDefaultDefault } from "primitives";

export default function Screen() {
  return (
    <div style={{ backgroundColor: colorBackgroundDefaultDefault, padding: "var(--sds-size-space-400)" }}>
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
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--sds-size-space-400)" }}>
        <div style={{ width: "300px" }}>
          <TextContentTitle title="Basic Plan" subtitle="For small teams" />
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>5 users</li>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>Unlimited projects</li>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>Basic support</li>
          </ul>
          <TextLink href="#">Get Started</TextLink>
        </div>
        <div style={{ width: "300px" }}>
          <TextContentTitle title="Pro Plan" subtitle="For growing teams" />
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>10 users</li>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>Unlimited projects</li>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>Advanced support</li>
          </ul>
          <TextLink href="#">Get Started</TextLink>
        </div>
        <div style={{ width: "300px" }}>
          <TextContentTitle title="Enterprise Plan" subtitle="For large organizations" />
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>Unlimited users</li>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>Unlimited projects</li>
            <li style={{ marginBottom: "var(--sds-size-space-200)" }}>Premium support</li>
          </ul>
          <TextLink href="#">Get Started</TextLink>
        </div>
      </div>
      <div style={{ padding: "var(--sds-size-space-400)" }}>
        <TextContentTitle title="FAQ" />
        <TextLinkList density="default">
          <TextStrong>What is the difference between the plans?</TextStrong>
          <TextListItem>Basic plan includes 5 users, Pro plan includes 10 users, and Enterprise plan includes unlimited users.</TextListItem>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>How do I upgrade my plan?</TextStrong>
          <TextListItem>Contact our sales team for assistance with upgrading your plan.</TextListItem>
        </TextLinkList>
        <TextLinkList density="default">
          <TextStrong>What is included in the free trial?</TextStrong>
          <TextListItem>Free trial includes access to the Basic Plan for 30 days.</TextListItem>
        </TextLinkList>
      </div>
      <Footer>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sds-size-space-200)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sds-size-space-200)" }}>
            <div style={{ width: "24px", height: "24px" }} />
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
