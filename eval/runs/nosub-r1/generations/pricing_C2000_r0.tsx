import React from "react";
import { IconStar, IconX } from "icons";
import { CardGridPricing, Accordion, TextContentTitle, TextContentHeading, PricingCard, Button } from "compositions";
import { Flex, Box } from "layout";

export default function Screen() {
  return (
    <Flex direction="column" gap="var(--sds-size-space-600)" padding="var(--sds-size-space-800)" fill="var(--sds-color-background-default-default)" stroke="var(--sds-color-border-default-default)" strokeW="1" clip>
      <Flex direction="row" wrap="wrap" gap="var(--sds-size-space-600)" align="min" justify="center" fill="var(--sds-color-background-default-default)" stroke="var(--sds-color-border-default-default)" strokeW="1" clip>
        <Box width="40" height="hug">
          {/* Figma icon */}
        </Box>
        {/* Navigation Pill List */}
        {/* Header Auth */}
      </Flex>
      <Box width="fill" height="hug" fill="var(--sds-color-background-default-secondary)">
        <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
      </Box>
      <Box width="fill" height="hug" fill="var(--sds-color-background-default-default)">
        <CardGridPricing>
          <Box width="fill" height="hug">
            {/* Navigation Pill List */}
          </Box>
          <Box width="fill" height="hug" display="flex" flexWrap="wrap" gap="var(--sds-size-space-1600)">
            <PricingCard variant="stroke">
              <Box width="fill" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-400)" align="max" justify="center">
                <TextContentTitle title="Title" align="center" />
                <Box width="hug" height="hug" display="flex" flexDirection="row" align="center" justify="center">
                  <Box width="hug" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-200)" align="center" justify="center">
                    <TextContentTitle title="Price" align="center" />
                  </Box>
                </Box>
                <Box width="hug" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-200)" align="center" justify="center">
                  <TextContentTitle title="List Item" align="center" />
                </Box>
              </Box>
              <Button variant="primary" state="default" size="medium" iconEnd={IconX} label="Button" />
            </PricingCard>
            <PricingCard variant="brand">
              <Box width="fill" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-400)" align="max" justify="center">
                <TextContentTitle title="Title" align="center" />
                <Box width="hug" height="hug" display="flex" flexDirection="row" align="center" justify="center">
                  <Box width="hug" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-200)" align="center" justify="center">
                    <TextContentTitle title="Price" align="center" />
                  </Box>
                </Box>
                <Box width="hug" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-200)" align="center" justify="center">
                  <TextContentTitle title="List Item" align="center" />
                </Box>
              </Box>
            </PricingCard>
            <PricingCard variant="stroke">
              <Box width="fill" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-400)" align="max" justify="center">
                <TextContentTitle title="Title" align="center" />
                <Box width="hug" height="hug" display="flex" flexDirection="row" align="center" justify="center">
                  <Box width="hug" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-200)" align="center" justify="center">
                    <TextContentTitle title="Price" align="center" />
                  </Box>
                </Box>
                <Box width="hug" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-200)" align="center" justify="center">
                  <TextContentTitle title="List Item" align="center" />
                </Box>
              </Box>
              <Button variant="primary" state="default" size="medium" iconEnd={IconX} label="Button" />
            </PricingCard>
          </Box>
        </CardGridPricing>
      </Box>
      <Box width="fill" height="hug" fill="var(--sds-color-background-default-default)">
        <TextContentHeading heading="Heading" subheading="Subheading" align="center" />
        <Accordion>
          <Box width="fill" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-400)">
            {/* Accordion Item */}
          </Box>
        </Accordion>
      </Box>
      <Box width="fill" height="hug" fill="var(--sds-color-background-default-default)" stroke="var(--sds-color-border-default-default)" strokeW="1" clip>
        <Box width="262" height="hug" display="flex" flexDirection="column" gap="var(--sds-size-space-600)">
          {/* Title */}
          {/* Slot */}
        </Box>
      </Box>
    </Flex>
  );
}
