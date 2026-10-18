import { Card, Footer, Header, HeaderAuth, Hero } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Image, Navigation, Text, TextContentTitle, TextHeading } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="1200">
      <Header>
        <Navigation direction="row">
          {/* Slot "Slot" content */}
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle align="center" title="About Us" subtitle="Learn more about our platform" />
      </Hero>
      <CardGridContentList gap="1200" padding="1200">
        <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
          <TextHeading>Our Mission</TextHeading>
          <Text>Our mission is to provide a seamless and intuitive experience for our users.</Text>
        </Card>
        <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
          <TextHeading>Our Values</TextHeading>
          <Text>We value honesty, integrity, and customer satisfaction above all.</Text>
        </Card>
        <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
          <TextHeading>Our Team</TextHeading>
          <Text>Our team is made up of passionate and dedicated individuals who are committed to delivering the best possible experience.</Text>
        </Card>
      </CardGridContentList>
      <CardGridImage gap="1200" padding="1200">
        <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
          <TextHeading>Our Features</TextHeading>
          <Text>Our platform offers a wide range of features to help you achieve your goals.</Text>
        </Card>
        <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
          <TextHeading>Our Support</TextHeading>
          <Text>We offer 24/7 support to help you with any questions or concerns you may have.</Text>
        </Card>
      </CardGridImage>
      <Footer>
        <Text slot="Title">Contact Us</Text>
        <Text slot="Slot">Email: info@example.com</Text>
        <Text slot="Slot">Phone: +1 123 456 7890</Text>
      </Footer>
    </Flex>
  );
}
