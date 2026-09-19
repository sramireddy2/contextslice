import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Header, HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { IconStar, IconX } from "icons";
import { Avatar, AvatarBlock } from "primitives";
import { Button, ButtonGroup } from "primitives";
import { NavigationPill, Navigation } from "primitives";
import { TextContentHeading, TextContentTitle, TextHeading, TextLinkList, TextListItem, TextStrong } from "primitives";
import { placeholder } from "images";

export default function Screen() {
  return (
    <div style={{ background: "var(--sds-color-background-default-default)" }}>
      <Header>
        <Navigation direction="row">
          <NavigationPill label="Products" isSelected />
          <NavigationPill label="Solutions" />
          <NavigationPill label="Community" />
          <NavigationPill label="Resources" />
          <NavigationPill label="Pricing" />
          <NavigationPill label="Contact" />
        </Navigation>
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
        <ButtonGroup align="justify">
          <Button
            label="Button"
            variant="primary"
            size="medium"
            iconStart={<IconStar />}
            iconEnd={<IconX />}
          />
        </ButtonGroup>
      </Hero>
      <Section padding="var(--sds-size-space-400)">
        <TextContentHeading heading="Heading" subheading="Subheading" align="start" />
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
              <TestimonialCard
                heading="“Quote”"
                src={placeholder}
                name="Bob Brown"
                username="bobb"
              />
              <TestimonialCard
                heading="“Quote”"
                src={placeholder}
                name="Charlie Davis"
                username="chard"
              />
              <TestimonialCard
                heading="“Quote”"
                src={placeholder}
                name="Diana Evans"
                username="dianaev"
              />
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Footer>
        <TextLinkList title="Use cases" density="default">
          <TextListItem text="UI design" />
          <TextListItem text="UX design" />
          <TextListItem text="Wireframing" />
          <TextListItem text="Diagramming" />
          <TextListItem text="Brainstorming" />
          <TextListItem text="Online whiteboard" />
          <TextListItem text="Team collaboration" />
        </TextLinkList>
        <TextLinkList title="Explore" density="default">
          <TextListItem text="Design" />
          <TextListItem text="Prototyping" />
          <TextListItem text="Development features" />
          <TextListItem text="Design systems" />
          <TextListItem text="Collaboration features" />
          <TextListItem text="Design process" />
          <TextListItem text="FigJam" />
        </TextLinkList>
        <TextLinkList title="Resources" density="default">
          <TextListItem text="Blog" />
          <TextListItem text="Best practices" />
          <TextListItem text="Colors" />
          <TextListItem text="Color wheel" />
          <TextListItem text="Support" />
          <TextListItem text="Developers" />
          <TextListItem text="Resource library" />
        </TextLinkList>
      </Footer>
    </div>
  );
}
