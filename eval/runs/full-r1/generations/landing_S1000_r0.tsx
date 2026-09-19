import { Footer } from "compositions";
import { Header } from "compositions";
import { HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { Panel } from "compositions";
import { CardGridIcon } from "compositions";
import { placeholder } from "images";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header platform="Desktop" state="Default">
        <Navigation direction="Row">
          <NavigationPill label="Products" state="Active" />
          <NavigationPill label="Community" state="Default" />
          <NavigationPill label="Resources" state="Default" />
          <NavigationPill label="Contact" state="Default" />
        </Navigation>
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop" src={placeholder}>
        <TextContentTitle hasSubtitle subtitle="Subtitle" title="Title" align="Center" />
        <ButtonGroup align="Center">
          {/* Add buttons here */}
        </ButtonGroup>
      </Hero>
      <Panel platform="Desktop" />
      <CardGridIcon platform="Desktop">
        <TextContentHeading hasSubheading subheading="Subheading" heading="Heading" align="Start" />
        {/* Add cards here */}
      </CardGridIcon>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <Vector icon="Icon" />
          </div>
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <div style={{ width: "23.98px", height: "24px" }}>
              <Vector icon="Icon" />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24 24 0)" }}>
              <Vector icon="Icon" />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24 24 0)" }}>
              <Vector icon="Icon" />
            </div>
            <div style={{ width: "24px", height: "24px", clip: "rect(0 24 24 0)" }}>
              <Vector icon="Icon" />
            </div>
          </div>
        </div>
        <div>
          <TextLinkList hasTitle density="Default">
            <TextStrong text="Use cases" />
            {/* Add links here */}
          </TextLinkList>
          <TextLinkList hasTitle density="Default">
            <TextStrong text="Explore" />
            {/* Add links here */}
          </TextLinkList>
          <TextLinkList hasTitle density="Default">
            <TextStrong text="Resources" />
            {/* Add links here */}
          </TextLinkList>
        </div>
      </Footer>
    </div>
  );
}
