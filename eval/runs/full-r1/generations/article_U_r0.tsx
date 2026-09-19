import React from "react";
import { Footer } from "compositions";
import { Header } from "compositions";
import { HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { Panel } from "compositions";
import { NavigationPill } from "primitives";
import { Navigation } from "primitives";
import { TextContentTitle } from "primitives";
import { TextLinkList } from "primitives";
import { TextListItem } from "primitives";
import { TextStrong } from "primitives";
import { placeholder } from "images";

export default function Screen() {
  return (
    <div style={{ backgroundColor: "var(--sds-color-background-default-default)" }}>
      <Header platform="Desktop" state="Default">
        <Navigation direction="Row">
          <NavigationPill label="Products" state="Active" />
          <NavigationPill label="Solutions" state="Default" />
          <NavigationPill label="Community" state="Default" />
          <NavigationPill label="Resources" state="Default" />
          <NavigationPill label="Pricing" state="Default" />
          <NavigationPill label="Contact" state="Default" />
        </Navigation>
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop">
        <TextContentTitle align="Center" title="Title" subtitle="Subtitle" />
      </Hero>
      <div style={{ padding: "var(--sds-size-space-400)" }}>
        <Panel platform="Desktop">
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
        </Panel>
        <Panel platform="Desktop">
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
        </Panel>
      </div>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <Vector width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
          </div>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.98", height: "24" }}>
              <Vector width="23.98" height="24" fill="var(--sds-color-icon-default-default)" />
            </div>
            <div style={{ width: "24", height: "24", clip: "true" }}>
              <Vector width="24" height="24" fill="var(--sds-color-icon-default-default)" />
            </div>
            <div style={{ width: "24", height: "24", clip: "true" }}>
              <Vector width="24" height="18" fill="var(--sds-color-icon-default-default)" />
            </div>
            <div style={{ width: "24", height: "24", clip: "true" }}>
              <Vector width="24" height="24" fill="var(--sds-color-icon-default-default)" />
            </div>
          </div>
        </div>
        <TextLinkList title="Use cases" density="Default">
          <TextStrong text="Use cases" />
          <TextListItem text="UI design" />
          <TextListItem text="UX design" />
          <TextListItem text="Wireframing" />
          <TextListItem text="Diagramming" />
          <TextListItem text="Brainstorming" />
          <TextListItem text="Online whiteboard" />
          <TextListItem text="Team collaboration" />
        </TextLinkList>
        <TextLinkList title="Explore" density="Default">
          <TextStrong text="Explore" />
          <TextListItem text="Design" />
          <TextListItem text="Prototyping" />
          <TextListItem text="Development features" />
          <TextListItem text="Design systems" />
          <TextListItem text="Collaboration features" />
          <TextListItem text="Design process" />
          <TextListItem text="FigJam" />
        </TextLinkList>
        <TextLinkList title="Resources" density="Default">
          <TextStrong text="Resources" />
          <TextListItem text="Blog" />
          <TextListItem text="Best practices" />
          <TextListItem text="Colors" />
          <TextListItem text="Color wheel" />
          <TextListItem text="Support" />
          <TextListItem text="Developers" />
          <TextListItem text="Resource library" />
        </TextLinkList>
      </Footer>
    </div>
  );
}
