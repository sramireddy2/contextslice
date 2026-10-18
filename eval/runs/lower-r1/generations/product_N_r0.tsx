import React from 'react';
import { Box, Image, Text, Button, Rating, Grid, Column } from 'primitives';
import { Card, Section, Header, Footer } from 'compositions';
import { Container, Row } from 'layout';
import { HeartIcon, ShoppingCartIcon } from 'icons';
import { productDetail } from 'images';

export default function Screen() {
  return (
    <Container>
      <Row>
        <Column>
          <Card>
            <Image src={productDetail} alt="Product Image" />
          </Card>
        </Column>
        <Column>
          <Section>
            <Header>
              <Text variant="h1">Product Name</Text>
            </Header>
            <Section>
              <Text variant="body1">Price: $99.99</Text>
            </Section>
            <Section>
              <Text variant="body1">Options:</Text>
              <Grid columns="1fr 1fr" gap="var(--sds-size-space-200)">
                <Button variant="primary">Option 1</Button>
                <Button variant="primary">Option 2</Button>
              </Grid>
            </Section>
            <Section>
              <Text variant="body1">Reviews:</Text>
              <Rating value={4.5} />
              <Text variant="body2">5 out of 5 stars</Text>
            </Section>
            <Footer>
              <Button variant="primary" startIcon={<HeartIcon />}>Save</Button>
              <Button variant="primary" startIcon={<ShoppingCartIcon />}>Add to Cart</Button>
            </Footer>
          </Section>
        </Column>
      </Row>
    </Container>
  );
}
