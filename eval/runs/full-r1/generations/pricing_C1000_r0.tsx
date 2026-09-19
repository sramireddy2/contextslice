import React from "react";
import { Footer } from "compositions";
import { PricingCard } from "compositions";
import { Flex, Section } from "layout";
import { Header } from "compositions";
import { Hero } from "compositions";
import { PageAccordion } from "compositions";
import { Accordion } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header />
      <Hero variant="subtle">Pricing</Hero>
      <CardGridPricing />
      <PageAccordion>
        <TextContentHeading Subheading="Frequently Asked Questions" Heading="FAQ" Align="Center" />
        <Accordion>
          <Accordion.Item title="What is the difference between the plans?">
            The Basic plan includes essential features, while the Professional plan offers advanced tools and support.
          </Accordion.Item>
          <Accordion.Item title="How do I cancel my subscription?">
            You can cancel your subscription by logging into your account and navigating to the billing section.
          </Accordion.Item>
          <Accordion.Item title="What is the refund policy?">
            Our refund policy is 30 days from the purchase date. Please refer to our terms and conditions for details.
          </Accordion.Item>
        </Accordion>
      </PageAccordion>
      <Footer />
    </div>
  );
}
