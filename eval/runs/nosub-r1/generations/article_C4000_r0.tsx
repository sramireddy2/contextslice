import React from "react";
import { Text, Button, Card, Image } from "primitives";
import { NavigationPillList, NavigationPill } from "compositions";
import { Header, Footer } from "layout";
import { IconStar, IconX } from "icons";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-600)", padding: "var(--sds-size-space-800)" }}>
      <Header>
        <NavigationPillList>
          <NavigationPill label="Products" state="active" />
          <NavigationPill label="Solutions" state="default" />
          <NavigationPill label="Community" state="default" />
          <NavigationPill label="Resources" state="default" />
          <NavigationPill label="Pricing" state="default" />
          <NavigationPill label="Contact" state="default" />
        </NavigationPillList>
        <Header.Auth>
          <Button variant="neutral" state="default" size="small" iconEnd={<IconX />} label="Sign in" />
          <Button variant="primary" state="default" size="small" iconEnd={<IconX />} label="Register" />
        </Header.Auth>
      </Header>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-200)", padding: "var(--sds-size-space-4000)" }}>
        <Text.Content.Title title="Title" subtitle="Subtitle" align="center" />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-10)" }}>
          <Text.Body>Body text goes here...</Text.Body>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "var(--sds-size-space-1200)", padding: "var(--sds-size-space-1600)" }}>
          <Card>
            <Image src="path/to/image1.jpg" alt="Image 1" />
            <Text.Body>Card 1 content goes here...</Text.Body>
          </Card>
          <Card>
            <Image src="path/to/image2.jpg" alt="Image 2" />
            <Text.Body>Card 2 content goes here...</Text.Body>
          </Card>
        </div>
      </div>
      <Footer>
        <div style={{ display: "flex", flexDirection: "row", gap: "var(--sds-size-space-400)" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "var(--sds-size-space-400)" }}>
            <Button icon={<IconStar />} label="Use cases" />
            <Button icon={<IconStar />} label="Explore" />
            <Button icon={<IconStar />} label="Resources" />
          </div>
        </div>
      </Footer>
    </div>
  );
}
