import React from "react";
import { Footer } from "compositions";
import { Form } from "primitives";
import { Header } from "compositions";
import { HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { InputField } from "primitives";
import { NavigationPill } from "primitives";
import { Navigation } from "primitives";
import { TextContentTitle } from "primitives";
import { TextLinkList } from "primitives";
import { TextListItem } from "primitives";
import { TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "23.33px", height: "35px", stroke: "var(--sds-color-icon-default-default)", strokeWidth: "3.5px" }} />
            </div>
            <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
              <div style={{ width: "23.98px", height: "24px" }} />
              <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 24px 0)" }}>
                <div style={{ width: "24px", height: "24px", fill: "var(--sds-color-icon-default-default)" }} />
              </div>
              <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 18px 0)" }}>
                <div style={{ width: "24px", height: "18px", fill: "var(--sds-color-icon-default-default)" }} />
              </div>
              <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 24px 0)" }}>
                <div style={{ width: "24px", height: "24px", fill: "var(--sds-color-icon-default-default)" }} />
              </div>
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
