import React from "react";
import { Footer } from "compositions";
import { Form, InputField, Hero, TextContentTitle } from "primitives";
import { Header, HeaderAuth, NavigationPill, Navigation } from "compositions";

export default function Screen() {
  return (
    <div style={{ width: "1200px", margin: "0 auto" }}>
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
        <TextContentTitle
          hasSubtitle={true}
          subtitle="Subtitle"
          title="Title"
          align="Center"
        />
        <FormBox>
          <InputField
            value="you@example.com"
            description="Description"
            error="Error"
            hasError={false}
            hasDescription={false}
            label="Email address"
            hasLabel={false}
            state="Default"
            valueType="Default"
          />
        </FormBox>
      </Hero>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <img src="/path/to/icon.svg" alt="Icon" width="23.33" height="35" style={{ stroke: "var(--sds-color-icon-default-default)", strokeWidth: "3.5" }} />
          </div>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.98px", height: "24px" }}>
              <img src="/path/to/x-logo.svg" alt="X Logo" width="23.98" height="24" style={{ fill: "var(--sds-color-icon-default-default)" }} />
            </div>
            <div style={{ width: "24px", height: "24px" }}>
              <img src="/path/to/instagram-logo.svg" alt="Logo Instagram" width="24" height="24" style={{ fill: "var(--sds-color-icon-default-default)" }} />
            </div>
            <div style={{ width: "24px", height: "24px" }}>
              <img src="/path/to/youtube-logo.svg" alt="Logo YouTube" width="24" height="18" style={{ fill: "var(--sds-color-icon-default-default)" }} />
            </div>
            <div style={{ width: "24px", height: "24px" }}>
              <img src="/path/to/linkedin-logo.svg" alt="LinkedIn" width="24" height="24" style={{ fill: "var(--sds-color-icon-default-default)" }} />
            </div>
          </div>
        </div>
        <TextLinkList hasTitle={true} density="Default">
          <TextStrong text="Use cases" />
          <TextListItem text="UI design" />
          <TextListItem text="UX design" />
          <TextListItem text="Wireframing" />
          <TextListItem text="Diagramming" />
          <TextListItem text="Brainstorming" />
          <TextListItem text="Online whiteboard" />
          <TextListItem text="Team collaboration" />
        </TextLinkList>
        <TextLinkList hasTitle={true} density="Default">
          <TextStrong text="Explore" />
          <TextListItem text="Design" />
          <TextListItem text="Prototyping" />
          <TextListItem text="Development features" />
          <TextListItem text="Design systems" />
          <TextListItem text="Collaboration features" />
          <TextListItem text="Design process" />
          <TextListItem text="FigJam" />
        </TextLinkList>
        <TextLinkList hasTitle={true} density="Default">
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
