// src/TiptapEditor.jsx
import {
  useEditor,
  EditorContent,
  // FloatingMenu,
  // BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import MenuBar from "./MenuBar";

const editorStyles = `
  .tiptap-editor {
    min-height: 150px;
    padding: 16px;
    outline: none;
  }

  .tiptap-editor p.is-empty::before {
    content: attr(data-placeholder);
    float: left;
    color: #888;
    pointer-events: none;
    height: 0;
  }
`;

const TiptapEditor = ({
  initialContent = "",
  showWordCount = true,
  showReadingTime = true,
}) => {
  const theme = useTheme();
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your blog...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!editor) return;

    const updateStats = () => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const time = Math.ceil(words / 200); // ~200 words/min read speed
      setWordCount(words);
      setReadingTime(time);
    };

    updateStats();
    editor.on("update", updateStats);

    return () => {
      editor.off("update", updateStats);
    };
  }, [editor]);

  if (!isMounted || !editor) return null;

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <style>{editorStyles}</style>
      <MenuBar editor={editor} />

      <Divider />
      <EditorContent editor={editor} />
      <Divider />

      {(showWordCount || showReadingTime) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 1,
            bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
          }}
        >
          {showWordCount && (
            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </Typography>
          )}
          {showReadingTime && (
            <Typography variant="caption" color="text.secondary">
              {readingTime} {readingTime === 1 ? "min" : "mins"} read
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TiptapEditor;
