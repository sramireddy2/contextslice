import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { Form, Input, InputField, TextContentTitle, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <HeaderAuth />
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Join our waitlist" subtitle="Be one of the first to experience our platform" />
        <Form singleLine onSubmit={() => {}}>
          <InputField value="you@example.com" label="Email address" />
        </Form>
      </Hero>
      <Footer />
    </div>
  );
}
