import { Footer } from "compositions";
import { PricingCard } from "compositions";
import { Flex, Section } from "layout";
import { Header } from "compositions";
import { Accordion, AccordionItem } from "primitives";

export default function Screen() {
  return (
    <Section>
      <Header />
      <Hero variant="subtle">
        <TextContentTitle title="Pricing" subtitle="Choose the plan that fits your needs" align="center" />
      </Hero>
      <CardGridPricing>
        <Navigation direction="row">
          <NavigationPill label="Monthly" state="active" />
          <NavigationPill label="Yearly" state="default" />
        </Navigation>
        <Flex direction="column" gap="var(--sds-size-space-400)">
          <PricingCard
            heading="Basic Plan"
            action={{ label: "Get Started", icon: "ArrowRight", variant: "primary" }}
            listSlot={
              <TextList>
                <TextListItem>5 users included</TextListItem>
                <TextListItem>2GB storage</TextListItem>
                <TextListItem>Email support</TextListItem>
              </TextList>
            }
            textPrice={{ price: "50", currency: "$", label: "/ mo", size: "large" }}
            variant="stroke"
          />
          <PricingCard
            heading="Pro Plan"
            action={{ label: "Get Started", icon: "ArrowRight", variant: "primary" }}
            listSlot={
              <TextList>
                <TextListItem>10 users included</TextListItem>
                <TextListItem>10GB storage</TextListItem>
                <TextListItem>Email and phone support</TextListItem>
              </TextList>
            }
            textPrice={{ price: "100", currency: "$", label: "/ mo", size: "large" }}
            variant="brand"
          />
          <PricingCard
            heading="Enterprise Plan"
            action={{ label: "Get Started", icon: "ArrowRight", variant: "primary" }}
            listSlot={
              <TextList>
                <TextListItem>Unlimited users</TextListItem>
                <TextListItem>Unlimited storage</TextListItem>
                <TextListItem>24/7 support</TextListItem>
              </TextList>
            }
            textPrice={{ price: "200", currency: "$", label: "/ mo", size: "large" }}
            variant="stroke"
          />
        </Flex>
      </CardGridPricing>
      <PageAccordion>
        <TextContentHeading title="Frequently Asked Questions" subheading="Answering your questions" align="center" />
        <Accordion>
          <AccordionItem title="What is the difference between the Basic, Pro, and Enterprise plans?" state="open">
            <TextList>
              <TextListItem>Basic Plan: Includes 5 users, 2GB storage, and email support.</TextListItem>
              <TextListItem>Pro Plan: Includes 10 users, 10GB storage, and email and phone support.</TextListItem>
              <TextListItem>Enterprise Plan: Includes unlimited users, unlimited storage, and 24/7 support.</TextListItem>
            </TextList>
          </AccordionItem>
          <AccordionItem title="How do I upgrade my plan?" state="closed">
            <TextList>
              <TextListItem>Contact our sales team to upgrade your plan.</TextListItem>
            </TextList>
          </AccordionItem>
          <AccordionItem title="What is included in the free trial?" state="closed">
            <TextList>
              <TextListItem>Free trial includes access to the Basic Plan for 1 month.</TextListItem>
            </TextList>
          </AccordionItem>
        </Accordion>
      </PageAccordion>
      <Footer />
    </Section>
  );
}
