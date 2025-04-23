import { Box, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
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
          icon: <Italic />,
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
