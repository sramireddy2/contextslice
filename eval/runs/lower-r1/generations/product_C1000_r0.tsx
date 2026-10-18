import { Footer, Header, ReviewCard } from "compositions";
import { IconHeart } from "icons";
import { placeholder } from "images";
import { Flex, FlexItem, Section } from "layout";
import { Form, IconButton, Image, TextContentHeading, TextHeading } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header />
      <Section padding="1600" gap="1200">
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
              <TextHeading>Description: This is a high-quality product that will exceed your expectations.</TextHeading>
              <FlexItem>
                <Flex wrap type="half" gap="200">
                  <IconButton variant="primary">
                    <IconHeart size="24" />
                  </IconButton>
                  <TextHeading>Quantity: 1</TextHeading>
                </Flex>
              </FlexItem>
              <Button variant="primary">Add to Cart</Button>
              <Accordion>
                <AccordionItem title="Product Details">
                  <TextHeading>Details: This product is made of high-quality materials and is designed to last.</TextHeading>
                </AccordionItem>
              </Accordion>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Section padding="1200" gap="1200">
        <TextHeading>Latest Reviews</TextHeading>
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </Section>
      <Section padding="1600" gap="1200">
        <TextContentHeading align="center" heading="Follow the latest trends" subheading="With our daily newsletter" />
        <Form singleLine onSubmit={() => {}}>
          <InputField value="you@example.com" label="Email address" />
        </Form>
      </Section>
      <Footer />
    </div>
  );
}
