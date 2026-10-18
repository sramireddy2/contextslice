import { Footer, Header, Hero } from "compositions";
import { TextContentTitle, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh" }}>
      <Header />
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
      </Hero>
      <div style={{ padding: "var(--sds-size-space-400)" }}>
        <TextContentTitle align="left" title="Article Title" />
        <p style={{ color: "var(--sds-color-slate-700)", fontSize: "var(--sds-size-type-100)" }}>
          This is the body text of the article. It provides detailed information and insights on the topic.
        </p>
      </div>
      <div style={{ display: "flex", gap: "var(--sds-size-space-400)" }}>
        <div style={{ flex: 1 }}>
          <TextContentTitle align="left" title="Related Cards" />
          <TextLinkList density="default">
            <TextStrong>Use cases</TextStrong>
            <TextListItem>UI design</TextListItem>
            <TextListItem>UX design</TextListItem>
            <TextListItem>Wireframing</TextListItem>
            <TextListItem>Diagramming</TextListItem>
            <TextListItem>Brainstorming</TextListItem>
            <TextListItem>Online whiteboard</TextListItem>
            <TextListItem>Team collaboration</TextListItem>
          </TextLinkList>
        </div>
        <div style={{ flex: 1 }}>
          <TextContentTitle align="left" title="Explore" />
          <TextLinkList density="default">
            <TextStrong>Explore</TextStrong>
            <TextListItem>Design</TextListItem>
            <TextListItem>Prototyping</TextListItem>
            <TextListItem>Development features</TextListItem>
            <TextListItem>Design systems</TextListItem>
            <TextListItem>Collaboration features</TextListItem>
            <TextListItem>Design process</TextListItem>
            <TextListItem>FigJam</TextListItem>
          </TextLinkList>
        </div>
        <div style={{ flex: 1 }}>
          <TextContentTitle align="left" title="Resources" />
          <TextLinkList density="default">
            <TextStrong>Resources</TextStrong>
            <TextListItem>Blog</TextListItem>
            <TextListItem>Best practices</TextListItem>
            <TextListItem>Colors</TextListItem>
            <TextListItem>Color wheel</TextListItem>
            <TextListItem>Support</TextListItem>
            <TextListItem>Developers</TextListItem>
            <TextListItem>Resource library</TextListItem>
          </TextLinkList>
        </div>
      </div>
      <Footer />
    </div>
  );
}
