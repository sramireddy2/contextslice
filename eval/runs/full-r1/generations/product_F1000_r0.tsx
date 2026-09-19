import { Box, Button, Card, Flex, Grid, Heading, Image, Text } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header } from 'layout';
import { ReactNode } from 'react';

const ProductDetail = () => {
  const product = {
    name: 'Product Name',
    description: 'Product Description',
    price: '$99.99',
    images: [
      'https://via.placeholder.com/600x400',
      'https://via.placeholder.com/600x400',
      'https://via.placeholder.com/600x400',
    ],
    options: ['Option 1', 'Option 2', 'Option 3'],
    reviews: [
      {
        rating: 5,
        text: 'Great product!',
        author: 'John Doe',
      },
      {
        rating: 4,
        text: 'Good product, but could be better.',
        author: 'Jane Smith',
      },
    ],
  };

  return (
    <Box>
      <Header />
      <Box padding="var(--sds-size-space-800)">
        <Grid columns="1fr 1fr" gap="var(--sds-size-space-800)">
          <Box>
            <Card>
              <Box padding="var(--sds-size-space-400)">
                <Heading level={2}>{product.name}</Heading>
                <Text>{product.description}</Text>
                <Text>{product.price}</Text>
                <Box display="flex" gap="var(--sds-size-space-200)">
                  {product.options.map((option, index) => (
                    <Button key={index} variant="secondary">
                      {option}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Card>
          </Box>
          <Box>
            <Card>
              <Box padding="var(--sds-size-space-400)">
                <Heading level={3}>Product Images</Heading>
                <Flex wrap="wrap" gap="var(--sds-size-space-200)">
                  {product.images.map((image, index) => (
                    <Image key={index} src={image} alt={`Product Image ${index + 1}`} width="100%" />
                  ))}
                </Flex>
              </Box>
            </Card>
          </Box>
        </Grid>
        <Box marginTop="var(--sds-size-space-800)">
          <Heading level={3}>Reviews</Heading>
          <Box>
            {product.reviews.map((review, index) => (
              <Box key={index} padding="var(--sds-size-space-400)" border="1px solid var(--sds-color-border-default-default)" borderRadius="var(--sds-size-radius-200)" marginBottom="var(--sds-size-space-200)">
                <Flex alignItems="center" gap="var(--sds-size-space-200)">
                  <Text>{review.rating}</Text>
                  <Text>{review.text}</Text>
                </Flex>
                <Text>{review.author}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function Screen() {
  return <ProductDetail />;
}
