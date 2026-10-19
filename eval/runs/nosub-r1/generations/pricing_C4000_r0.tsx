import { IconStar, IconX } from "icons";
import { CardGridPricing, NavigationPillList, PricingCard, Accordion, AccordionItem, TextContentHeading, TextLinkList } from "compositions";
import { Box, Flex, Text } from "primitives";

export default function Screen() {
  return (
    <Box style={{ padding: "var(--sds-size-space-1600)" }}>
      <TextContentHeading
        heading="Pricing"
        subheading="Choose the plan that fits your needs"
        style="Title Page"
      />
      <CardGridPricing>
        <NavigationPillList>
          <NavigationPill label="Monthly" />
          <NavigationPill label="Yearly" />
        </NavigationPillList>
        <PricingCard
          title="Basic Plan"
          price={{ currency: "$", amount: "50", label: "/ mo" }}
          listItems={["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]}
          buttonLabel="Get Started"
          buttonIconEnd={IconX}
        />
        <PricingCard
          title="Premium Plan"
          price={{ currency: "$", amount: "100", label: "/ mo" }}
          listItems={["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]}
          buttonLabel="Get Started"
          buttonIconEnd={IconX}
          variant="Brand"
        />
        <PricingCard
          title="Enterprise Plan"
          price={{ currency: "$", amount: "200", label: "/ mo" }}
          listItems={["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]}
          buttonLabel="Get Started"
          buttonIconEnd={IconX}
        />
      </CardGridPricing>
      <TextContentHeading
        heading="Frequently Asked Questions"
        subheading="Answering your questions"
        style="Title Page"
      />
      <Accordion>
        <AccordionItem title="What is the difference between the plans?">
          <Text>
            The Basic Plan includes essential features, the Premium Plan adds advanced features, and the Enterprise Plan offers premium support and additional features.
          </Text>
        </AccordionItem>
        <AccordionItem title="How do I cancel my subscription?">
          <Text>
            You can cancel your subscription by contacting our support team.
          </Text>
        </AccordionItem>
        <AccordionItem title="What payment methods are accepted?">
          <Text>
            We accept credit cards, debit cards, and PayPal.
          </Text>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
