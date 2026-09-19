import { Footer } from "compositions";
import { Form } from "primitives";
import { Header } from "compositions";
import { HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { InputField } from "primitives";
import { Navigation } from "primitives";
import { TextContentTitle } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header platform="Desktop" state="Default">
        <Navigation direction="Row">
          <div>Link 1</div>
          <div>Link 2</div>
          <div>Link 3</div>
          <div>Link 4</div>
          <div>Link 5</div>
          <div>Link 6</div>
          <div>Link 7</div>
        </Navigation>
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop" variant="subtle">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
        <FormBox>
          <InputField
            value="you@example.com"
            description="Description"
            error="Error"
            hasError={false}
            hasDescription={false}
            label="Email address"
            hasLabel={false}
            state="Default"
            valueType="Default"
          />
        </FormBox>
      </Hero>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <svg width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
          </div>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.98", height: "24" }}>
              <svg width="23.98" height="24" />
            </div>
            <div style={{ width: "24", height: "24", clip: "rect(0 24 24 0)" }}>
              <svg width="24" height="24" fill="var(--sds-color-icon-default-default)" />
            </div>
            <div style={{ width: "24", height: "24", clip: "rect(0 24 24 0)" }}>
              <svg width="24" height="18" fill="var(--sds-color-icon-default-default)" />
            </div>
            <div style={{ width: "24", height: "24", clip: "rect(0 24 24 0)" }}>
              <svg width="24" height="24" fill="var(--sds-color-icon-default-default)" />
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
}
