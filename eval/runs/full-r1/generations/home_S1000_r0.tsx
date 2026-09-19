import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { TestimonialCard } from "compositions";
import { placeholder } from "images";
import { Header, HeaderAuth, Hero } from "compositions";
import { AvatarBlock, ButtonGroup, Navigation, TextContentHeading, TextContentTitle, TextHeading, TextLinkList, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ backgroundColor: "var(--sds-color-background-default-default)" }}>
      <Header platform="Desktop" state="Default">
        <Navigation direction="Row">
          <TextLinkList title="Link 1" density="Default">Link 1</TextLinkList>
          <TextLinkList title="Link 2" density="Default">Link 2</TextLinkList>
          <TextLinkList title="Link 3" density="Default">Link 3</TextLinkList>
          <TextLinkList title="Link 4" density="Default">Link 4</TextLinkList>
          <TextLinkList title="Link 5" density="Default">Link 5</TextLinkList>
          <TextLinkList title="Link 6" density="Default">Link 6</TextLinkList>
          <TextLinkList title="Link 7" density="Default">Link 7</TextLinkList>
        </Navigation>
        <HeaderAuth state="Logged Out" />
      </Header>
      <Hero platform="Desktop">
        <TextContentTitle hasSubtitle subtitle="Subtitle" title="Title" align="Center" />
        <ButtonGroup align="Justify">
          {/* Button Group content */}
        </ButtonGroup>
      </Hero>
      <Section style={{ backgroundColor: "var(--sds-color-slate-200)" }}>
        <CardGridTestimonials platform="Desktop">
          <TextContentHeading hasSubheading subheading="Subheading" heading="Heading" align="Start" />
          <Flex gap="var(--sds-size-space-400)">
            <TestimonialCard heading="“Quote”" src={placeholder} name="Title" username="Description" />
            <TestimonialCard heading="“Quote”" src={placeholder} name="Title" username="Description" />
            <TestimonialCard heading="“Quote”" src={placeholder} name="Title" username="Description" />
            <TestimonialCard heading="“Quote”" src={placeholder} name="Title" username="Description" />
            <TestimonialCard heading="“Quote”" src={placeholder} name="Title" username="Description" />
            <TestimonialCard heading="“Quote”" src={placeholder} name="Title" username="Description" />
          </Flex>
        </CardGridTestimonials>
      </Section>
      <Footer platform="Desktop">
        <Flex align="center" justify="center">
          <Vector icon="Icon" />
        </Flex>
        <Flex>
          <Frame logo="X Logo" />
          <Frame logo="Logo Instagram" />
          <Frame logo="Logo YouTube" />
          <Frame logo="LinkedIn" />
        </Flex>
        <TextLinkList title="Use cases" density="Default">
          {/* Text Link List content */}
        </TextLinkList>
        <TextLinkList title="Explore" density="Default">
          {/* Text Link List content */}
        </TextLinkList>
        <TextLinkList title="Resources" density="Default">
          {/* Text Link List content */}
        </TextLinkList>
      </Footer>
    </div>
  );
}
