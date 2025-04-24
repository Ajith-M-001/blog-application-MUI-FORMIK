import { Box, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  SeparatorHorizontal,
  Strikethrough,
  Underline,
} from "lucide-react";
import PropTypes from "prop-types";
import React from "react";

const MenuBar = ({ editor }) => {
  const highlightColor = "#ffff00"; // Default yellow

  const createButton = ({ title, icon, action, isActive }) => (
    <Tooltip key={title} title={title} arrow placement="top">
      <IconButton
        onClick={action}
        size="small"
        sx={{
          borderRadius: "4px",
          color: isActive ? "primary.main" : "text.secondary",
          backgroundColor: isActive ? "action.selected" : "transparent",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  if (!editor) return null;

  const applyHighlight = () => {
    editor.chain().focus().toggleHighlight({ color: highlightColor }).run();
  };

  const formattingButtons = [
    {
      label: "Text Formatting",
      buttons: [
        {
          title: "Bold",
          icon: <Bold size={20} />,
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive("bold"),
        },
        {
          title: "Italic",
          icon: <Italic size={20} />,
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive("italic"),
        },
        {
          title: "Underline",
          icon: <Underline size={20} />,
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive("underline"),
        },
        {
          title: "Strikethrough",
          icon: <Strikethrough size={20} />,
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive("strike"),
        },
        {
          title: "Highlight",
          icon: <Highlighter size={20} />,
          action: applyHighlight,
          isActive: editor.isActive("highlight"),
        },
      ],
    },
    {
      label: "Structural Elements",
      buttons: [
        {
          title: "Heading 1",
          icon: <Heading1 size={22} />,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: editor.isActive("heading", { level: 1 }),
        },
        {
          title: "Heading 2",
          icon: <Heading2 size={22} />,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: editor.isActive("heading", { level: 2 }),
        },
        {
          title: "Heading 3",
          icon: <Heading3 size={22} />,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: editor.isActive("heading", { level: 3 }),
        },
        {
          title: "Blockquote",
          icon: <Quote size={20} />, // Using Quote icon for blockquotes
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive("blockquote"),
        },
        {
          title: "Horizontal Rule",
          icon: <SeparatorHorizontal size={20} />,
          action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
          title: "Code Block",
          icon: <Code2 size={20} />,
          action: () => editor.chain().focus().toggleCodeBlock().run(),
          isActive: editor.isActive("codeBlock"),
        },
      ],
    },
    {
      label: "Lists & Indentation",
      buttons: [
        {
          title: "Bullet List",
          icon: <List size={20} />,
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive("bulletList"),
        },
        {
          title: "Numbered List",
          icon: <ListOrdered size={20} />,
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive("orderedList"),
        },
      ],
    },
    {
      label: "Alignment & Layout",
      buttons: [
        {
          title: "Align Left",
          icon: <AlignLeft size={20} />,
          action: () => editor.chain().focus().setTextAlign("left").run(),
          isActive: editor.isActive({ textAlign: "left" }), // Direct boolean check
        },
        {
          title: "Align Center",
          icon: <AlignCenter size={20} />,
          action: () => editor.chain().focus().setTextAlign("center").run(),
          isActive: editor.isActive({ textAlign: "center" }),
        },
        {
          title: "Align Right",
          icon: <AlignRight size={20} />,
          action: () => editor.chain().focus().setTextAlign("right").run(),
          isActive: editor.isActive({ textAlign: "right" }),
        },
        {
          title: "Justify",
          icon: <AlignJustify size={20} />,
          action: () => editor.chain().focus().setTextAlign("justify").run(),
          isActive: editor.isActive({ textAlign: "justify" }),
        },
      ],
    },
    {
      label: "links and images",
      buttons: [
        {
          title: "Insert Link",
          icon: <Link size={20} />,
          action: () => {
            // Get the current link attributes if a link is selected
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("URL", previousUrl);

            // If user cancels prompt or clears the URL
            if (url === null) {
              return;
            }

            // If URL is empty, unset the link
            if (url === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }

            // Prepend 'https://' if missing
            const finalUrl = url.startsWith("http") ? url : `https://${url}`;

            editor.chain().focus().toggleLink({ href: finalUrl }).run();
          },
          isActive: editor.isActive("link"),
        },
        {
          title: "Insert Image",
          icon: <Image />,
          action: () =>
            editor
              .chain()
              .focus()
              .setImage({ src: "https://example.com/image.jpg" })
              .run(),
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        padding: 2,
        overflowX: "auto",
        backgroundColor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center">
        {formattingButtons.map((group, index) => (
          <React.Fragment key={group.label}>
            {group.buttons.map(createButton)}
            {index < formattingButtons.length - 1 && (
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.shape({
    chain: PropTypes.func.isRequired,
    isActive: PropTypes.func.isRequired,
  }),
};

export { MenuBar };
