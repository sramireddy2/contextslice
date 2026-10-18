import { Footer, FormBox, Header, HeaderAuth, Hero } from "compositions";
import { Button, ButtonGroup, Navigation, NavigationPill, TextContentTitle, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ gap: "var(--sds-size-space-400)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
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
        <TextContentTitle align="center" title="Contact Us" subtitle="Get in touch with us" />
      </Hero>
      <FormBox onSubmit={() => {}}>
        <InputField placeholder="Value" label="Name" />
        <InputField placeholder="Value" label="Surname" />
        <InputField placeholder="Value" label="Email" />
        <TextareaField placeholder="Value" label="Message" />
        <ButtonGroup align="justify">
          <Button variant="primary">Submit</Button>
        </ButtonGroup>
      </FormBox>
      <Footer>
        <Slot name="Title">
          <Frame style={{ display: "flex", alignItems: "center" }}>
            <Vector name="Icon" />
          </Frame>
        </Slot>
        <Slot name="Slot">
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <Slot name="Slot" />
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <Slot name="Slot" />
            <TextListItem>Design</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <Slot name="Slot" />
            <TextListItem>Blog</TextListItem>
          </TextLinkList>
        </Slot>
      </Footer>
    </div>
  );
}
