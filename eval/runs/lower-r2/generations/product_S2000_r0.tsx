import { Footer, Header, HeaderAuth, ReviewCard } from "compositions";
import { IconHeart } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Avatar, AvatarBlock, Form, IconButton, Image, Input, InputField, Navigation, NavigationPill, Tag, Text, TextContentHeading, TextHeading, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header>
        <Navigation direction="row">
          <NavigationPill isSelected>Products</NavigationPill>
          <NavigationPill>Solutions</NavigationPill>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill>Pricing</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </Navigation>
        <HeaderAuth />
      </Header>
      <PatternPageProduct padding="1600" gap="1200">
        <SlotColumn>
          <FrameBody col gap="16">
            <FrameTitle col gap="16">
              <TextHeading>Product Name</TextHeading>
              <FramePrice>
                <Tag variant="secondary" scheme="positive">$19.99</Tag>
              </FramePrice>
            </FrameTitle>
            <Text>Product description goes here...</Text>
            <FrameFields row gap="24" align="min/center">
              <Image src={placeholder} alt="Product Image" />
              <Form singleLine onSubmit={() => {}}>
                <InputField value="you@example.com" label="Email address" />
              </Form>
            </FrameFields>
            <Accordion>
              <AccordionItem title="What is the product used for?">
                The product is used for creating beautiful and functional user interfaces.
              </AccordionItem>
            </Accordion>
          </FrameBody>
          <IconButton variant="primary">
            <IconHeart size="large" />
          </IconButton>
        </SlotColumn>
      </PatternPageProduct>
      <PatternCardGridReviews gap="1200" padding="1200">
        <TextHeading>Latest reviews</TextHeading>
        <ReviewCard stars={5} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
        <ReviewCard stars={4} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
        <ReviewCard stars={3} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
      </PatternCardGridReviews>
      <Footer>
        <SlotTitle>
          <FrameFigma row align="center/center" w="hug" h="hug">
            <VectorIcon w="23.33" h="35" stroke="var(--sds-color-icon-default-default)" stroke-w="3.5" />
          </FrameFigma>
          <FrameButtonList row gap="16" align="min/center" w="hug" h="hug">
            <FrameXLogo w="23.98" h="24">
              <VectorIcon w="23.98" h="24" fill="var(--sds-color-icon-default-default)" />
            </FrameXLogo>
            <FrameLogoInstagram w="24" h="24" clip>
              <VectorIcon w="24" h="24" fill="var(--sds-color-icon-default-default)" />
            </FrameLogoInstagram>
            <FrameLogoYouTube w="24" h="24" clip>
              <VectorIcon w="24" h="18" fill="var(--sds-color-icon-default-default)" />
            </FrameLogoYouTube>
            <FrameLinkedIn w="24" h="24" clip>
              <VectorIcon w="24" h="24" fill="var(--sds-color-icon-default-default)" />
            </FrameLinkedIn>
          </FrameButtonList>
        </SlotTitle>
        <SlotSlot>
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <TextListItem>UI design</TextListItem>
            <TextListItem>UX design</TextListItem>
            <TextListItem>Wireframing</TextListItem>
            <TextListItem>Diagramming</TextListItem>
            <TextListItem>Brainstorming</TextListItem>
            <TextListItem>Online whiteboard</TextListItem>
            <TextListItem>Team collaboration</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <TextListItem>Design</TextListItem>
            <TextListItem>Prototyping</TextListItem>
            <TextListItem>Development features</TextListItem>
            <TextListItem>Design systems</TextListItem>
            <TextListItem>Collaboration features</TextListItem>
            <TextListItem>Design process</TextListItem>
            <TextListItem>FigJam</TextListItem>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <TextListItem>Blog</TextListItem>
            <TextListItem>Best practices</TextListItem>
            <TextListItem>Colors</TextListItem>
            <TextListItem>Color wheel</TextListItem>
            <TextListItem>Support</TextListItem>
            <TextListItem>Developers</TextListItem>
            <TextListItem>Resource library</TextListItem>
          </TextLinkList>
        </SlotSlot>
      </Footer>
    </div>
  );
}
