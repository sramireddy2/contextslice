import { Footer, FormBox, Header, HeaderAuth, Hero } from "compositions";
import { Button, ButtonGroup, InputField, TextContentTitle, TextareaField } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <HeaderAuth />
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
      <Footer />
    </div>
  );
}
