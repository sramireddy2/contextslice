import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { Form, InputField, NavigationPill, TextContentTitle } from "primitives";
import { useState } from "react";

export default function Screen() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
  };

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
        <TextContentTitle align="center" title="Join our waitlist" subtitle="Be the first to know when we launch." />
        <Form onSubmit={handleSubmit}>
          <InputField
            value={email}
            label="Email address"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form>
      </Hero>
      <Footer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sds-size-space-400)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.33px", height: "35px", stroke: "var(--sds-color-icon-default-default)", strokeWidth: "3.5px" }} />
            <div style={{ width: "23.98px", height: "24px" }}>
              <div style={{ width: "23.98px", height: "24px", fill: "var(--sds-color-icon-default-default)" }} />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "true" }}>
              <div style={{ width: "24px", height: "18px", fill: "var(--sds-color-icon-default-default)" }} />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "true" }}>
              <div style={{ width: "24px", height: "24px", fill: "var(--sds-color-icon-default-default)" }} />
            </div>
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
