
type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

type TiptapNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: TiptapMark[];
  content?: TiptapNode[];
};

type PortableSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type PortableBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: Array<Record<string, unknown>>;
  children: PortableSpan[];
  listItem?: "bullet" | "number";
  level?: number;
};

function makeKey() {
  return Math.random().toString(36).slice(2, 12);
}

function getMarks(marks: TiptapMark[] = [], markDefs: Array<Record<string, unknown>>) {
  return marks.map((mark) => {
    if (mark.type === "bold") return "strong";
    if (mark.type === "italic") return "em";
    if (mark.type === "strike") return "strike";

    if (mark.type === "link") {
      const key = makeKey();
      markDefs.push({
        _key: key,
        _type: "link",
        href: String(mark.attrs?.href ?? ""),
        blank: mark.attrs?.target === "_blank",
      });
      return key;
    }

    return "";
  }).filter(Boolean);
}

export function tiptapToPortableText(
  document: TiptapNode,
): PortableBlock[] {
  const blocks: PortableBlock[] = [];

  function visit(nodes: TiptapNode[] = [], listType?: "bullet" | "number", level = 1) {
    for (const node of nodes) {
      if (node.type === "bulletList" || node.type === "orderedList") {
        visit(
          node.content,
          node.type === "bulletList" ? "bullet" : "number",
          level,
        );
        continue;
      }

      if (node.type === "listItem") {
        visit(node.content, listType, level);
        continue;
      }

      if (node.type === "paragraph" || node.type === "heading") {
        const markDefs: Array<Record<string, unknown>> = [];
        const children: PortableSpan[] = [];

        function collectSpans(items: TiptapNode[] = []) {
          for (const item of items) {
            if (item.type === "text") {
              children.push({
                _type: "span",
                _key: makeKey(),
                text: item.text ?? "",
                marks: getMarks(item.marks, markDefs),
              });
            } else if (item.type === "hardBreak") {
              children.push({
                _type: "span",
                _key: makeKey(),
                text: "\n",
                marks: [],
              });
            } else if (item.content) {
              collectSpans(item.content);
            }
          }
        }

        collectSpans(node.content);

        blocks.push({
          _type: "block",
          _key: makeKey(),
          style:
            node.type === "heading"
              ? `h${Number(node.attrs?.level ?? 2)}`
              : "normal",
          markDefs,
          children,
          ...(listType ? { listItem: listType, level } : {}),
        });
      }
    }
  }

  visit(document.content);
  return blocks;
}

export function portableTextToTiptap(
  blocks: PortableBlock[],
): TiptapNode {
  return {
    type: "doc",
    content: blocks.map((block) => {
      const content: TiptapNode[] = (block.children ?? []).map((span) => ({
        type: "text",
        text: span.text,
        marks: (span.marks ?? []).flatMap((mark): TiptapMark[] => {
          if (mark === "strong") return [{ type: "bold" }];
          if (mark === "em") return [{ type: "italic" }];
          if (mark === "strike") return [{ type: "strike" }];

          const definition = block.markDefs?.find(
            (item) => item._key === mark && item._type === "link",
          );

          if (definition) {
            return [{
              type: "link",
              attrs: {
                href: String(definition.href ?? ""),
                target: definition.blank ? "_blank" : null,
              },
            }];
          }

          return [];
        }),
      }));

      if (block.listItem) {
        return {
          type: "paragraph",
          content,
        };
      }

      if (block.style?.startsWith("h")) {
        return {
          type: "heading",
          attrs: { level: Number(block.style.slice(1)) || 2 },
          content,
        };
      }

      return { type: "paragraph", content };
    }),
  };
          }

