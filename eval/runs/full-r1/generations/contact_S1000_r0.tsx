import { Footer, FormBox, Header, Hero, TextContentTitle } from "compositions";
import { ButtonGroup, NavigationPill } from "primitives";
import { useState } from "react";

export default function Screen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

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
        <TextContentTitle hasSubtitle={true} subtitle="Subtitle" title="Title" align="Center" />
        <FormBox onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
          <ButtonGroup buttonEnd={true} buttonStart={false} align="Justify">
            <button type="submit">Submit</button>
          </ButtonGroup>
        </FormBox>
      </Hero>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <img src="/path/to/icon.svg" alt="Icon" />
          </div>
          <TextLinkList hasTitle={true} density="Default">
            <TextStrong text="Use cases" />
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
          <TextLinkList hasTitle={true} density="Default">
            <TextStrong text="Explore" />
            {/* Slot "Slot" (+6 elided) */}
            <TextListItem text="Design" />
          </TextLinkList>
          <TextLinkList hasTitle={true} density="Default">
            <TextStrong text="Resources" />
            {/* Slot "Slot" (+5 elided) */}
            <TextListItem text="Blog" />
            <TextListItem text="Colors" />
          </TextLinkList>
        </div>
      </Footer>
    </div>
  );
}
