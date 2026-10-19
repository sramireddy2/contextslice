import { Box, Button, Form, Input, Text, TextLinkList, TextLinkListItem, TextStrong, TextLinkListDensity } from "primitives";
import { NavigationPill, NavigationPillState } from "compositions";
import { Header, HeaderAuth, HeroNewsletter, Footer } from "layout";
import { IconX, IconStar } from "icons";
import { useState } from "react";

export default function Screen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    // Simulate form submission
    setError(null);
    alert(`Thank you for signing up with ${email}!`);
  };

  return (
    <Box>
      <Header>
        <NavigationPillList>
          <NavigationPill state={NavigationPillState.Active} label="Products" />
          <NavigationPill state={NavigationPillState.Default} label="Solutions" />
          <NavigationPill state={NavigationPillState.Default} label="Community" />
          <NavigationPill state={NavigationPillState.Default} label="Resources" />
          <NavigationPill state={NavigationPillState.Default} label="Pricing" />
          <NavigationPill state={NavigationPillState.Default} label="Contact" />
        </NavigationPillList>
        <HeaderAuth>
          <Button variant="neutral" size="small" label="Sign in" />
          <Button variant="primary" size="small" label="Register" />
        </HeaderAuth>
      </Header>
      <HeroNewsletter>
        <TextContentTitle title="Join our waitlist" subtitle="Be the first to know about new features and updates." />
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={error}
            hasError={!!error}
          />
          <Button variant="primary" size="medium" label="Submit" />
        </Form>
      </HeroNewsletter>
      <Footer>
        <Box>
          <Box>
            <Box>
              <Box>
                <TextStrong>Use cases</TextStrong>
                <TextLinkList density={TextLinkListDensity.Default}>
                  <TextLinkListItem>UI design</TextLinkListItem>
                  <TextLinkListItem>UX design</TextLinkListItem>
                  <TextLinkListItem>Wireframing</TextLinkListItem>
                  <TextLinkListItem>Diagramming</TextLinkListItem>
                  <TextLinkListItem>Brainstorming</TextLinkListItem>
                  <TextLinkListItem>Online whiteboard</TextLinkListItem>
                  <TextLinkListItem>Team collaboration</TextLinkListItem>
                </TextLinkList>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box>
              <Box>
                <TextStrong>Explore</TextStrong>
                <TextLinkList density={TextLinkListDensity.Default}>
                  <TextLinkListItem>Design</TextLinkListItem>
                  <TextLinkListItem>Prototyping</TextLinkListItem>
                  <TextLinkListItem>Development features</TextLinkListItem>
                  <TextLinkListItem>Design systems</TextLinkListItem>
                  <TextLinkListItem>Collaboration features</TextLinkListItem>
                  <TextLinkListItem>Design process</TextLinkListItem>
                  <TextLinkListItem>FigJam</TextLinkListItem>
                </TextLinkList>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box>
              <Box>
                <TextStrong>Resources</TextStrong>
                <TextLinkList density={TextLinkListDensity.Default}>
                  <TextLinkListItem>Blog</TextLinkListItem>
                  <TextLinkListItem>Best practices</TextLinkListItem>
                  <TextLinkListItem>Colors</TextLinkListItem>
                  <TextLinkListItem>Color wheel</TextLinkListItem>
                  <TextLinkListItem>Support</TextLinkListItem>
                  <TextLinkListItem>Developers</TextLinkListItem>
                  <TextLinkListItem>Resource library</TextLinkListItem>
                </TextLinkList>
              </Box>
            </Box>
          </Box>
        </Box>
      </Footer>
    </Box>
  );
}
