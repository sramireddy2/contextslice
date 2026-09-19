import { Footer } from "compositions";
import { Header } from "compositions";
import { Hero } from "compositions";
import { Panel } from "compositions";
import { Section } from "layout";
import { placeholder } from "images";
import { Image } from "primitives";
import { TextContentTitle } from "primitives";
import { TextLinkList, TextListItem, TextStrong } from "primitives";

export default function Screen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh" }}>
      <Header />
      <Hero variant="subtle">
        <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
      </Hero>
      <Section padding="var(--sds-size-space-400)">
        <Panel gap="var(--sds-size-space-400)" type="half">
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
          <Image src={placeholder} alt="Always use image alt" aspectRatio="4-3" size="medium" />
        </Panel>
      </Section>
      <Footer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLinkList title="Use cases" density="default">
              <TextStrong text="Use cases" />
              <TextListItem text="UI design" />
              <TextListItem text="UX design" />
              <TextListItem text="Wireframing" />
              <TextListItem text="Diagramming" />
              <TextListItem text="Brainstorming" />
              <TextListItem text="Online whiteboard" />
              <TextListItem text="Team collaboration" />
            </TextLinkList>
          </div>
          <div style={{ marginRight: "var(--sds-size-space-400)" }}>
            <TextLinkList title="Explore" density="default">
              <TextStrong text="Explore" />
              <TextListItem text="Design" />
              <TextListItem text="Prototyping" />
              <TextListItem text="Development features" />
              <TextListItem text="Design systems" />
              <TextListItem text="Collaboration features" />
              <TextListItem text="Design process" />
              <TextListItem text="FigJam" />
            </TextLinkList>
          </div>
          <div>
            <TextLinkList title="Resources" density="default">
              <TextStrong text="Resources" />
              <TextListItem text="Blog" />
              <TextListItem text="Best practices" />
              <TextListItem text="Colors" />
              <TextListItem text="Color wheel" />
              <TextListItem text="Support" />
              <TextListItem text="Developers" />
              <TextListItem text="Resource library" />
            </TextLinkList>
          </div>
        </div>
      </Footer>
    </div>
  );
}
