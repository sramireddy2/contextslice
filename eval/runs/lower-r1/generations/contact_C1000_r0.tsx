import { Footer, FormBox, Header, HeaderAuth, Hero, InputField, TextareaField, Button, ButtonGroup, Navigation, TextContentTitle, TextLinkList } from "compositions";
import { Button as ButtonPrimitive, ButtonGroup as ButtonGroupPrimitive, Navigation as NavigationPrimitive, TextContentTitle as TextContentTitlePrimitive, TextLinkList as TextLinkListPrimitive } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header>
        <Navigation direction="row">
          {/* Slot "Slot" (+6 elided) */}
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
        <TextLinkList density="default">
          {/* Slot "Slot" (+1 elided) */}
        </TextLinkList>
        <TextLinkList density="default">
          {/* Slot "Slot" (+1 elided) */}
        </TextLinkList>
        <TextLinkList density="default">
          {/* Slot "Slot" (+1 elided) */}
        </TextLinkList>
      </Footer>
    </div>
  );
}
