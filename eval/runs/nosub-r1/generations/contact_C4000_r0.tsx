import { Button, FormContact, InputField, TextContentTitle, TextLinkList, TextLinkListItem, TextStrong } from "compositions";
import { IconStar, IconX } from "icons";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-800)", padding: "var(--sds-size-space-4000) var(--sds-size-space-600) var(--sds-size-space-4000) var(--sds-size-space-600)", backgroundColor: "var(--sds-color-background-default-secondary)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-200)", padding: "var(--sds-size-space-600)", backgroundColor: "var(--sds-color-background-default-default)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-200)" }}>
          <TextContentTitle title="Contact Us" subtitle="Get in touch with us" />
          <FormContact>
            <InputField label="Name" placeholder="Your name" />
            <InputField label="Surname" placeholder="Your surname" />
            <InputField label="Email" placeholder="Your email" />
            <InputField label="Message" placeholder="Your message" type="textarea" />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--sds-size-space-400)" }}>
              <Button variant="primary" size="medium" label="Submit" />
            </div>
          </FormContact>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "var(--sds-size-space-400)", padding: "var(--sds-size-space-800) var(--sds-size-space-800) var(--sds-size-space-4000) var(--sds-size-space-800)", backgroundColor: "var(--sds-color-background-default-default)", border: "1px solid var(--sds-color-border-default-default)", borderRadius: "var(--sds-size-radius-200)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-600)" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "23.33px", height: "35px", stroke: "var(--sds-color-icon-default-default)", strokeWidth: "3.5px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "var(--sds-size-space-400)" }}>
            <TextLinkList density="default" hasTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-400)" }}>
                <TextStrong>Use cases</TextStrong>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-12)" }}>
                  <TextLinkListItem>Item 1</TextLinkListItem>
                  <TextLinkListItem>Item 2</TextLinkListItem>
                  <TextLinkListItem>Item 3</TextLinkListItem>
                  <TextLinkListItem>Item 4</TextLinkListItem>
                  <TextLinkListItem>Item 5</TextLinkListItem>
                  <TextLinkListItem>Item 6</TextLinkListItem>
                  <TextLinkListItem>Item 7</TextLinkListItem>
                </div>
              </div>
            </TextLinkList>
            <TextLinkList density="default" hasTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-400)" }}>
                <TextStrong>Explore</TextStrong>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-12)" }}>
                  <TextLinkListItem>Design</TextLinkListItem>
                  <TextLinkListItem>Design systems</TextLinkListItem>
                  <TextLinkListItem>Blog</TextLinkListItem>
                  <TextLinkListItem>Best practices</TextLinkListItem>
                  <TextLinkListItem>Colors</TextLinkListItem>
                  <TextLinkListItem>Support</TextLinkListItem>
                  <TextLinkListItem>Developers</TextLinkListItem>
                </div>
              </div>
            </TextLinkList>
            <TextLinkList density="default" hasTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-400)" }}>
                <TextStrong>Resources</TextStrong>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-12)" }}>
                  <TextLinkListItem>Blog</TextLinkListItem>
                  <TextLinkListItem>Best practices</TextLinkListItem>
                  <TextLinkListItem>Colors</TextLinkListItem>
                  <TextLinkListItem>Support</TextLinkListItem>
                  <TextLinkListItem>Developers</TextLinkListItem>
                </div>
              </div>
            </TextLinkList>
          </div>
        </div>
      </div>
    </div>
  );
}
