import React from 'react';
import { Footer, Header, HeaderAuth } from 'compositions';
import { Navigation, NavigationPill, TextLink, TextLinkList, TextListItem, TextStrong } from 'primitives';
import { images } from 'images';

export default function Screen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header>
        <Navigation direction="row">
          <NavigationPill isSelected>Products</NavigationPill>
          <NavigationPill>Solutions</NavigationPill>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill>Pricing</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </Navigation>
        <HeaderAuth />
      </Header>
      <div style={{ flex: 1, padding: 'var(--sds-size-space-400)' }}>
        <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
          <div style={{ flex: 1 }}>
            <img src={images.productImage} alt="Product" style={{ width: '100%', height: 'auto' }} />
            <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
              <div style={{ flex: 1 }}>
                <TextStrong style={{ fontSize: 'var(--sds-font-size-heading-400)' }}>Product Name</TextStrong>
                <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={images.starIcon} alt="Star" style={{ width: '24px', height: '24px' }} />
                    <span style={{ fontSize: 'var(--sds-font-size-body-400)' }}>4.5</span>
                  </div>
                  <span style={{ fontSize: 'var(--sds-font-size-body-400)' }}>100 reviews</span>
                </div>
                <div style={{ fontSize: 'var(--sds-font-size-body-400)' }}>Price: $99.99</div>
                <div style={{ fontSize: 'var(--sds-font-size-body-400)' }}>Available Options:</div>
                <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
                  <button style={{ padding: 'var(--sds-size-space-200) var(--sds-size-space-400)', border: '1px solid var(--sds-color-border-default-default)', borderRadius: 'var(--sds-size-radius-400)' }}>Option 1</button>
                  <button style={{ padding: 'var(--sds-size-space-200) var(--sds-size-space-400)', border: '1px solid var(--sds-color-border-default-default)', borderRadius: 'var(--sds-size-radius-400)' }}>Option 2</button>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <TextStrong style={{ fontSize: 'var(--sds-font-size-heading-400)' }}>Product Description</TextStrong>
                <div style={{ fontSize: 'var(--sds-font-size-body-400)' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <TextStrong style={{ fontSize: 'var(--sds-font-size-heading-400)' }}>Customer Reviews</TextStrong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sds-size-space-400)' }}>
              <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
                <img src={images.reviewImage1} alt="Review 1" style={{ width: '100%', height: 'auto' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sds-size-space-200)' }}>
                  <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
                    <img src={images.starIcon} alt="Star" style={{ width: '24px', height: '24px' }} />
                    <span style={{ fontSize: 'var(--sds-font-size-body-400)' }}>5.0</span>
                  </div>
                  <div style={{ fontSize: 'var(--sds-font-size-body-400)' }}>John Doe</div>
                  <div style={{ fontSize: 'var(--sds-font-size-body-400)' }}>This product is amazing! It works perfectly for my needs.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
                <img src={images.reviewImage2} alt="Review 2" style={{ width: '100%', height: 'auto' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sds-size-space-200)' }}>
                  <div style={{ display: 'flex', gap: 'var(--sds-size-space-400)' }}>
                    <img src={images.starIcon} alt="Star" style={{ width: '24px', height: '24px' }} />
                    <span style={{ fontSize: 'var(--sds-font-size-body-400)' }}>4.5</span>
                  </div>
                  <div style={{ fontSize: 'var(--sds-font-size-body-400)' }}>Jane Smith</div>
                  <div style={{ fontSize: 'var(--sds-font-size-body-400)' }}>Great product, but could use a few more features.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
