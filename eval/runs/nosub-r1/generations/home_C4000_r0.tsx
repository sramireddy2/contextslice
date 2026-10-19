import React from "react";
import { IconStar, IconX } from "icons";
import { Header, NavigationPillList, HeaderAuth, HeroActions, TextContentTitle, ButtonGroup, CardGridTestimonials, Footer, TextLinkList } from "compositions";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh" }}>
      <Header>
        <NavigationPillList>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </NavigationPillList>
        <HeaderAuth>
          <Button variant="Neutral" size="Small" label="Sign in" />
          <Button variant="Primary" size="Small" label="Register" />
        </HeaderAuth>
      </Header>
      <HeroActions>
        <TextContentTitle title="Title" subtitle="Subtitle" />
        <ButtonGroup>
          <Button variant="Neutral" size="Medium" label="Button" />
          <Button variant="Primary" size="Medium" label="Button" />
        </ButtonGroup>
      </HeroActions>
      <div style={{ backgroundColor: "var(--sds-color-slate-200)", padding: "var(--sds-size-space-1600)" }} />
      <CardGridTestimonials>
        <TextContentHeading heading="Heading" subheading="Subheading" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sds-size-space-1200)" }}>
          <div style={{ flex: 1, padding: "var(--sds-size-space-600)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }} />
          <div style={{ flex: 1, padding: "var(--sds-size-space-600)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }} />
          <div style={{ flex: 1, padding: "var(--sds-size-space-600)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }} />
          <div style={{ flex: 1, padding: "var(--sds-size-space-600)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }} />
          <div style={{ flex: 1, padding: "var(--sds-size-space-600)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }} />
          <div style={{ flex: 1, padding: "var(--sds-size-space-600)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }} />
        </div>
      </CardGridTestimonials>
      <Footer>
        <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconStar size="23.33" />
            </div>
            <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "23.98", height: "24" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "24", height: "24" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "24", height: "18" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "24", height: "24" }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--sds-size-space-16)" }}>
            <TextLinkList density="Default" hasTitle>
              <div style={{ display: "flex", flexDirection: "column", padding: "0 0 var(--sds-size-space-400) 0" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextStrong>Use cases</TextStrong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12" }}>
                  <TextLinkListItem>UI design</TextLinkListItem>
                  <TextLinkListItem>UX design</TextLinkListItem>
                  <TextLinkListItem>Wireframing</TextLinkListItem>
                  <TextLinkListItem>Diagramming</TextLinkListItem>
                  <TextLinkListItem>Brainstorming</TextLinkListItem>
                  <TextLinkListItem>Online whiteboard</TextLinkListItem>
                  <TextLinkListItem>Team collaboration</TextLinkListItem>
                </div>
              </div>
            </TextLinkList>
            <TextLinkList density="Default" hasTitle>
              <div style={{ display: "flex", flexDirection: "column", padding: "0 0 var(--sds-size-space-400) 0" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextStrong>Explore</TextStrong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12" }}>
                  <TextLinkListItem>Design</TextLinkListItem>
                  <TextLinkListItem>Prototyping</TextLinkListItem>
                  <TextLinkListItem>Development features</TextLinkListItem>
                  <TextLinkListItem>Design systems</TextLinkListItem>
                  <TextLinkListItem>Collaboration features</TextLinkListItem>
                  <TextLinkListItem>Design process</TextLinkListItem>
                  <TextLinkListItem>FigJam</TextLinkListItem>
                </div>
              </div>
            </TextLinkList>
            <TextLinkList density="Default" hasTitle>
              <div style={{ display: "flex", flexDirection: "column", padding: "0 0 var(--sds-size-space-400) 0" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextStrong>Resources</TextStrong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12" }}>
                  <TextLinkListItem>Blog</TextLinkListItem>
                  <TextLinkListItem>Best practices</TextLinkListItem>
                  <TextLinkListItem>Colors</TextLinkListItem>
                  <TextLinkListItem>Color wheel</TextLinkListItem>
                  <TextLinkListItem>Support</TextLinkListItem>
                  <TextLinkListItem>Developers</TextLinkListItem>
                  <TextLinkListItem>Resource library</TextLinkListItem>
                </div>
              </div>
            </TextLinkList>
          </div>
        </div>
      </Footer>
    </div>
  );
}
