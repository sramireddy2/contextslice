import { Footer, Header, HeaderAuth, Hero, Form, InputField } from "compositions";
import { TextContentTitle } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header>
        <Navigation direction="row">
          <NavigationPill isSelected>Products</NavigationPill>
          <NavigationPill>Solutions</NavigationPill>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill>Pricing</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Join our waitlist" subtitle="Be the first to know about new features and updates." />
        <Form singleLine onSubmit={() => {}}>
          <InputField value="you@example.com" label="Email address" />
        </Form>
      </Hero>
      <Footer>
        <Slot name="Title">
          <Frame>
            <Vector />
          </Frame>
        </Slot>
        <Slot name="Slot">
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <TextListItem>UI design</TextListItem>
            <TextListItem>UX design</TextListItem>
            <TextListItem>Diagramming</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <TextListItem>Design</TextListItem>
            <TextListItem>Prototyping</TextListItem>
            <TextListItem>Development features</TextListItem>
            <TextListItem>Design systems</TextListItem>
            <TextListItem>Design process</TextListItem>
            <TextListItem>FigJam</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <TextListItem>Blog</TextListItem>
            <TextListItem>Best practices</TextListItem>
            <TextListItem>Colors</TextListItem>
            <TextListItem>Color wheel</TextListItem>
            <TextListItem>Support</TextListItem>
            <TextListItem>Developers</TextListItem>
            <TextListItem>Resource library</TextListItem>
          </TextLinkList>
        </Slot>
      </Footer>
    </div>
  );
}
