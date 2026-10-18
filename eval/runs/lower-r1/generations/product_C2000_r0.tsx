import { Footer, Header, HeaderAuth, ReviewCard } from "compositions";
import { IconHeart } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, AvatarBlock, Form, IconButton, Image, Navigation, Tag, Text, TextContentHeading, TextHeading, TextLinkList, TextPrice } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header>
        <Navigation direction="row">
          {/* Slot "Slot" (+6 elided) */}
        </Navigation>
        <HeaderAuth />
      </Header>
      <Section padding="1600">
        <Flex container type="half" wrap gap="1200">
          <Image src={placeholder} alt="Always use image alt" size="large" aspectRatio="4-3" />
          <FlexItem size="half">
            <Flex direction="column" gap="600" alignSecondary="stretch">
              <TextHeading>Product Name</TextHeading>
              <FlexItem>
                <Flex direction="column" gap="200">
                  <Tag variant="secondary" scheme="positive">New</Tag>
                  <TextPrice label="/ mo" currency="$" price="50" />
                </Flex>
              </FlexItem>
              <Text>Product description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
              <FlexItem>
                <Flex wrap type="half" gap="200">
                  <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Label"> {/* x2 (+1 elided) */}</SelectField>
                </Flex>
              </FlexItem>
              <IconButton variant="primary">
                <IconHeart />
              </IconButton>
              <Accordion>
                <AccordionItem title="Title">Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.</AccordionItem>
              </Accordion>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Section padding="1200">
        <TextHeading>Latest reviews</TextHeading>
        <ReviewCard stars={5} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
        <ReviewCard stars={4} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
        <ReviewCard stars={3} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
      </Section>
      <Footer>
        <Slot "Title">
          <Frame "Figma" row align="center" center w="hug" h="hug">
            <Vector "Icon" w="23.33" h="35" stroke="var(--sds-color-icon-default-default)" stroke-w="3.5" />
            <Frame "Button List" row gap="1200" align="min" center w="hug" h="hug">
              <Frame "X Logo" w="23.98" h="24">
                <Vector "Icon" w="23.98" h="24" fill="var(--sds-color-icon-default-default)" />
              </Frame>
              <Frame "Logo Instagram" w="24" h="24" clip>
                <Vector "Icon" w="24" h="24" fill="var(--sds-color-icon-default-default)" />
              </Frame>
              <Frame "Logo YouTube" w="24" h="24" clip>
                <Vector "Icon" w="24" h="18" fill="var(--sds-color-icon-default-default)" />
              </Frame>
              <Frame "LinkedIn" w="24" h="24" clip>
                <Vector "Icon" w="24" h="24" fill="var(--sds-color-icon-default-default)" />
              </Frame>
            </Frame>
          </Frame>
        </Slot>
        <Slot "Slot">
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
        </Slot>
      </Footer>
    </div>
  );
}
