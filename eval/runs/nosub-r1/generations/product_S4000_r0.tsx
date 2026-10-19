```tsx
import { Box, Button, Card, Flex, Grid, Heading, Image, Text, Select, Accordion, Avatar, ReviewCard, NewsletterForm, Footer, LinkList } from 'primitives';
import { NavigationPillList, IconButton, Heart, Star } from 'compositions';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box padding={theme.size.space[1600]} background={theme.color.background.default.default}>
      <Flex direction="column" gap={theme.size.space[600]}>
        <Flex direction="row" gap={theme.size.space[24]} align="center">
          <Box width={40} height={35}>
            <Heart />
          </Box>
          <NavigationPillList>
            <NavigationPill>Products</NavigationPill>
            <NavigationPill>Solutions</NavigationPill>
            <NavigationPill>Community</NavigationPill>
            <NavigationPill>Resources</NavigationPill>
            <NavigationPill>Pricing</NavigationPill>
            <NavigationPill>Contact</NavigationPill>
          </NavigationPillList>
        </Flex>
        <Flex direction="row" gap={theme.size.space[300]}>
          <Button>Sign in</Button>
          <Button fill={theme.color.text.brand.onBrand}>Register</Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap={theme.size.space[600]}>
        <Flex direction="row" gap={theme.size.space[1600]}>
          <Box width="fill" height="fill" background={theme.color.slate[200]} />
          <Flex direction="column" gap={theme.size.space[600]}>
            <Flex direction="column" gap={theme.size.space[400]}>
              <Flex direction="column" gap={theme.size.space[400]}>
                <Heading level={1}>Text Heading</Heading>
                <Flex direction="row" align="center">
                  <Text>$</Text>
                  <Text>19.99</Text>
                </Flex>
              </Flex>
              <Text style="Body Base" fill={theme.color.text.default.secondary}>
                Text
              </Text>
            </Flex>
            <Flex direction="row" gap={theme.size.space[600]}>
              <Select>
                <Text>Label</Text>
                <Text>Value</Text>
              </Select>
              <Select>
                <Text>Label</Text>
                <Text>Value</Text>
              </Select>
            </Flex>
            <Button fill={theme.color.text.brand.onBrand}>Button</Button>
            <Accordion>
              <Accordion.Item>
                <Accordion.Title>Title</Accordion.Title>
                <Accordion.Content>
                  <Text>Content</Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Flex>
        </Flex>
        <IconButton>
          <Heart />
        </IconButton>
      </Flex>
      <Flex direction="column" gap={theme.size.space[1200]}>
        <Heading level={2}>Latest reviews</Heading>
        <Grid direction="row" wrap="wrap" gap={theme.size.space[1200]}>
          <ReviewCard>
            <Flex direction="row" gap={theme.size.space[100]} align="center">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </Flex>
            <Flex direction="column" gap={theme.size.space[100]}>
              <Heading level={3}>Review title</Heading>
              <Text style="Body Base" fill={theme.color.text.default.default}>
                Review body
              </Text>
            </Flex>
            <Flex direction="row" gap={theme.size.space[300]}>
              <Avatar src="image.jpg" />
              <Flex direction="column" gap={2}>
                <Text style="Body Strong" fill={theme.color.text.default.secondary}>
                  Reviewer name
                </Text>
                <Text>Date</Text>
              </Flex>
            </Flex>
          </ReviewCard>
          <ReviewCard>
            <Flex direction="row" gap={theme.size.space[100]} align="center">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </Flex>
            <Flex direction="column" gap={theme.size.space[100]}>
              <Heading level={3}>Review title</Heading>
              <Text style="Body Base" fill={theme.color.text.default.default}>
                Review body
              </Text>
            </Flex>
            <Flex direction="row" gap={theme.size.space[300]}>
              <Avatar src="image.jpg" />
              <Flex direction="column" gap={2}>
                <Text style="Body Strong" fill={theme.color.text.default.secondary}>
                  Reviewer name
                </Text>
                <Text>Date</Text>
              </Flex>
            </Flex>
          </ReviewCard>
          <ReviewCard>
            <Flex direction="row" gap={theme.size.space[100]} align="center">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </Flex>
            <Flex direction="column" gap={theme.size.space[100]}>
              <Heading level={3}>Review title</Heading>
              <Text style="Body Base" fill={theme.color.text.default.default}>
                Review body
              </Text>
            </Flex>
            <Flex direction="row" gap={theme.size.space[300]}>
              <Avatar src="image.jpg" />
              <Flex direction="column" gap={2}>
                <Text style="Body Strong" fill={theme.color.text.default.secondary}>
                  Reviewer name
                </Text>
                <Text>Date</Text>
              </Flex>
            </Flex>
          </ReviewCard>
        </Grid>
      </Flex>
      <Flex direction="column" gap={theme.size.space[600]}>
        <Flex direction="column" gap={theme.size.space[200]} align="center">
          <Heading level={2}>Follow the latest trends</Heading>
          <Text style="Subheading" fill={theme.color.text.default.secondary}>
            With our daily newsletter
          </Text>
        </Flex>
        <Flex direction="row" gap={theme.size.space[300]} width={338}>
          <InputField>
            <Text>you@example.com</Text>
          </InputField>
          <Button fill={theme.color.text.brand.onBrand}>Submit</Button>
        </Flex>
      </Flex>
      <Footer>
        <Flex direction="row" wrap="wrap" gap={theme.size.space[400]} padding={[theme.size.space[800], theme.size.space[800], theme.size.space[4000], theme.size.space[800]]}>
          <Flex direction="column" gap={theme.size.space[600]}>
            <Flex direction="row" align="center">
              <Box width={23.33} height={35}>
                <Heart />
              </Box>
            </Flex>
            <Flex direction="row" gap={theme.size.space[400]}>
              <Box width={23.98} height={24}>
                <Heart />
              </Box>
              <Box width={24} height={24}>
                <Heart />
              </Box>
              <Box width={24} height={24}>
                <Heart />
              </Box>
              <Box width={24} height={24}>
                <Heart />
              </Box>
            </Flex>
          </Flex>
          <Flex direction="column" gap={theme.size.space[300]}>
            <Flex direction="column" gap={theme.size.space[400]}>
              <Heading level={3}>Use cases</Heading>
              <LinkList>
                <LinkList.Item>UI design</LinkList.Item>
                <LinkList.Item>UX design</LinkList.Item>
                <LinkList.Item>Wireframing</LinkList.Item>
                <LinkList.Item>Diagramming</LinkList.Item>
                <LinkList.Item>Brainstorming</LinkList.Item>
                <LinkList.Item>Online whiteboard</LinkList.Item>
                <LinkList.Item>Team collaboration</LinkList.Item>
              </LinkList>
            </Flex>
            <Flex direction="column" gap={theme.size.space[400]}>
              <Heading level={3}>Explore</Heading>
              <LinkList>
                <LinkList.Item>Design</LinkList.Item>
                <LinkList.Item>Prototyping</LinkList.Item>
                <LinkList.Item>Development features</LinkList.Item>
                <LinkList.Item>Design systems</LinkList.Item>
                <LinkList.Item>Collaboration features</LinkList.Item>
                <LinkList.Item>Design process</LinkList.Item>
                <LinkList.Item>FigJam</LinkList.Item>
              </LinkList>
            </Flex>
            <Flex direction="column" gap={theme.size.space[400]}>
              <Heading level={3}>Resources</Heading>
              <LinkList>
                <LinkList.Item>Blog</LinkList.Item>
                <LinkList.Item>Best practices</LinkList.Item>
                <Link
