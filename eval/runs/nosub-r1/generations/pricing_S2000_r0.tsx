import { Box, Button, Card, Flex, Grid, Heading, Text, Accordion, AccordionItem, Icon } from 'primitives';
import { NavigationPill, PricingCard } from 'compositions';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box style={{ background: theme.colorBackgroundDefaultDefault, padding: theme.sizeSpace1600 }}>
      <Flex direction="column" gap={theme.sizeSpace1200}>
        <Flex direction="row" gap={theme.sizeSpace400} align="center">
          <Icon name="Figma" />
          <NavigationPillList>
            <NavigationPill>Products</NavigationPill>
            <NavigationPill>Solutions</NavigationPill>
            <NavigationPill>Community</NavigationPill>
            <NavigationPill>Resources</NavigationPill>
            <NavigationPill active>Pricing</NavigationPill>
            <NavigationPill>Contact</NavigationPill>
          </NavigationPillList>
          <Flex direction="row" gap={theme.sizeSpace300} align="center">
            <Button variant="primary">Sign in</Button>
            <Button variant="secondary">Register</Button>
          </Flex>
        </Flex>
        <Flex direction="column" gap={theme.sizeSpace1200}>
          <Text variant="titleHero">Title</Text>
          <Text variant="subtitle">Subtitle</Text>
        </Flex>
        <Grid direction="column" gap={theme.sizeSpace1200} padding={theme.sizeSpace1600}>
          <NavigationPillList>
            <NavigationPill>Monthly</NavigationPill>
            <NavigationPill active>Yearly</NavigationPill>
          </NavigationPillList>
          <Grid direction="row" wrap="wrap" gap={theme.sizeSpace1600}>
            <PricingCard>
              <Box direction="column" gap={theme.sizeSpace400} align="center">
                <Text variant="heading">Title</Text>
                <Box direction="row" gap={0} align="center">
                  <Text>$</Text>
                  <Text>/ mo</Text>
                </Box>
                <Grid direction="column" gap={12}>
                  <Text>Feature 1</Text>
                  <Text>Feature 2</Text>
                  <Text>Feature 3</Text>
                </Grid>
              </Box>
              <Button>Button</Button>
            </PricingCard>
            <PricingCard>
              <Box direction="column" gap={theme.sizeSpace400} align="center">
                <Text variant="heading">Title</Text>
                <Box direction="row" gap={0} align="center">
                  <Text>$</Text>
                  <Text>/ mo</Text>
                </Box>
                <Grid direction="column" gap={12}>
                  <Text>Feature 1</Text>
                  <Text>Feature 2</Text>
                  <Text>Feature 3</Text>
                </Grid>
              </Box>
              <Button>Button</Button>
            </PricingCard>
            <PricingCard>
              <Box direction="column" gap={theme.sizeSpace400} align="center">
                <Text variant="heading">Title</Text>
                <Box direction="row" gap={0} align="center">
                  <Text>$</Text>
                  <Text>/ mo</Text>
                </Box>
                <Grid direction="column" gap={12}>
                  <Text>Feature 1</Text>
                  <Text>Feature 2</Text>
                  <Text>Feature 3</Text>
                </Grid>
              </Box>
              <Button>Button</Button>
            </PricingCard>
          </Grid>
        </Grid>
        <Grid direction="column" gap={theme.sizeSpace1200} padding={theme.sizeSpace1600}>
          <Text variant="heading">Heading</Text>
          <Text variant="subtitle">Subheading</Text>
          <Accordion>
            <AccordionItem>
              <Box direction="row" align="center">
                <Text>Title</Text>
                <Icon name="Chevron up" />
              </Box>
              <Box direction="row" align="center">
                <Text>Content</Text>
              </Box>
            </AccordionItem>
            <AccordionItem>
              <Box direction="row" align="center">
                <Text>Title</Text>
                <Icon name="Chevron up" />
              </Box>
              <Box direction="row" align="center">
                <Text>Content</Text>
              </Box>
            </AccordionItem>
            <AccordionItem>
              <Box direction="row" align="center">
                <Text>Title</Text>
                <Icon name="Chevron up" />
              </Box>
              <Box direction="row" align="center">
                <Text>Content</Text>
              </Box>
            </AccordionItem>
            <AccordionItem>
              <Box direction="row" align="center">
                <Text>Title</Text>
                <Icon name="Chevron up" />
              </Box>
              <Box direction="row" align="center">
                <Text>Content</Text>
              </Box>
            </AccordionItem>
          </Accordion>
        </Grid>
        <Flex direction="row" gap={theme.sizeSpace600}>
          <Box direction="column" gap={theme.sizeSpace400}>
            <Icon name="Figma" />
            <Flex direction="row" gap={theme.sizeSpace400} align="center">
              <Icon name="X Logo" />
              <Icon name="Logo Instagram" />
              <Icon name="Logo YouTube" />
              <Icon name="LinkedIn" />
            </Flex>
          </Box>
          <Flex direction="column" gap={16}>
            <TextLinkList title="Explore">
              <TextLinkListItem>Design</TextLinkListItem>
              <TextLinkListItem>Explore</TextLinkListItem>
              <TextLinkListItem>Resources</TextLinkListItem>
              <TextLinkListItem>Blog</TextLinkListItem>
              <TextLinkListItem>Colors</TextLinkListItem>
              <TextLinkListItem>Support</TextLinkListItem>
            </TextLinkList>
            <TextLinkList title="Resources">
              <TextLinkListItem>Blog</TextLinkListItem>
              <TextLinkListItem>Colors</TextLinkListItem>
              <TextLinkListItem>Support</TextLinkListItem>
            </TextLinkList>
            <TextLinkList title="Explore">
              <TextLinkListItem>Design</TextLinkListItem>
              <TextLinkListItem>Explore</TextLinkListItem>
              <TextLinkListItem>Resources</TextLinkListItem>
              <TextLinkListItem>Blog</TextLinkListItem>
              <TextLinkListItem>Colors</TextLinkListItem>
              <TextLinkListItem>Support</TextLinkListItem>
            </TextLinkList>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
