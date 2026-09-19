import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { IconHeart } from "icons";
import { IconButton } from "primitives";
import { InputField } from "primitives";
import { SelectField } from "primitives";
import { Accordion, AccordionItem } from "primitives";
import { AvatarBlock } from "primitives";
import { Text, TextContentHeading, TextHeading, TextPrice } from "primitives";
import { placeholder } from "images";

export default function Screen() {
  return (
    <div>
      <Header />
      <PageProduct>
        <TextHeading>Text Heading</TextHeading>
        <Flex container type="half" wrap gap="var(--sds-size-space-400)">
          <Image src={placeholder} alt="Always use image alt" size="large" aspectRatio="4-3" />
          <FlexItem size="half">
            <Flex direction="column" gap="var(--sds-size-space-600)" alignSecondary="stretch">
              <Text>Text</Text>
              <FlexItem>
                <Flex direction="column" gap="var(--sds-size-space-200)">
                  <Tag Label="Tag" Removable={false} Scheme="Positive" State="Default" Variant="Secondary" />
                  <TextPrice Price="50" Currency="$" Label="/ mo" HasLabel={false} Size="Large" />
                </Flex>
              </FlexItem>
              <FlexItem>
                <Flex wrap type="half" gap="var(--sds-size-space-200)">
                  <SelectField
                    HasError={true}
                    Error="Error"
                    Value="Value"
                    HasDescription={false}
                    Open={false}
                    Label="Label"
                    Description="Description"
                    HasLabel={true}
                    State="Default"
                    ValueType="Default"
                  />
                  <SelectField
                    HasError={true}
                    Error="Error"
                    Value="Value"
                    HasDescription={false}
                    Open={false}
                    Label="Label"
                    Description="Description"
                    HasLabel={true}
                    State="Default"
                    ValueType="Default"
                  />
                </Flex>
              </FlexItem>
              <IconButton Icon={<IconHeart />} Variant="Primary" State="Default" Size="Medium" />
              <Accordion>
                <AccordionItem Title="Title" Content="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." State="Open" />
              </Accordion>
            </Flex>
          </FlexItem>
        </Flex>
      </PageProduct>
      <CardGridReviews>
        <TextHeading>Latest reviews</TextHeading>
        <ReviewCard
          stars={5}
          src={placeholder}
          title="Review title"
          body="Review body"
          date="Date"
          name="Reviewer name"
        />
        <ReviewCard
          stars={4}
          src={placeholder}
          title="Review title"
          body="Review body"
          date="Date"
          name="Reviewer name"
        />
        <ReviewCard
          stars={3}
          src={placeholder}
          title="Review title"
          body="Review body"
          date="Date"
          name="Reviewer name"
        />
      </CardGridReviews>
      <PageNewsletter>
        <TextContentHeading HasSubheading={true} Subheading="With our daily newsletter" Heading="Follow the latest trends" Align="Center" />
        <FormBox>
          <InputField
            Value="you@example.com"
            Description="Description"
            Error="Error"
            HasError={false}
            HasDescription={false}
            Label="Email address"
            HasLabel={false}
            State="Default"
            ValueType="Default"
          />
        </FormBox>
      </PageNewsletter>
      <Footer />
    </div>
  );
}
