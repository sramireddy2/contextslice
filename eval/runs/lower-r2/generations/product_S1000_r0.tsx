import { Footer, Header, HeaderAuth } from "compositions";
import { Navigation, NavigationPill, TextLink, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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
      <div style={{ flex: 1, padding: "var(--sds-size-space-400)" }}>
        {/* Product Detail Content */}
        <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
          <div style={{ flex: 1 }}>
            <img src="/path/to/product-image.jpg" alt="Product" style={{ width: "100%", height: "auto" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "var(--sds-font-size-heading-400)" }}>Product Name</h1>
            <p style={{ fontSize: "var(--sds-font-size-body-300)" }}>Product Description</p>
            <p style={{ fontSize: "var(--sds-font-size-body-200)" }}>$99.99</p>
            <div style={{ display: "flex", gap: "var(--sds-size-space-200)" }}>
              <button style={{ padding: "var(--sds-size-space-100) var(--sds-size-space-200)", backgroundColor: "var(--sds-color-primary-500)", color: "white", border: "none", borderRadius: "var(--sds-size-radius-400)" }}>Add to Cart</button>
              <button style={{ padding: "var(--sds-size-space-100) var(--sds-size-space-200)", backgroundColor: "var(--sds-color-primary-500)", color: "white", border: "none", borderRadius: "var(--sds-size-radius-400)" }}>Buy Now</button>
            </div>
            <h2 style={{ fontSize: "var(--sds-font-size-heading-300)" }}>Options</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ fontSize: "var(--sds-font-size-body-200)" }}>Option 1</li>
              <li style={{ fontSize: "var(--sds-font-size-body-200)" }}>Option 2</li>
              <li style={{ fontSize: "var(--sds-font-size-body-200)" }}>Option 3</li>
            </ul>
          </div>
        </div>
        <h2 style={{ fontSize: "var(--sds-font-size-heading-300)" }}>Reviews</h2>
        <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
          <div style={{ flex: 1 }}>
            <img src="/path/to/reviewer-image.jpg" alt="Reviewer" style={{ width: "100%", height: "auto" }} />
            <p style={{ fontSize: "var(--sds-font-size-body-200)" }}>Reviewer Name</p>
            <p style={{ fontSize: "var(--sds-font-size-body-100)" }}>5/5 stars</p>
            <p style={{ fontSize: "var(--sds-font-size-body-200)" }}>Great product! Highly recommend.</p>
          </div>
          <div style={{ flex: 1 }}>
            <img src="/path/to/reviewer-image.jpg" alt="Reviewer" style={{ width: "100%", height: "auto" }} />
            <p style={{ fontSize: "var(--sds-font-size-body-200)" }}>Reviewer Name</p>
            <p style={{ fontSize: "var(--sds-font-size-body-100)" }}>4/5 stars</p>
            <p style={{ fontSize: "var(--sds-font-size-body-200)" }}>Good product, but could be better.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
