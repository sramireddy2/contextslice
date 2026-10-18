import { Footer, Header, HeaderAuth, Hero, Form, InputField } from "compositions";

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
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
        <Form singleLine onSubmit={() => {}}>
          <InputField value="you@example.com" label="Email address" />
        </Form>
      </Hero>
      <Footer>
        <Slot name="Title">
          <Frame>
            <Vector />
            <Frame>
              <Frame>
                <Vector />
              </Frame>
              <Frame>
                <Vector />
              </Frame>
              <Frame>
                <Vector />
              </Frame>
              <Frame>
                <Vector />
              </Frame>
            </Frame>
          </Frame>
        </Slot>
        <Slot name="Slot">
          <TextLinkList density="default">
            <Slot />
          </TextLinkList>
          <TextLinkList density="default">
            <Slot />
          </TextLinkList>
          <TextLinkList density="default">
            <Slot />
          </TextLinkList>
        </Slot>
      </Footer>
    </div>
  );
}
