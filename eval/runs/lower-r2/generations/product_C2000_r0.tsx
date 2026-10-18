import { Footer, Header, HeaderAuth, ReviewCard } from "compositions";
import { IconHeart } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Accordion, AccordionItem, AvatarBlock, Form, IconButton, Image, InputField, Navigation, Select, SelectField, SelectItem, Tag, Text, TextContentHeading, TextHeading, TextLinkList, TextPrice } from "primitives";

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
              <TextContentHeading align="center" heading="Product Name" subheading="Description of the product" />
              <FlexItem>
                <Flex direction="column" gap="200">
                  <Tag variant="secondary" scheme="positive"> "New" </Tag>
                  <TextPrice label="/ mo" currency="$" price="50" />
                </Flex>
              </FlexItem>
              <Text> "This is a detailed description of the product. It includes information about its features, benefits, and how it can help the user. It's important to provide enough information to make an informed decision about purchasing the product." </Text>
              <FlexItem>
                <Flex wrap type="half" gap="200">
                  <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Size">
                    <SelectItem key="Value" value="Value"> "Value" </SelectItem>
                    <SelectItem key="Value2" value="Value2"> "Value2" </SelectItem>
                  </SelectField>
                  <SelectField value="Value" placeholder="Default" defaultSelectedKey="Value" label="Color">
                    <SelectItem key="Value" value="Value"> "Value" </SelectItem>
                    <SelectItem key="Value2" value="Value2"> "Value2" </SelectItem>
                  </SelectField>
                </Flex>
              </FlexItem>
              <IconButton variant="primary">
                <IconHeart size="24" />
              </IconButton>
              <Accordion>
                <AccordionItem title="FAQ">
                  <Text> "Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." </Text>
                </AccordionItem>
              </Accordion>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Section padding="1200">
        <TextHeading> "Latest reviews" </TextHeading>
        <ReviewCard stars={5} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
        <ReviewCard stars={4} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
        <ReviewCard stars={3} src={placeholder} title="Review title" body="Review body" date="Date" name="Reviewer name" />
      </Section>
      <Footer>
        <Slot "Title">
          <Frame "Figma" row align="center" center w="hug" h="hug">
            <Vector "Icon" w="23.33" h="35" stroke="#1e1e1e" stroke-w="3.5" />
          </Frame>
          <Frame "Button List" row gap="1200" align="min" center w="hug" h="hug">
            <Frame "X Logo" w="23.98" h="24">
              <Vector "Icon" />
            </Frame>
            <Frame "Logo Instagram" w="24" h="24" clip>
              <Vector "Icon" />
            </Frame>
            <Frame "Logo YouTube">
              <Vector "Icon" />
            </Frame>
            <Frame "LinkedIn" w="24" h="24" clip>
              <Vector "Icon" />
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
          <TextLinkList density="default">
            {/* Slot "Slot" (+7 elided) */}
          </TextLinkList>
        </Slot>
      </Footer>
    </div>
  );
}
