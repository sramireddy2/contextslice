import { Footer } from "compositions";
import { Hero } from "compositions";
import { Panel } from "compositions";
import { CardGridIcon } from "compositions";
import { Header } from "compositions";
import { IconStar, IconX } from "icons";
import { Button } from "primitives";
import { TextContentHeading, TextContentTitle, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header />
      <Hero variant="image" src="placeholder">
        <TextContentTitle Title="Title" Subtitle="Subtitle" Align="center" />
        <ButtonGroup Align="center">
          <Button Label="Button" Variant="primary" IconStart={<IconStar />} />
          <Button Label="Button" Variant="primary" IconEnd={<IconX />} />
        </ButtonGroup>
      </Hero>
      <Panel>
        {/* Add content for the panel here */}
      </Panel>
      <CardGridIcon>
        <TextContentHeading Heading="Heading" Subheading="Subheading" Align="start" />
        <Card Icon="info" Asset={true} Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Heading="Title" Button={false} AssetType="icon" Variant="default" Direction="horizontal" />
        <Card Icon="info" Asset={true} Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Heading="Title" Button={false} AssetType="icon" Variant="default" Direction="horizontal" />
        <Card Icon="info" Asset={true} Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Heading="Title" Button={false} AssetType="icon" Variant="default" Direction="horizontal" />
      </CardGridIcon>
      <Footer />
    </div>
  );
}
