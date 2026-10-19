import { Button, FormInput, FormNewsletter, Header, HeroContent, NavigationPillList, TextLinkList } from "compositions";
import { IconStar, IconX } from "icons";
import { useState } from "react";

export default function Screen() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-600)", padding: "var(--sds-size-space-800)" }}>
      <Header>
        <NavigationPillList>
          <NavigationPill label="Products" />
          <NavigationPill label="Solutions" />
          <NavigationPill label="Community" />
          <NavigationPill label="Resources" />
          <NavigationPill label="Pricing" />
          <NavigationPill label="Contact" />
        </NavigationPillList>
        <HeaderAuth>
          <Button label="Sign in" variant="neutral" />
          <Button label="Register" variant="primary" />
        </HeaderAuth>
      </Header>
      <HeroContent>
        <HeroNewsletter>
          <TextContentTitle title="Join our waitlist" subtitle="Be one of the first to try our new features" />
          <FormNewsletter onSubmit={handleSubmit}>
            <FormInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button label="Submit" variant="primary" />
          </FormNewsletter>
        </HeroNewsletter>
      </HeroContent>
      <Footer>
        <TextLinkList title="Use cases">
          <TextLinkList.Item>UI design</TextLinkList.Item>
          <TextLinkList.Item>UX design</TextLinkList.Item>
          <TextLinkList.Item>Wireframing</TextLinkList.Item>
          <TextLinkList.Item>Diagramming</TextLinkList.Item>
          <TextLinkList.Item>Brainstorming</TextLinkList.Item>
          <TextLinkList.Item>Online whiteboard</TextLinkList.Item>
          <TextLinkList.Item>Team collaboration</TextLinkList.Item>
        </TextLinkList>
        <TextLinkList title="Explore">
          <TextLinkList.Item>Design</TextLinkList.Item>
          <TextLinkList.Item>Prototyping</TextLinkList.Item>
          <TextLinkList.Item>Development features</TextLinkList.Item>
          <TextLinkList.Item>Design systems</TextLinkList.Item>
          <TextLinkList.Item>Collaboration features</TextLinkList.Item>
          <TextLinkList.Item>Design process</TextLinkList.Item>
          <TextLinkList.Item>FigJam</TextLinkList.Item>
        </TextLinkList>
        <TextLinkList title="Resources">
          <TextLinkList.Item>Blog</TextLinkList.Item>
          <TextLinkList.Item>Best practices</TextLinkList.Item>
          <TextLinkList.Item>Colors</TextLinkList.Item>
          <TextLinkList.Item>Color wheel</TextLinkList.Item>
          <TextLinkList.Item>Support</TextLinkList.Item>
          <TextLinkList.Item>Developers</TextLinkList.Item>
          <TextLinkList.Item>Resource library</TextLinkList.Item>
        </TextLinkList>
      </Footer>
    </div>
  );
}
