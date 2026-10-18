import { Footer, Header, HeaderAuth } from "compositions";
import { IconHeart } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Form, IconButton, Image, TextContentHeading, TextHeading } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header>
        <HeaderAuth />
      </Header>
      <Section padding="1600">
        <Flex container type="half" wrap gap="1200">
          <Image src={placeholder} alt="Product Image" size="large" aspectRatio="4-3" />
          <FlexItem size="half">
            <Flex direction="column" gap="600" alignSecondary="stretch">
              <TextHeading>Product Name</TextHeading>
              <FlexItem>
                <Flex direction="column" gap="200">
                  <TextHeading>Price: $19.99</TextHeading>
                  <TextHeading>Category: Electronics</TextHeading>
                </Flex>
              </FlexItem>
              <TextHeading>Description: This is a high-quality product that will make your life easier.</TextHeading>
              <FlexItem>
                <Flex wrap type="half" gap="200">
                  <IconButton variant="primary">
                    <IconHeart size="24" />
                  </IconButton>
                  <TextHeading>5 out of 5 stars</TextHeading>
                </Flex>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Section padding="1200">
        <TextHeading>Latest reviews</TextHeading>
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <FlexItem>
            <Flex wrap type="third" gap="1200">
              <FlexItem>
                <Image src={placeholder} alt="Review Image" size="medium" aspectRatio="1-1" />
              </FlexItem>
              <FlexItem>
                <TextHeading>John Doe</TextHeading>
                <TextHeading>5 out of 5 stars</TextHeading>
                <TextHeading>Great product!</TextHeading>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex wrap type="third" gap="1200">
              <FlexItem>
                <Image src={placeholder} alt="Review Image" size="medium" aspectRatio="1-1" />
              </FlexItem>
              <FlexItem>
                <TextHeading>Jane Smith</TextHeading>
                <TextHeading>4 out of 5 stars</TextHeading>
                <TextHeading>Good product, but could be better.</TextHeading>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Footer />
    </div>
  );
}
