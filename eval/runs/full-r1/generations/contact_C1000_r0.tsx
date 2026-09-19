import { Footer } from "compositions";
import { FormBox } from "compositions";
import { Header } from "compositions";
import { HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { IconStar } from "icons";
import { IconX } from "icons";
import { InputField } from "primitives";
import { TextareaField } from "primitives";
import { Button } from "primitives";
import { ButtonGroup } from "primitives";
import { TextContentTitle } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-400)" }}>
      <Header platform="Desktop" state="Default">
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop">
        <TextContentTitle align="Center" title="Title" subtitle="Subtitle" />
      </Hero>
      <FormBox onSubmit={() => {}}>
        <InputField
          value="Value"
          description="Description"
          hasLabel={true}
          label="Name"
          state="Default"
          valueType="Placeholder"
        />
        <InputField
          value="Value"
          description="Description"
          hasLabel={true}
          label="Surname"
          state="Default"
          valueType="Placeholder"
        />
        <InputField
          value="Value"
          description="Description"
          hasLabel={true}
          label="Email"
          state="Default"
          valueType="Placeholder"
        />
        <TextareaField
          value="Value"
          hasDescription={false}
          label="Message"
          error="Hint"
          hasError={false}
          description="Description"
          hasLabel={true}
          state="Default"
          valueType="Placeholder"
        />
        <ButtonGroup align="Justify">
          <Button
            iconEnd={<IconX />}
            hasIconStart={false}
            hasIconEnd={false}
            iconStart={<IconStar />}
            label="Submit"
            variant="Primary"
            state="Default"
            size="Medium"
          />
        </ButtonGroup>
      </FormBox>
      <Footer platform="Desktop">
        <div slot="Title">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>Icon</div>
          </div>
        </div>
        <div slot="Slot">
          {/* Additional content can be added here */}
        </div>
      </Footer>
    </div>
  );
}
