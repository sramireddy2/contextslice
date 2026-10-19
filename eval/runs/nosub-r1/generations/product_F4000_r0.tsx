import { Box, Button, Card, Flex, Grid, Heading, Image, Rating, Text, Avatar } from 'primitives';
import { SelectField, Accordion, IconButton } from 'compositions';
import { Star, Heart } from 'icons';
import { useNavigate } from 'react-router-dom';

export default function Screen() {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // Add to cart logic
  };

  const handleReviewClick = () => {
    // Navigate to reviews page
  };

  return (
    <Box padding="var(--sds-size-space-1600)" background="var(--sds-color-background-default-default)">
      <Flex direction="column" gap="var(--sds-size-space-600)">
        <Flex direction="row" gap="var(--sds-size-space-1600)">
          <Image src="/path/to/product-image.jpg" alt="Product Image" width="100%" height="auto" />
          <Flex direction="column" gap="var(--sds-size-space-600)">
            <Flex direction="column" gap="var(--sds-size-space-400)">
              <Heading level={1} style="Heading">Product Name</Heading>
              <Flex direction="row" gap="var(--sds-size-space-100)">
                <Box background="var(--sds-color-background-positive-secondary)" padding="var(--sds-size-space-200)" borderRadius="var(--sds-size-radius-200)">
                  <Text style="Single Line/Body Base">Tag</Text>
                </Box>
                <Flex direction="row" align="center" gap="var(--sds-size-space-300)">
                  <Text style="Single Line/Body Base">$50</Text>
                  <Text style="Single Line/Body Base">/ mo</Text>
                </Flex>
              </Flex>
              <Text style="Body Base">Product description goes here...</Text>
            </Flex>
            <Flex direction="row" gap="var(--sds-size-space-600)">
              <SelectField
                label="Label"
                value="Value"
                error="Error"
                hasError
                hasDescription
                description="Description"
              />
              <SelectField
                label="Label"
                value="Value"
                error="Error"
                hasError
                hasDescription
                description="Description"
              />
            </Flex>
            <Button
              variant="primary"
              size="medium"
              label="Button"
              onClick={handleAddToCart}
            />
            <Accordion>
              <Accordion.Item
                title="Title"
                content="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list."
                isOpen
              />
            </Accordion>
          </Flex>
        </Flex>
        <Flex direction="row" gap="var(--sds-size-space-1200)">
          <Heading level={2} style="Heading">Latest reviews</Heading>
          <Grid columns="repeat(auto-fill, minmax(300px, 1fr))" gap="var(--sds-size-space-1200)">
            <Card padding="var(--sds-size-space-600)" border="var(--sds-color-border-default-default)" borderRadius="var(--sds-size-radius-200)">
              <Flex direction="row" gap="var(--sds-size-space-100)">
                <Rating value={5} />
                <Flex direction="column" gap="var(--sds-size-space-100)">
                  <Heading level={3} style="Heading">Review title</Heading>
                  <Text style="Body Base">Review body goes here...</Text>
                </Flex>
              </Flex>
              <Flex direction="row" gap="var(--sds-size-space-300)">
                <Avatar
                  type="image"
                  size="large"
                  shape="circle"
                  initials="F"
                  src="/path/to/avatar.jpg"
                />
                <Flex direction="column" gap="2">
                  <Text style="Body Strong">Reviewer name</Text>
                  <Text style="Body Base">Date</Text>
                </Flex>
              </Flex>
            </Card>
            <Card padding="var(--sds-size-space-600)" border="var(--sds-color-border-default-default)" borderRadius="var(--sds-size-radius-200)">
              <Flex direction="row" gap="var(--sds-size-space-100)">
                <Rating value={5} />
                <Flex direction="column" gap="var(--sds-size-space-100)">
                  <Heading level={3} style="Heading">Review title</Heading>
                  <Text style="Body Base">Review body goes here...</Text>
                </Flex>
              </Flex>
              <Flex direction="row" gap="var(--sds-size-space-300)">
                <Avatar
                  type="image"
                  size="large"
                  shape="circle"
                  initials="F"
                  src="/path/to/avatar.jpg"
                />
                <Flex direction="column" gap="2">
                  <Text style="Body Strong">Reviewer name</Text>
                  <Text style="Body Base">Date</Text>
                </Flex>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </Flex>
    </Box>
  );
}
