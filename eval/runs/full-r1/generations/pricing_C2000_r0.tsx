import React from "react";
import { Footer } from "compositions";
import { PricingCard } from "compositions";
import { Flex, Section } from "layout";
import { Header, HeaderAuth } from "compositions";
import { Hero } from "compositions";
import { PageAccordion } from "compositions";
import { Accordion, AccordionItem } from "primitives";
import { NavigationPill } from "primitives";

export default function Screen() {
  return (
    <div>
      <Header />
      <HeaderAuth />
      <Hero variant="subtle">
        <TextContentTitle
          hasSubtitle={true}
          subtitle="Subtitle"
          title="Title"
          align="center"
        />
      </Hero>
      <CardGridPricing />
      <PageAccordion>
        <TextContentHeading
          hasSubheading={true}
          subheading="Subheading"
          heading="Heading"
          align="center"
        />
        <Accordion>
          <AccordionItem
            title="Title"
            content="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list."
            state="open"
          />
          <AccordionItem
            title="Title"
            content="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list."
            state="closed"
          />
          <AccordionItem
            title="Title"
            content="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list."
            state="closed"
          />
          <AccordionItem
            title="Title"
            content="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list."
            state="closed"
          />
        </Accordion>
      </PageAccordion>
      <Footer />
    </div>
  );
}
