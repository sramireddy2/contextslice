import { Footer, Header, HeaderAuth, Hero } from "compositions";
import { Form, InputField, Navigation, NavigationPill, TextContentTitle } from "primitives";

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sds-size-space-400)" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "23.33px", height: "35px", stroke: "var(--sds-color-icon-default-default)", strokeWidth: "3.5px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.98px", height: "24px" }} />
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 24px 0)" }}>
              <div style={{ width: "24px", height: "24px", fill: "var(--sds-color-icon-default-default)" }} />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 18px 0)" }}>
              <div style={{ width: "24px", height: "18px", fill: "var(--sds-color-icon-default-default)" }} />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24px 24px 0)" }}>
              <div style={{ width: "24px", height: "24px", fill: "var(--sds-color-icon-default-default)" }} />
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
}
