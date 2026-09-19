import React from "react";
import { Footer, FormBox, Header, Hero, InputField, TextareaField, Button } from "compositions";
import { IconStar, IconX } from "icons";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Contact Us" subtitle="Get in touch with us" />
      </Hero>
      <FormBox onSubmit={() => {}}>
        <InputField
          label="Name"
          placeholder="Your name"
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <InputField
          label="Surname"
          placeholder="Your surname"
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <InputField
          label="Email"
          placeholder="Your email"
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <TextareaField
          label="Message"
          placeholder="Your message"
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <ButtonGroup align="justify">
          <Button
            label="Submit"
            variant="primary"
            size="medium"
            iconEnd={<IconStar />}
            state="default"
          />
        </ButtonGroup>
      </FormBox>
      <Footer />
    </div>
  );
}
