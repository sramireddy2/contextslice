import { Footer, Form, Header, Hero, NavigationPill, Navigation, TextContentTitle, TextLinkList, TextListItem, TextStrong } from "compositions";
import { useState } from "react";

export default function Screen() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
  };

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
        <TextContentTitle hasSubtitle subtitle="Subtitle" title="Title" align="Center" />
        <Form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ padding: "var(--sds-size-space-400)", borderRadius: "var(--sds-size-radius-400)", border: "1px solid var(--sds-color-border-default)", width: "100%", boxSizing: "border-box" }}
          />
          <button type="submit" style={{ padding: "var(--sds-size-space-400) var(--sds-size-space-800)", borderRadius: "var(--sds-size-radius-400)", backgroundColor: "var(--sds-color-primary-default)", color: "var(--sds-color-text-inverse)", border: "none", cursor: "pointer" }}>
            Sign Up
          </button>
        </Form>
      </Hero>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <img src="/path/to/icon.svg" alt="Icon" style={{ width: "24px", height: "24px" }} />
          </div>
          <TextLinkList hasTitle density="Default">
            <TextStrong text="Use cases" />
            <TextListItem text="Design" />
            <TextListItem text="Prototyping" />
            <TextListItem text="Development features" />
            <TextListItem text="Design systems" />
            <TextListItem text="Design process" />
            <TextListItem text="FigJam" />
          </TextLinkList>
          <TextLinkList hasTitle density="Default">
            <TextStrong text="Explore" />
            <TextListItem text="Design" />
            <TextListItem text="Prototyping" />
            <TextListItem text="Development features" />
            <TextListItem text="Design systems" />
            <TextListItem text="Design process" />
            <TextListItem text="FigJam" />
          </TextLinkList>
          <TextLinkList hasTitle density="Default">
            <TextStrong text="Resources" />
            <TextListItem text="Blog" />
            <TextListItem text="Colors" />
            <TextListItem text="Support" />
          </TextLinkList>
        </div>
      </Footer>
    </div>
  );
}
