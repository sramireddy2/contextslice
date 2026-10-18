import React from 'react';
import { Box, Button, Flex, Heading, Image, Text } from 'primitives';
import { Layout, Hero, FeaturePanel, Footer } from 'compositions';
import { sdsIcons } from 'icons';
import { sdsImages } from 'images';

export default function Screen() {
  return (
    <Layout>
      <Hero
        title="Welcome to Simple Design System"
        subtitle="Empower your projects with a consistent and beautiful design language."
        image={sdsImages.heroImage}
        icon={sdsIcons.heroIcon}
      />
      <Flex direction="column" gap="var(--sds-size-space-400)">
        <FeaturePanel
          title="Responsive Design"
          description="Our components are designed to adapt to any screen size, ensuring a seamless user experience."
          icon={sdsIcons.responsiveIcon}
        />
        <FeaturePanel
          title="Accessibility"
          description="We prioritize accessibility, making sure our components are usable by everyone."
          icon={sdsIcons.accessibilityIcon}
        />
        <FeaturePanel
          title="Customization"
          description="Easily customize our components to fit your brand and design needs."
          icon={sdsIcons.customizationIcon}
        />
      </Flex>
      <Footer
        links={[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
          { label: 'Contact', href: '/contact' },
        ]}
        copyright="© 2023 Simple Design System. All rights reserved."
      />
    </Layout>
  );
}
