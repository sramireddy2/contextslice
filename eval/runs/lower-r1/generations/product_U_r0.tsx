import { Footer, Header, HeaderAuth, ReviewCard } from "compositions";
import { IconChevronDown, IconHeart, IconStar, IconX } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Avatar, AvatarBlock, Form, IconButton, Image, Navigation, NavigationPill, Tag, Text, TextContentHeading, TextHeading, TextLink, TextLinkList, TextListItem, TextPrice, TextStrong } from "primitives";

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
          <FrameBody col gap="1200" w="fill" h="hug">
            <FrameTitle col gap="1200" w="fill" h="hug">
              <TextHeading>Text Heading</TextHeading>
              <FramePrice col gap="1200" align="center/min" w="fill" h="hug">
                <Tag variant="secondary" scheme="positive">Tag</Tag>
                <TextPrice label="/ mo" currency="$" price="50" />
              </FramePrice>
            </FrameTitle>
            <Text>Text</Text>
          </FrameBody>
          <FrameFields row gap="1200" align="min/center" w="fill" h="hug">
            <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Label">
              <IconChevronDown />
            </SelectField>
            <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Label">
              <IconChevronDown />
            </SelectField>
          </FrameFields>
          <InstanceButton variant="primary">
            <IconHeart />
            <Text>Button</Text>
          </InstanceButton>
          <Accordion>
            <AccordionItem title="Title">Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.</AccordionItem>
          </Accordion>
        </Column>
      </PatternPageProduct>
      <PatternCardGridReviews gap="1200" padding="1200">
        <TextHeading>Latest reviews</TextHeading>
        <ReviewCard>
          <TextHeading>Review title</TextHeading>
          <Text>Review body</Text>
          <AvatarBlock title="Reviewer name" description="Date">
            <Avatar size="large" src={placeholder} />
          </AvatarBlock>
        </ReviewCard>
        <ReviewCard>
          <TextHeading>Review title</TextHeading>
          <Text>Review body</Text>
          <AvatarBlock title="Reviewer name" description="Date">
            <Avatar size="large" src={placeholder} />
          </AvatarBlock>
        </ReviewCard>
        <ReviewCard>
          <TextHeading>Review title</TextHeading>
          <Text>Review body</Text>
          <AvatarBlock title="Reviewer name" description="Date">
            <Avatar size="large" src={placeholder} />
          </AvatarBlock>
        </ReviewCard>
      </PatternCardGridReviews>
      <Footer>
        <SlotTitle>
          <FrameFigma row align="center/center" w="hug" h="hug">
            <VectorIcon w="23.33" h="35" stroke="var(--sds-color-icon-default-default)" stroke-w="3.5" />
          </FrameFigma>
          <FrameButtonList row gap="1200" align="min/center" w="hug" h="hug">
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
            <Slot>
              <TextListItem>UI design</TextListItem>
              <TextListItem>UX design</TextListItem>
              <TextListItem>Wireframing</TextListItem>
              <TextListItem>Diagramming</TextListItem>
              <TextListItem>Brainstorming</TextListItem>
              <TextListItem>Online whiteboard</TextListItem>
              <TextListItem>Team collaboration</TextListItem>
            </Slot>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <Slot>
              <TextListItem>Design</TextListItem>
              <TextListItem>Prototyping</TextListItem>
              <TextListItem>Development features</TextListItem>
              <TextListItem>Design systems</TextListItem>
              <TextListItem>Collaboration features</TextListItem>
              <TextListItem>Design process</TextListItem>
              <TextListItem>FigJam</TextListItem>
            </Slot>
          </TextLinkList>
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <Slot>
              <TextListItem>Blog</TextListItem>
              <TextListItem>Best practices</TextListItem>
              <TextListItem>Colors</TextListItem>
              <TextListItem>Color wheel</TextListItem>
              <TextListItem>Support</TextListItem>
              <TextListItem>Developers</TextListItem>
              <TextListItem>Resource library</TextListItem>
            </Slot>
          </TextLinkList>
        </Slot>
      </Footer>
    </div>
  );
}
