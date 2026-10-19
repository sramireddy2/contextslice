import { Box, Button, Card, Flex, Grid, Heading, Image, Link, Select, Text } from 'primitives';
import { Heart, Star } from 'icons';
import { Avatar } from 'images';

export default function Screen() {
  return (
    <Box>
      <Box display="flex" gap="var(--sds-size-space-400)" alignItems="center">
        <Image src="product-image.jpg" alt="Product" width="400" height="400" />
        <Box>
          <Heading level={2}>Product Name</Heading>
          <Text>Price: $19.99</Text>
          <Select>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </Select>
          <Button>Buy Now</Button>
          <Box display="flex" gap="var(--sds-size-space-100)">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </Box>
          <Text>Product description goes here...</Text>
        </Box>
      </Box>
      <Heading level={3}>Latest Reviews</Heading>
      <Grid gap="var(--sds-size-space-1200)">
        <Card>
          <Box display="flex" gap="var(--sds-size-space-100)">
            <Box display="flex" gap="var(--sds-size-space-100)">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </Box>
            <Box>
              <Heading level={4}>John Doe</Heading>
              <Text>2023-04-01</Text>
            </Box>
          </Box>
          <Text>Review text goes here...</Text>
        </Card>
        <Card>
          <Box display="flex" gap="var(--sds-size-space-100)">
            <Box display="flex" gap="var(--sds-size-space-100)">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </Box>
            <Box>
              <Heading level={4}>Jane Smith</Heading>
              <Text>2023-03-15</Text>
            </Box>
          </Box>
          <Text>Review text goes here...</Text>
        </Card>
        <Card>
          <Box display="flex" gap="var(--sds-size-space-100)">
            <Box display="flex" gap="var(--sds-size-space-100)">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </Box>
            <Box>
              <Heading level={4}>Alice Johnson</Heading>
              <Text>2023-02-20</Text>
            </Box>
          </Box>
          <Text>Review text goes here...</Text>
        </Card>
      </Grid>
    </Box>
  );
}
