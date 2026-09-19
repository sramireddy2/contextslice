import { Footer } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Header, HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { CardGridContentList, CardGridImage } from "compositions";
import { TextContentHeading } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header Platform="Desktop" State="Default">
        <Navigation Direction="Row">
          <NavigationPill Label="Products" State="Active" />
          <NavigationPill Label="Solutions" State="Default" />
          <NavigationPill Label="Community" State="Default" />
          <NavigationPill Label="Resources" State="Default" />
          <NavigationPill Label="Pricing" State="Default" />
          <NavigationPill Label="Contact" State="Default" />
        </Navigation>
        <HeaderAuth State="Logged Out" />
      </Header>
      <Hero Platform="Desktop">
        <TextContentTitle HasSubtitle={true} Subtitle="Subtitle" Title="Title" Align="Center" />
      </Hero>
      <Panel Platform="Desktop" />
      <CardGridContentList Platform="Desktop">
        <TextContentHeading HasSubheading={true} Subheading="Subheading" Heading="Heading" Align="Start" />
        <Card Icon="Info" Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Asset={true} Heading="Title" Button={true} AssetType="Image" Variant="Stroke" Direction="Horizontal" />
        <Card Icon="Info" Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Asset={true} Heading="Title" Button={true} AssetType="Image" Variant="Stroke" Direction="Horizontal" />
        <Card Icon="Info" Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Asset={true} Heading="Title" Button={true} AssetType="Image" Variant="Stroke" Direction="Horizontal" />
      </CardGridContentList>
      <CardGridImage Platform="Desktop">
        <TextContentHeading HasSubheading={true} Subheading="Subheading" Heading="Heading" Align="Start" />
        <Card Icon="Info" Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Asset={true} Heading="Title" Button={false} AssetType="Image" Variant="Stroke" Direction="Horizontal" />
        <Card Icon="Info" Body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." Asset={true} Heading="Title" Button={false} AssetType="Image" Variant="Stroke" Direction="Horizontal" />
      </CardGridImage>
      <Footer Platform="Desktop" />
    </div>
  );
}
