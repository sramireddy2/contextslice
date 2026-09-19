import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Header, HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { CardGridContentList, CardGridImage } from "compositions";
import { TextContentHeading } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header platform="Desktop" state="Default">
        <Navigation direction="Row">
          <NavigationPill label="Products" state="Active" />
          <NavigationPill label="Solutions" state="Default" />
          <NavigationPill label="Community" state="Default" />
          <NavigationPill label="Resources" state="Default" />
          <NavigationPill label="Pricing" state="Default" />
          <NavigationPill label="Contact" state="Default" />
        </Navigation>
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop">
        <TextContentTitle hasSubtitle={true} subtitle="Subtitle" title="Title" align="Center" />
      </Hero>
      <Panel platform="Desktop" />
      <CardGridContentList platform="Desktop">
        <TextContentHeading hasSubheading={true} subheading="Subheading" heading="Heading" align="Start" />
        <Card
          icon="Info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          asset={true}
          heading="Title"
          button={true}
          assetType="Image"
          variant="Stroke"
          direction="Horizontal"
        />
        <Card
          icon="Info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          asset={true}
          heading="Title"
          button={true}
          assetType="Image"
          variant="Stroke"
          direction="Horizontal"
        />
        <Card
          icon="Info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          asset={true}
          heading="Title"
          button={true}
          assetType="Image"
          variant="Stroke"
          direction="Horizontal"
        />
      </CardGridContentList>
      <CardGridImage platform="Desktop">
        <TextContentHeading hasSubheading={true} subheading="Subheading" heading="Heading" align="Start" />
        <Card
          icon="Info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          asset={true}
          heading="Title"
          button={false}
          assetType="Image"
          variant="Stroke"
          direction="Horizontal"
        />
        <Card
          icon="Info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          asset={true}
          heading="Title"
          button={false}
          assetType="Image"
          variant="Stroke"
          direction="Horizontal"
        />
        <Card
          icon="Info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          asset={true}
          heading="Title"
          button={false}
          assetType="Image"
          variant="Stroke"
          direction="Horizontal"
        />
      </CardGridImage>
      <Footer platform="Desktop">
        <TextLinkList hasTitle={true} density="Default">
          <TextStrong text="Use cases" />
        </TextLinkList>
        <TextLinkList hasTitle={true} density="Default">
          <TextStrong text="Explore" />
          <TextListItem text="Design" />
        </TextLinkList>
        <TextLinkList hasTitle={true} density="Default">
          <TextStrong text="Resources" />
          <TextListItem text="Blog" />
        </TextLinkList>
      </Footer>
    </div>
  );
}
