import React from "react";
import { Footer } from "compositions";
import { Header } from "compositions";
import { Hero } from "compositions";
import { Panel } from "compositions";
import { Section } from "layout";
import { placeholder } from "images";
import { Image } from "primitives";
import { NavigationPill } from "primitives";
import { Navigation } from "primitives";
import { TextContentTitle } from "primitives";
import { TextLinkList } from "primitives";
import { TextListItem } from "primitives";
import { TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ gap: "var(--sds-size-space-400)", display: "flex", flexDirection: "column", width: "1200px", backgroundColor: "var(--sds-color-background-default-default)" }}>
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
        <TextContentTitle hasSubtitle subtitle="Subtitle" title="Title" align="Center" />
      </Hero>
      <Section style={{ gap: "var(--sds-size-space-400)", display: "flex", flexDirection: "column", width: "100%", backgroundColor: "var(--sds-color-slate-200)" }}>
        <Panel platform="Desktop" />
        <Panel platform="Desktop" />
      </Section>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <Image src={placeholder} alt="Icon" />
          </div>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.98px", height: "24px" }}>
              <Image src={placeholder} alt="Icon" />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 24px 0)" }}>
              <Image src={placeholder} alt="Icon" />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 24px 0)" }}>
              <Image src={placeholder} alt="Icon" />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 24px 0)" }}>
              <Image src={placeholder} alt="Icon" />
            </div>
          </div>
        </div>
        <TextLinkList hasTitle density="Default">
          <TextStrong text="Use cases" />
          <TextListItem text="Design" />
          <TextListItem text="Development" />
          <TextListItem text="Marketing" />
          <TextListItem text="Sales" />
          <TextListItem text="Support" />
        </TextLinkList>
        <TextLinkList hasTitle density="Default">
          <TextStrong text="Explore" />
          <TextListItem text="Design" />
          <TextListItem text="Development" />
          <TextListItem text="Marketing" />
          <TextListItem text="Sales" />
          <TextListItem text="Support" />
        </TextLinkList>
        <TextLinkList hasTitle density="Default">
          <TextStrong text="Resources" />
          <TextListItem text="Blog" />
          <TextListItem text="Colors" />
          <TextListItem text="Support" />
        </TextLinkList>
      </Footer>
    </div>
  );
}
