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

const extensions = [
  StarterKit,
  Underline,
  Highlight.configure({
    multicolor: true,
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

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 0.5,
        padding: 0,
        overflow: "hidden",
      }}
    >
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
