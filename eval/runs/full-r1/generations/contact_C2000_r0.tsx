import React from "react";
import { Footer } from "compositions";
import { FormBox } from "compositions";
import { Header } from "compositions";
import { Hero } from "compositions";
import { InputField } from "primitives";
import { TextareaField } from "primitives";
import { Button } from "primitives";

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
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <InputField
          label="Surname"
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <InputField
          label="Email"
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <TextareaField
          label="Message"
          hasLabel
          state="default"
          valueType="placeholder"
        />
        <ButtonGroup align="justify">
          <Button
            label="Submit"
            variant="primary"
            state="default"
            size="medium"
          />
        </ButtonGroup>
      </FormBox>
      <Footer />
    </div>
  );
}
