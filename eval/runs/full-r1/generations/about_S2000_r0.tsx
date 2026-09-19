import { Footer } from "compositions";
import { Header } from "compositions";
import { Hero } from "compositions";
import { CardGridContentList, CardGridImage } from "compositions";
import { Section } from "layout";

export default function Screen() {
  return (
    <div>
      <Header />
      <Hero variant="subtle">
        <TextContentTitle
          title="Welcome to Simple Design System"
          subtitle="Your one-stop solution for design and development"
          align="center"
        />
      </Hero>
      <Section padding="var(--sds-size-space-400)">
        <CardGridContentList padding="var(--sds-size-space-400)">
          <TextContentHeading
            heading="Our Mission"
            subheading="Empowering designers and developers"
            align="start"
          />
          <Card
            icon="info"
            body="Our mission is to provide a comprehensive design system that simplifies the process of creating user-friendly and accessible interfaces."
            asset={true}
            heading="Mission Statement"
            button={true}
            assetType="image"
            variant="stroke"
            direction="horizontal"
          />
          <Card
            icon="info"
            body="We strive to empower designers and developers by offering a wide range of components and tools that adhere to best practices and standards."
            asset={true}
            heading="Our Vision"
            button={true}
            assetType="image"
            variant="stroke"
            direction="horizontal"
          />
          <Card
            icon="info"
            body="Our design system is built with accessibility in mind, ensuring that all users, regardless of their abilities, can interact with our components seamlessly."
            asset={true}
            heading="Accessibility"
            button={true}
            assetType="image"
            variant="stroke"
            direction="horizontal"
          />
        </CardGridContentList>
      </Section>
      <Section padding="var(--sds-size-space-400)">
        <CardGridImage padding="var(--sds-size-space-400)">
          <TextContentHeading
            heading="Our Components"
            subheading="A collection of reusable design elements"
            align="start"
          />
          <Card
            icon="info"
            body="Our design system includes a wide range of components, from buttons and forms to cards and grids."
            asset={true}
            heading="Components"
            button={false}
            assetType="image"
            variant="stroke"
            direction="horizontal"
          />
          <Card
            icon="info"
            body="Each component is designed to be highly customizable, allowing you to easily tailor it to your specific needs."
            asset={true}
            heading="Customization"
            button={false}
            assetType="image"
            variant="stroke"
            direction="horizontal"
          />
          <Card
            icon="info"
            body="Our components are built with accessibility in mind, ensuring that all users, regardless of their abilities, can interact with them seamlessly."
            asset={true}
            heading="Accessibility"
            button={false}
            assetType="image"
            variant="stroke"
            direction="horizontal"
          />
        </CardGridImage>
      </Section>
      <Footer />
    </div>
  );
}
