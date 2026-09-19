import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Header, HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { TestimonialCard } from "compositions";
import { placeholder } from "images";
import { Button } from "primitives";
import { ButtonGroup } from "primitives";
import { NavigationPill } from "primitives";
import { Navigation } from "primitives";
import { TextContentHeading } from "primitives";
import { TextContentTitle } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <HeaderAuth />
      <Hero variant="subtle">
        <TextContentTitle
          title="Title"
          subtitle="Subtitle"
          align="center"
        />
        <ButtonGroup align="justify">
          <Button
            label="Button"
            variant="primary"
            size="medium"
            iconEnd={<IconStar />}
          />
        </ButtonGroup>
      </Hero>
      <Section padding="var(--sds-size-space-400)">
        <TextContentHeading
          heading="Heading"
          subheading="Subheading"
          align="start"
        />
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <FlexItem>
            <Flex wrap type="third" gap="var(--sds-size-space-400)">
              <TestimonialCard
                heading="“Quote”"
                src={placeholder}
                name="John Doe"
                username="johndoe"
              />
              <TestimonialCard
                heading="“Quote”"
                src={placeholder}
                name="Jane Smith"
                username="janesmith"
              />
              <TestimonialCard
                heading="“Quote”"
                src={placeholder}
                name="Alice Johnson"
                username="alicej"
              />
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Footer />
    </div>
  );
}
