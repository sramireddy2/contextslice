import { Footer, Header, HeaderAuth, ReviewCard } from "compositions";
import { IconChevronDown, IconHeart, IconStar, IconX } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, Avatar, AvatarBlock, Form, IconButton, Image, Input, InputField, Navigation, NavigationPill, Select, SelectField, SelectItem, Tag, Text, TextContentHeading, TextHeading, TextLink, TextLinkList, TextListItem, TextPrice, TextStrong } from "primitives";

export default function Screen() {
  return (
    <Section padding="1600">
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
        <TextHeading>Text Heading</TextHeading>
        <Flex direction="column" gap="200">
          <Tag variant="secondary" scheme="positive">Tag</Tag>
          <TextPrice label="/ mo" currency="$" price="50" />
        </Flex>
        <Text>Text</Text>
        <Flex wrap type="half" gap="200">
          <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Label">
            <IconChevronDown />
          </SelectField>
          <IconButton variant="primary">
            <IconHeart />
          </IconButton>
        </Flex>
        <Accordion>
          <AccordionItem title="Title">Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.</AccordionItem>
        </Accordion>
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
    </Section>
  );
}
