import { Card, Footer, Header, HeaderAuth, Hero } from "compositions";
import { Flex, FlexItem, Section } from "layout";
import { Image, Navigation, Text, TextContentHeading, TextContentTitle, TextHeading } from "primitives";

export default function Screen() {
  return (
    <Flex container direction="column" gap="1200">
      <Header>
        <Navigation direction="row">
          {/* Navigation items */}
        </Navigation>
        <HeaderAuth />
      </Header>
      <Hero variant="subtle">
        <TextContentTitle align="center" title="About Us" subtitle="Learn more about our platform" />
      </Hero>
      <Section padding="1200">
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <FlexItem>
            <Flex wrap direction="column" gap="1200">
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Our Mission</TextHeading>
                <Text>Our mission is to provide a seamless and intuitive experience for our users.</Text>
              </Card>
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Our Vision</TextHeading>
                <Text>Our vision is to become the leading platform in our industry.</Text>
              </Card>
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Our Values</TextHeading>
                <Text>We value honesty, integrity, and customer satisfaction.</Text>
              </Card>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Section padding="1200">
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <FlexItem>
            <Flex wrap type="third" gap="1200">
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Our Team</TextHeading>
                <Text>Meet the team behind our platform.</Text>
              </Card>
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Our Partners</TextHeading>
                <Text>Our partners include leading companies in our industry.</Text>
              </Card>
              <Card asset={<Image alt="Always use alt text" aspectRatio="1-1" size="small" />} direction="horizontal" variant="stroke">
                <TextHeading>Our Customers</TextHeading>
                <Text>See what our customers have to say about our platform.</Text>
              </Card>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
      <Footer />
    </Flex>
  );
}
