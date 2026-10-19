import { Box, Button, Form, Input, Textarea, Text } from 'primitives';
import { Flex, Grid } from 'layout';
import { Icon } from 'icons';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Flex direction="column" gap={theme.size.space[800]} padding={theme.size.space[600]} width="100%">
      <Box
        direction="row"
        gap={theme.size.space[600]}
        padding={theme.size.space[800]}
        width="100%"
        backgroundColor={theme.color.background.default.secondary}
        borderRadius={theme.size.radius[200]}
        border={`1px solid ${theme.color.border.default.default}`}
      >
        <Box direction="row" gap={24} align="center">
          <Box width={40} height="auto">
            <Icon name="figma" width={23.33} height={35} stroke={theme.color.icon.default.default} stroke-width={3.5} />
          </Box>
        </Box>
        <Box direction="row" wrap="wrap" gap={theme.size.space[200]} align="max/min" width="100%">
          {/* Navigation Pill List */}
        </Box>
        <Box direction="row" gap={theme.size.space[300]} align="min/center" width={178} height="auto">
          {/* Header Auth */}
        </Box>
      </Box>
      <Box
        direction="column"
        gap={theme.size.space[800]}
        padding={theme.size.space[600]}
        width="100%"
        backgroundColor={theme.color.background.default.secondary}
        borderRadius={theme.size.radius[200]}
        border={`1px solid ${theme.color.border.default.default}`}
      >
        <Box
          direction="column"
          gap={theme.size.space[200]}
          align="min/center"
          width="100%"
        >
          <Text weight="Title Hero" color={theme.color.text.brand.onBrand.tertiary}>
            Title
          </Text>
          <Text weight="Subtitle" color={theme.color.text.brand.onBrand.tertiary}>
            Subtitle
          </Text>
        </Box>
        <Form
          direction="column"
          gap={theme.size.space[600]}
          padding={theme.size.space[600]}
          width="100%"
          backgroundColor={theme.color.background.default.default}
          borderRadius={theme.size.radius[200]}
          border={`1px solid ${theme.color.border.default.default}`}
        >
          <Input
            label="Name"
            placeholder="Value"
            description="Description"
            error="Error"
            hasError={false}
            hasLabel={true}
            state="default"
            valueType="placeholder"
            direction="column"
            gap={theme.size.space[200]}
            width="100%"
            height="auto"
          />
          <Input
            label="Surname"
            placeholder="Value"
            description="Description"
            error="Error"
            hasError={false}
            hasLabel={true}
            state="default"
            valueType="placeholder"
            direction="column"
            gap={theme.size.space[200]}
            width="100%"
            height="auto"
          />
          <Input
            label="Email"
            placeholder="Value"
            description="Description"
            error="Error"
            hasError={false}
            hasLabel={true}
            state="default"
            valueType="placeholder"
            direction="column"
            gap={theme.size.space[200]}
            width="100%"
            height="auto"
          />
          <Textarea
            label="Message"
            placeholder="Value"
            description="Description"
            error="Hint"
            hasError={false}
            hasLabel={true}
            state="default"
            valueType="placeholder"
            direction="column"
            gap={theme.size.space[200]}
            width="100%"
            height="auto"
          />
          <Box
            direction="row"
            gap={theme.size.space[400]}
            align="min/center"
            width="100%"
          >
            <Button>Submit</Button>
          </Box>
        </Form>
      </Box>
      <Box
        direction="row"
        gap={theme.size.space[400]}
        padding={theme.size.space[800]}
        width="100%"
        backgroundColor={theme.color.background.default.default}
        border={`1px solid ${theme.color.border.default.default}`}
      >
        <Box
          direction="column"
          gap={theme.size.space[600]}
          width={262}
          height="auto"
        >
          <Box direction="row" align="center">
            <Box width={40} height="auto">
              <Icon name="figma" width={23.33} height={35} stroke={theme.color.icon.default.default} stroke-width={3.5} />
            </Box>
          </Box>
          <Box direction="row" gap={theme.size.space[400]} align="min/center" width="100%">
            {/* Button List */}
          </Box>
        </Box>
        <Box direction="row" gap={16} align="min/center" width="100%">
          {/* Text Link List */}
          {/* Text Link List */}
          {/* Text Link List */}
        </Box>
      </Box>
    </Flex>
  );
}
