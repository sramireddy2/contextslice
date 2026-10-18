import { Footer, Header, Hero } from "compositions";
import { TextContentTitle, TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh" }}>
      <Header />
      <Hero variant="subtle">
        <TextContentTitle align="center" title="Title" subtitle="Subtitle" />
      </Hero>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-400)", padding: "var(--sds-size-space-400)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-400)", backgroundColor: "var(--sds-color-slate-200)" }}>
          <Footer />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sds-size-space-400)" }}>
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
    </div>
  );
}
