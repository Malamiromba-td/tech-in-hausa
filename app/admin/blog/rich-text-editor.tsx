
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type RichTextEditorProps = {
  initialContent?: JSONContent;
  onChange: (content: JSONContent) => void;
};

export default function RichTextEditor({
  initialContent,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: initialContent ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] px-4 py-4 text-sm leading-7 text-slate-800 outline-none",
        "aria-label": "Blog article content",
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[320px] animate-pulse rounded-xl bg-slate-100" />
    );
  }

  const buttonClass = (active = false) =>
    `rounded-lg border px-3 py-2 text-sm font-medium transition ${
      active
        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
    }`;

  /*function addLink() {
    const previousUrl = editor.getAttributes("link").href as
      | string
      | undefined;

    const url = window.prompt("Enter the link URL", previousUrl ?? "https://");

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      const parsed = new URL(url.trim());

      if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
        window.alert("Please use an HTTP, HTTPS, or email link.");
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: parsed.href, target: "_blank" })
        .run();
    } catch {
      window.alert("Please enter a valid URL, including https:// when needed.");
    }
  }*/

  
  function addLink() {
    const activeEditor = editor;
    if (!activeEditor) return;

    const previousUrl = activeEditor.getAttributes("link").href as
      | string
      | undefined;

    const url = window.prompt("Enter the link URL", previousUrl ?? "https://");

    if (url === null) return;

    if (!url.trim()) {
      activeEditor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();
      return;
    }

    try {
      const parsed = new URL(url.trim());

      if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
        window.alert("Please use an HTTP, HTTPS, or email link.");
        return;
      }

      activeEditor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: parsed.href, target: "_blank" })
        .run();
    } catch {
      window.alert("Please enter a valid URL, including https:// when needed.");
    }
  }


  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
        <button
          type="button"
          className={buttonClass(editor.isActive("bold"))}
          aria-pressed={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("italic"))}
          aria-pressed={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          aria-pressed={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Heading
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          aria-pressed={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          Subheading
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("bulletList"))}
          aria-pressed={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("orderedList"))}
          aria-pressed={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered list
        </button>

        <button
          type="button"
          className={buttonClass(editor.isActive("link"))}
          aria-pressed={editor.isActive("link")}
          onClick={addLink}
        >
          Link
        </button>

        <button
          type="button"
          className={buttonClass()}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          Clear formatting
        </button>
      </div>

      <EditorContent editor={editor} />

      <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
        Your formatting is preserved while you write. Remember to save your post.
      </div>
    </div>
  );
}
  
