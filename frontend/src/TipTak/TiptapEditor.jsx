// src/TiptapEditor.jsx
import { Box, Divider, Typography, useTheme } from "@mui/material";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PropTypes from "prop-types";
import { memo, useEffect, useMemo, useState } from "react";
import { useBlogActions } from "../store/zustand.store";
import MenuBar from "./MenuBar";

const TiptapEditor = ({
  initialContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [],
      },
    ],
  },
  showWordCount = true,
  showReadingTime = true,
}) => {
  const theme = useTheme();
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  console.log("initialContent", initialContent);

  const { setBlogData } = useBlogActions();

  const editorStyles = useMemo(
    () => `
  .tiptap-editor {
    min-height: 150px;
    padding: 16px;
    outline: none;
  }

   .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: ${theme.palette.text.disabled};
      pointer-events: none;
      height: 0;
    }

  .tiptap-editor p.is-empty::before {
    content: attr(data-placeholder);
    float: left;
    color: #888;
    pointer-events: none;
    height: 0;
  }

  .ProseMirror {
    font-family: ${theme.typography.fontFamily};
    color: ${theme.palette.text.primary};
  }

  .ProseMirror h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 1em 0 0.5em;
  }

  .ProseMirror h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.75em 0 0.4em;
  }

  .ProseMirror h3 {
    font-size: 1.25em;
    font-weight: bold;
    margin: 0.6em 0 0.3em;
  }

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
    }

     .ProseMirror hr {
      border: none;
      border-top: 2px solid ${theme.palette.divider};
      margin: 16px 0;
    }
    
.ProseMirror pre {
      background-color: ${
        theme.palette.mode === "dark"
          ? theme.palette.grey[900]
          : theme.palette.grey[200]
      };
      border-radius: 4px;
      padding: 8px 12px;
      overflow-x: auto;
      font-family: monospace;
    }
    
    .ProseMirror ul, .ProseMirror ol {
      padding-left: 24px;
    }

    .ProseMirror a {
      color: ${theme.palette.primary.main};
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.2s ease;
    }

     .ProseMirror img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  height: auto;
}
`,
    [theme]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Image.configure({
        HTMLAttributes: {
          class: "rich-text-image",
          loading: "lazy",
        },
      }),
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Highlight.configure({ multicolor: true }),
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

    const updateStatsAndContent = () => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const time = Math.ceil(words / 200); // ~200 words/min read speed

      setWordCount(words);
      setReadingTime(time);

      setBlogData({
        content: editor.getJSON(),
        readingTime: {
          minutes: time,
          words: words,
        },
      });
    };

    updateStatsAndContent();
    editor.on("update", updateStatsAndContent);

    return () => {
      editor.off("update", updateStatsAndContent);
    };
  }, [editor, setBlogData]);

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

TiptapEditor.propTypes = {
  initialContent: PropTypes.object,
  showWordCount: PropTypes.bool,
  showReadingTime: PropTypes.bool,
};

export default memo(TiptapEditor);
