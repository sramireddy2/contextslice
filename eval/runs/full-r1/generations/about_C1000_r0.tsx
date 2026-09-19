import { Footer } from "compositions";
import { CardGridContentList, CardGridImage, Header, Hero, TextContentHeading } from "compositions";
import { Section } from "layout";
import { Image } from "primitives";

export default function Screen() {
  return (
    <Section>
      <Header />
      <Hero variant="subtle">
        <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
      </Hero>
      <Panel />
      <CardGridContentList>
        <TextContentHeading heading="Heading" subheading="Subheading" align="start" />
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={true}
          assetType="image"
          variant="stroke"
          direction="horizontal"
        />
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={true}
          assetType="image"
          variant="stroke"
          direction="horizontal"
        />
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={true}
          assetType="image"
          variant="stroke"
          direction="horizontal"
        />
      </CardGridContentList>
      <CardGridImage>
        <TextContentHeading heading="Heading" subheading="Subheading" align="start" />
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={false}
          assetType="image"
          variant="stroke"
          direction="horizontal"
        />
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={false}
          assetType="image"
          variant="stroke"
          direction="horizontal"
        />
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={false}
          assetType="image"
          variant="stroke"
          direction="horizontal"
        />
      </CardGridImage>
      <Footer />
    </Section>
  );
}
