import { Footer } from "compositions";
import { Hero } from "compositions";
import { Panel } from "compositions";
import { CardGridIcon } from "compositions";
import { Header } from "compositions";
import { placeholder } from "images";
import { Button } from "primitives";
import { TextContentTitle } from "primitives";
import { TextLinkList } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header />
      <Hero variant="image" src={placeholder}>
        <TextContentTitle
          title="Title"
          subtitle="Subtitle"
          align="center"
        />
        <ButtonGroup align="center">
          <Button
            label="Button"
            variant="primary"
            size="medium"
            iconEnd={<IconStar />}
          />
        </ButtonGroup>
      </Hero>
      <Panel>
        {/* Panel content goes here */}
      </Panel>
      <CardGridIcon>
        <TextContentHeading
          heading="Heading"
          subheading="Subheading"
          align="start"
        />
        {/* CardGridIcon cards go here */}
      </CardGridIcon>
      <Footer />
    </div>
  );
}
