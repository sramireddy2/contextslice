import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { IconHeart } from "icons";
import { IconButton } from "primitives";
import { Accordion } from "primitives";
import { TextContentHeading } from "primitives";
import { TextHeading } from "primitives";
import { placeholder } from "images";

export default function Screen() {
  return (
    <Section padding="var(--sds-size-space-600)">
      <Flex container type="half" wrap gap="var(--sds-size-space-600)">
        <Image src={placeholder} alt="Product Image" size="large" aspectRatio="4-3" />
        <FlexItem size="half">
          <Flex direction="column" gap="var(--sds-size-space-400)" alignSecondary="stretch">
            <TextContentHeading heading="Product Name" subheading="Category" align="center" />
            <FlexItem>
              <Flex direction="column" gap="var(--sds-size-space-200)">
                <TextHeading>Price: $19.99</TextHeading>
                <TextHeading>Rating: 4.5/5</TextHeading>
              </Flex>
            </FlexItem>
            <TextHeading>Description of the product goes here...</TextHeading>
            <FlexItem>
              <Flex wrap type="half" gap="var(--sds-size-space-200)">
                <IconButton
                  icon={<IconHeart size="medium" />}
                  variant="primary"
                  state="default"
                  size="medium"
                />
                <IconButton
                  icon={<IconHeart size="medium" />}
                  variant="primary"
                  state="default"
                  size="medium"
                />
              </Flex>
            </FlexItem>
            <Accordion>
              <TextHeading>Product Details</TextHeading>
              <TextHeading>Additional Information</TextHeading>
            </Accordion>
          </Flex>
        </FlexItem>
      </Flex>
      <CardGridReviews>
        <TextHeading>Latest reviews</TextHeading>
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </CardGridReviews>
      <Footer />
    </Section>
  );
}
