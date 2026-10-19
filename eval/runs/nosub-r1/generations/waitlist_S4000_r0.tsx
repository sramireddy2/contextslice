import { IconStar, IconX } from "icons";
import { Button, InputField, TextContentTitle, FormNewsletter } from "compositions";
import { Flex, Box } from "primitives";
import { useNavigate } from "react-router-dom";

export default function Screen() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    navigate("/waitlist-confirmation");
  };

  return (
    <Flex direction="column" gap="var(--sds-size-space-800)" padding="var(--sds-size-space-4000) var(--sds-size-space-600) var(--sds-size-space-4000) var(--sds-size-space-600)" align="center" justify="center" width="100%" height="100%" backgroundColor="var(--sds-color-background-default-secondary)">
      <TextContentTitle align="center" hasSubtitle>
        <Text>Get early access</Text>
        <Text>Join our waitlist to be one of the first to try our new platform.</Text>
      </TextContentTitle>
      <FormNewsletter onSubmit={handleSubmit}>
        <InputField
          label="Email address"
          placeholder="you@example.com"
          type="email"
          required
        />
        <Button variant="primary" size="medium" type="submit">
          Submit
        </Button>
      </FormNewsletter>
    </Flex>
  );
}
