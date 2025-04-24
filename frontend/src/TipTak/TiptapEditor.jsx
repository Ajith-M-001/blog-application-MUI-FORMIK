import {
  // BubbleMenu,
  EditorContent,
  // FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Box, Divider, useTheme } from "@mui/material";
import { MenuBar } from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

const extensions = [
  StarterKit,
  Underline,
  Highlight.configure({
    multicolor: true,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    HTMLAttributes: {
      openOnClick: false,
      target: "_blank",
      rel: "noopener noreferrer",
    },
    validate: (href) => /^https?:\/\//.test(href), // Validate URLs
  }),
];

const content = "<p>Hello World!</p>";

const TiptapEditor = () => {
  const theme = useTheme();
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        style: "min-height: 150px; padding: 16px; outline: none;",
      },
    },
  });

  if (!editor) return null;

  console.log("Editor content:", editor.getHTML());
  console.log("Editor JSON:", editor.getJSON());
  const editorStyles = `
  .ProseMirror blockquote {
    border-left: 4px solid ${theme.palette.primary.main};
    margin: 16px 0;
    padding: 8px 16px;
    background-color: ${
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[100]
    };
    font-style: italic;
    border-radius: 4px;
  },
`;

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 0.5,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <style>{editorStyles}</style>
      <MenuBar editor={editor} />
      <Divider />

      <EditorContent editor={editor} />
      <Divider />
      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu> */}
      {/* <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
    </Box>
  );
};

export default TiptapEditor;
