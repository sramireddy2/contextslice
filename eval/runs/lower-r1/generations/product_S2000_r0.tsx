import { Footer, Header, HeaderAuth, ReviewCard } from "compositions";
import { IconChevronDown, IconHeart } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Avatar, AvatarBlock, Form, IconButton, Image, Navigation, NavigationPill, Tag, Text, TextContentHeading, TextHeading, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

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
        <Column>
          <FrameBody col gap="var(--sds-size-space-400)" w="fill" h="hug">
            <FrameTitle col gap="var(--sds-size-space-400)" w="fill" h="hug">
              <TextHeading>Product Name</TextHeading>
              <FramePrice>
                <Tag variant="secondary" scheme="positive">In Stock</Tag>
              </FramePrice>
            </FrameTitle>
            <Text>Product Description</Text>
          </FrameBody>
          <FrameFields row gap="var(--sds-size-space-600)" align="min/center" w="fill" h="hug">
            <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Label">
              <IconChevronDown />
            </SelectField>
            <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Label">
              <IconChevronDown />
            </SelectField>
          </FrameFields>
          <InstanceButton>
            <Text>Button</Text>
          </InstanceButton>
          <Accordion>
            <AccordionItem title="Frequently Asked Question">
              Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.
            </AccordionItem>
          </Accordion>
          <IconButton variant="primary">
            <IconHeart />
          </IconButton>
        </Column>
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
          <FrameButtonList row gap="var(--sds-size-space-400)" align="min/center" w="hug" h="hug">
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
        <Slot>
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
        </Slot>
      </Footer>
    </div>
  );
}
