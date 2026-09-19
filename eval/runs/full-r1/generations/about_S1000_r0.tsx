import { Footer } from "compositions";
import { Header, HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { CardGridContentList, CardGridImage } from "layout";
import { TextContentHeading, TextContentTitle } from "primitives";
import { TextLinkList } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header platform="Desktop" state="Default">
        <Navigation direction="Row">
          <NavigationPill label="Products" state="Active" />
          <NavigationPill label="Community" state="Default" />
        </Navigation>
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop">
        <TextContentTitle hasSubtitle subtitle="Subtitle" title="Title" align="Center" />
      </Hero>
      <Panel platform="Desktop" />
      <CardGridContentList platform="Desktop">
        <TextContentHeading hasSubheading subheading="Subheading" heading="Heading" align="Start" />
        {/* Add your card content here */}
      </CardGridContentList>
      <CardGridImage platform="Desktop">
        <TextContentHeading hasSubheading subheading="Subheading" heading="Heading" align="Start" />
        {/* Add your card content here */}
      </CardGridImage>
      <Footer platform="Desktop">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Vector icon="Icon" />
          <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
            <Frame>
              <Vector icon="X Logo" />
            </Frame>
            <Frame>
              <Vector icon="Logo Instagram" />
            </Frame>
            <Frame>
              <Vector icon="Logo YouTube" />
            </Frame>
            <Frame>
              <Vector icon="LinkedIn" />
            </Frame>
          </div>
        </div>
        <TextLinkList hasTitle title="Use cases" density="Default">
          {/* Add your links here */}
        </TextLinkList>
        <TextLinkList hasTitle title="Explore" density="Default">
          {/* Add your links here */}
        </TextLinkList>
        <TextLinkList hasTitle title="Resources" density="Default">
          {/* Add your links here */}
        </TextLinkList>
      </Footer>
    </div>
  );
}
