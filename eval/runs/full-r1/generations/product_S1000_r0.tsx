import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { ReviewCard } from "compositions";
import { placeholder } from "images";
import { Form } from "primitives";
import { Header } from "compositions";
import { HeaderAuth } from "compositions";
import { IconHeart } from "icons";
import { IconButton } from "primitives";
import { Accordion } from "primitives";
import { AvatarBlock } from "primitives";
import { Text } from "primitives";
import { TextContentHeading } from "primitives";
import { TextHeading } from "primitives";
import { TextLinkList } from "primitives";
import { TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ gap: "var(--sds-size-space-400)" }}>
      <Header Platform="Desktop" State="Default">
        <HeaderAuth State="Logged Out" />
      </Header>
      <PageProduct Platform="Desktop">
        <Slot name="Column">
          <Frame name="Body">
            <Frame name="Title">
              <TextHeading Text="Text Heading" />
            </Frame>
            <Frame name="Price">
              <Text Text="Text" />
            </Frame>
            <Text Text="Text" />
            <Instance name="Button">
              <Text Text="Button" />
            </Instance>
            <Accordion>
              {/* Accordion content */}
            </Accordion>
          </Frame>
          <IconButton Icon={IconHeart} Variant="Primary" State="Default" Size="Medium">
            <IconHeart />
          </IconButton>
        </Slot>
      </PageProduct>
      <CardGridReviews Platform="Desktop">
        <TextHeading Text="Latest reviews" />
        <ReviewCard>
          <TextHeading Text="Review title" />
          <Text Text="Review body" />
          <AvatarBlock Description="Date" Title="Reviewer name" />
        </ReviewCard>
        <ReviewCard>
          <TextHeading Text="Review title" />
          <Text Text="Review body" />
          <AvatarBlock Description="Date" Title="Reviewer name" />
        </ReviewCard>
        <ReviewCard>
          <TextHeading Text="Review title" />
          <Text Text="Review body" />
          <AvatarBlock Description="Date" Title="Reviewer name" />
        </ReviewCard>
      </CardGridReviews>
      <PageNewsletter Platform="Desktop">
        <TextContentHeading HasSubheading={true} Subheading="With our daily newsletter" Heading="Follow the latest trends" Align="Center" />
        <FormBox>
          {/* Form content */}
        </FormBox>
      </PageNewsletter>
      <Footer Platform="Desktop">
        <Slot name="Title">
          <Frame name="Figma" row align="center/center" w="hug" h="hug">
            <Vector name="Icon" />
          </Frame>
          <Frame name="Button List">
            <Frame name="X Logo" w="23.98" h="24">
              <Vector name="Icon" />
            </Frame>
            <Frame name="Logo Instagram" w="24" h="24" clip>
              <Vector name="Icon" />
            </Frame>
            <Frame name="Logo YouTube" w="24" h="24" clip>
              <Vector name="Icon" />
            </Frame>
            <Frame name="LinkedIn" w="24" h="24" clip>
              <Vector name="Icon" />
            </Frame>
          </Frame>
        </Slot>
        <Slot name="Slot">
          <TextLinkList HasTitle={true} Density="Default">
            <TextStrong Text="Use cases" />
            {/* Slot content */}
          </TextLinkList>
          <TextLinkList HasTitle={true} Density="Default">
            <TextStrong Text="Explore" />
            {/* Slot content */}
          </TextLinkList>
          <TextLinkList HasTitle={true} Density="Default">
            <TextStrong Text="Resources" />
            {/* Slot content */}
          </TextLinkList>
        </Slot>
      </Footer>
    </div>
  );
}
