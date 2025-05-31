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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MenuBar from "./MenuBar";
import { debounce } from "lodash";

const createEditorStyles = (theme) => `
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
`;

const TiptapEditor = ({
  initialContent = null,
  showWordCount = true,
  showReadingTime = true,
  isError,
  onChange,
  readingTime,
}) => {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const theme = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  console.log("initialContent", initialContent);

  const editorStyles = useMemo(() => createEditorStyles(theme), [theme]);

  // Debounce onChange to prevent excessive updates
  const debouncedOnChange = useCallback(
    debounce((content, stats) => {
      onChange({ content, stats }); // Pass both content and stats
    }, 300),
    [onChange]
  );

  // Separate function to calculate stats to optimize editor update event
  const calculateStats = useCallback((text) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const time = Math.ceil(words / 200); // ~200 words/min read speed
    return { wordCount: words, readingTime: time };
  }, []);

  // Memoize extensions so they aren't recreated on every render
  const extensions = useMemo(
    () => [
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
    []
  );

  // 2) Prevent React re-renders on every ProseMirror transaction
  const editorProps = useMemo(
    () => ({
      attributes: { class: "tiptap-editor" },
      handleDOMEvents: {},
      shouldRerenderOnTransaction: false,
    }),
    []
  );

  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps,
    parseOptions: { preserveWhitespace: "full" },
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      const textContent = editor.getText();

      // Calculate stats synchronously (no debounce needed)
      const words = textContent.trim().split(/\s+/).filter(Boolean).length;
      const minutes = Math.ceil(words / 200);
      const stats = { words, minutes };

      // Immediately call the onChange callback with both content formats
      if (onChangeRef.current) {
        onChangeRef.current(jsonContent, stats);
      }
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, [editor]);

  // Editor update effect - optimize with refs to reduce unnecessary work
  // Update editor content when initialContent changes
  useEffect(() => {
    if (!editor || !initialContent) return;
    const currentContent = JSON.stringify(editor.getJSON());
    const newContent = JSON.stringify(initialContent);
    if (currentContent !== newContent) {
      editor.commands.setContent(initialContent, false);
    }
  }, [editor, initialContent, calculateStats]);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  if (!isMounted || !editor) return null;

  return (
    <>
      <Box
        sx={{
          border: `0.1px solid ${
            isError ? theme.palette.error.main : theme.palette.divider
          }`,

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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mr: 2 }}
              >
                {readingTime?.words}{" "}
                {readingTime?.words === 1 ? "word" : "words"}
              </Typography>
            )}
            {showReadingTime && (
              <Typography variant="caption" color="text.secondary">
                {readingTime?.minutes}{" "}
                {readingTime?.minutes === 1 ? "min" : "mins"} read
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

TiptapEditor.propTypes = {
  initialContent: PropTypes.object,
  showWordCount: PropTypes.bool,
  showReadingTime: PropTypes.bool,
  isError: PropTypes.bool,
  onChange: PropTypes.func,
  readingTime: PropTypes.object,
};

export default memo(TiptapEditor);
