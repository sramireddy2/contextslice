import React from "react";
import { 
  Footer, 
  CardGridReviews, 
  ReviewCard, 
  FormBox, 
  Header, 
  HeaderAuth, 
  PageNewsletter, 
  PageProduct, 
  IconChevronDown, 
  IconHeart, 
  IconButton, 
  InputField, 
  SelectField, 
  Accordion, 
  AccordionItem, 
  Avatar, 
  AvatarBlock, 
  NavigationPill, 
  Navigation, 
  Tag, 
  Text, 
  TextContentHeading, 
  TextHeading, 
  TextLinkList, 
  TextListItem, 
  TextPrice, 
  TextStrong 
} from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { placeholder } from "images";

export default function Screen() {
  return (
    <div>
      <Header />
      <HeaderAuth />
      <PageProduct>
        <TextHeading>Product Name</TextHeading>
        <TextPrice price="50" currency="$" label="/ mo" />
        <Text>Product description goes here...</Text>
        <SelectField label="Select an option" value="Option 1">
          <SelectItem>Option 1</SelectItem>
          <SelectItem>Option 2</SelectItem>
        </SelectField>
        <IconButton icon={<IconHeart />} variant="Primary" />
        <Accordion>
          <AccordionItem title="FAQ" content="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." />
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
      <PageNewsletter>
        <TextContentHeading heading="Follow the latest trends" subheading="With our daily newsletter" align="Center" />
        <FormBox>
          <InputField label="Email address" value="you@example.com" />
        </FormBox>
      </PageNewsletter>
      <Footer />
    </div>
  );
}
