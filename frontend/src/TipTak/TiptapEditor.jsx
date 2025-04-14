// components/RichTextEditor.jsx
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Box, IconButton, Stack } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  InsertPhoto,
  Title,
} from "@mui/icons-material";

const TiptapEditor = ({
  initialContent = "",
  onContentChange,
  minimal = false,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true })],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onContentChange && onContentChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      {!minimal && (
        <Stack direction="row" gap={1} sx={{ mb: 2 }}>
          <IconButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            color={
              editor.isActive("heading", { level: 1 }) ? "primary" : "default"
            }
          >
            <Title />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive("bold") ? "primary" : "default"}
          >
            <FormatBold />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive("italic") ? "primary" : "default"}
          >
            <FormatItalic />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive("bulletList") ? "primary" : "default"}
          >
            <FormatListBulleted />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color={editor.isActive("orderedList") ? "primary" : "default"}
          >
            <FormatListNumbered />
          </IconButton>
          <IconButton
            onClick={() => {
              const url = prompt("Enter image URL");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
          >
            <InsertPhoto />
          </IconButton>
        </Stack>
      )}

      {editor && (
        <BubbleMenu editor={editor}>
          <Stack
            direction="row"
            sx={{ bgcolor: "background.paper", p: 1, boxShadow: 1 }}
          >
            <IconButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              color={editor.isActive("bold") ? "primary" : "default"}
            >
              <FormatBold />
            </IconButton>
            <IconButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              color={editor.isActive("italic") ? "primary" : "default"}
            >
              <FormatItalic />
            </IconButton>
          </Stack>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </Box>
  );
};

export default TiptapEditor;
