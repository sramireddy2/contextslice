import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { Form, InputField, Navigation, NavigationPill, TextContentTitle } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header>
        <Navigation direction="row">
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Waitlist" subtitle="Join our waitlist to be notified when we launch." />
        <Form singleLine onSubmit={() => {}}>
          <InputField
            value="you@example.com"
            label="Email address"
            placeholder="Enter your email"
          />
        </Form>
      </Hero>
      <Footer />
    </div>
  );
}
