import { IconStar, IconX } from "icons";
import { Box, Button, Card, Flex, Grid, Heading, Link, Paragraph, Text } from "compositions";
import { Container, Row, Column } from "layout";

export default function Screen() {
  return (
    <Container>
      <Row gap="var(--sds-size-space-600)" padding="var(--sds-size-space-800)" alignItems="center">
        <Box>
          <Box>
            <Box>
              <IconStar size="24" />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box>
              <Button>Link 1</Button>
              <Button>Link 2</Button>
              <Button>Link 3</Button>
              <Button>Link 4</Button>
              <Button>Link 5</Button>
              <Button>Link 6</Button>
              <Button>Link 7</Button>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box>
              <Button>Button</Button>
              <Button variant="primary" iconEnd={<IconX />} label="Button" />
            </Box>
          </Box>
        </Box>
      </Row>
      <Box>
        <Box>
          <Box>
            <Box>
              <Text>Subtitle</Text>
              <Text>Title</Text>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box>
              <Button>Button</Button>
              <Button variant="primary" iconEnd={<IconX />} label="Button" />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box>
          <Box>
            <Box>
              <Text>Subheading</Text>
              <Text>Heading</Text>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box>
              <Card>
                <Text>Testimonial</Text>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
      <Row gap="var(--sds-size-space-400)" padding="var(--sds-size-space-800)" alignItems="center">
        <Box>
          <Box>
            <Box>
              <IconStar size="24" />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box>
              <Link>Link 1</Link>
              <Link>Link 2</Link>
              <Link>Link 3</Link>
              <Link>Link 4</Link>
              <Link>Link 5</Link>
              <Link>Link 6</Link>
              <Link>Link 7</Link>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box>
              <Text>Link 1</Text>
              <Text>Link 2</Text>
              <Text>Link 3</Text>
              <Text>Link 4</Text>
              <Text>Link 5</Text>
              <Text>Link 6</Text>
              <Text>Link 7</Text>
            </Box>
          </Box>
        </Box>
      </Row>
    </Container>
  );
}
