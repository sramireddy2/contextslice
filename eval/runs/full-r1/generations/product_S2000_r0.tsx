import React from "react";
import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { IconHeart } from "icons";
import { IconButton } from "primitives";
import { Image } from "primitives";
import { placeholder } from "images";
import { ReviewCard } from "compositions";

export default function Screen() {
  return (
    <div>
      <Header />
      <PageProduct>
        <Frame>
          <TextHeading>Product Name</TextHeading>
          <TextHeading>Price: $19.99</TextHeading>
        </Frame>
        <Frame>
          <Image src={placeholder} alt="Product Image" />
          <IconButton icon={<IconHeart />} variant="Primary" size="Medium" />
        </Frame>
        <Accordion>
          <AccordionItem title="FAQ" state="Open">
            <Text>Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.</Text>
          </AccordionItem>
        </Accordion>
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
      <Footer />
    </div>
  );
}
