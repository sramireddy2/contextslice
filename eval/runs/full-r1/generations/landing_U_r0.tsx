import { Footer } from "compositions";
import { Hero, Panel, CardGridIcon } from "compositions";
import { Header, HeaderAuth } from "compositions";
import { IconStar, IconX } from "icons";
import { Button } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header />
      <HeaderAuth />
      <Hero variant="image" src="placeholder">
        <TextContentTitle hasSubtitle subtitle="Subtitle" title="Title" align="center" />
        <ButtonGroup align="center">
          <Button
            iconStart={<IconStar />}
            label="Button"
            variant="primary"
            size="medium"
          />
        </ButtonGroup>
      </Hero>
      <Panel>
        {/* Panel content goes here */}
      </Panel>
      <CardGridIcon>
        <TextContentHeading hasSubheading subheading="Subheading" heading="Heading" align="start" />
        <Card
          icon="info"
          asset={true}
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          heading="Title"
          button={false}
          assetType="icon"
          variant="default"
          direction="horizontal"
        >
          <div>
            <Text style="heading">Title</Text>
            <Text style="body-base">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
          </div>
        </Card>
        <Card
          icon="info"
          asset={true}
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          heading="Title"
          button={false}
          assetType="icon"
          variant="default"
          direction="horizontal"
        >
          <div>
            <Text style="heading">Title</Text>
            <Text style="body-base">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
          </div>
        </Card>
        <Card
          icon="info"
          asset={true}
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
          heading="Title"
          button={false}
          assetType="icon"
          variant="default"
          direction="horizontal"
        >
          <div>
            <Text style="heading">Title</Text>
            <Text style="body-base">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
          </div>
        </Card>
      </CardGridIcon>
      <Footer />
    </div>
  );
}
