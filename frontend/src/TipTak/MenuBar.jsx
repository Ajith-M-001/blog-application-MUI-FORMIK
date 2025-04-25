import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Palette,
  PaintBucket,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  SeparatorHorizontal,
  Code2,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const formattingButtons = [
    {
      label: "Text Formatting",
      buttons: [
        {
          title: "Bold",
          value: "bold",
          icon: <Bold size={20} />,
          action: (editor) => editor.chain().focus().toggleBold().run(),
          isActive: (editor) => editor.isActive("bold"),
        },
        {
          title: "Italic",
          value: "italic",
          icon: <Italic size={20} />,
          action: (editor) => editor.chain().focus().toggleItalic().run(),
          isActive: (editor) => editor.isActive("italic"),
        },
        {
          title: "Underline",
          value: "underline",
          icon: <Underline size={20} />,
          action: (editor) => editor.chain().focus().toggleUnderline().run(),
          isActive: (editor) => editor.isActive("underline"),
        },
        {
          title: "Strikethrough",
          value: "strike",
          icon: <Strikethrough size={20} />,
          action: (editor) => editor.chain().focus().toggleStrike().run(),
          isActive: (editor) => editor.isActive("strike"),
        },
        {
          title: "Highlight",
          value: "highlight",
          icon: <Highlighter size={20} />,
          action: (editor) => editor.chain().focus().toggleHighlight().run(),
          isActive: (editor) => editor.isActive("highlight"),
        },
        {
          title: "Text Color",
          value: "text-color",
          icon: <Palette size={20} />,
          action: (editor, event) =>
            handleOpenColorPicker(event, "text", editor),
          isActive: () => false,
        },
        {
          title: "Background Color",
          value: "bg-color",
          icon: <PaintBucket size={20} />,
          action: (editor, event) =>
            handleOpenColorPicker(event, "background", editor),
          isActive: () => false,
        },
      ],
    },
    {
      label: "Structural Elements",
      buttons: [
        {
          title: "Heading 1",
          value: "h1",
          icon: <Heading1 size={22} />,
          action: (editor) =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: (editor) => editor.isActive("heading", { level: 1 }),
        },
        {
          title: "Heading 2",
          value: "h2",
          icon: <Heading2 size={22} />,
          action: (editor) =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: (editor) => editor.isActive("heading", { level: 2 }),
        },
        {
          title: "Heading 3",
          value: "h3",
          icon: <Heading3 size={22} />,
          action: (editor) =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: (editor) => editor.isActive("heading", { level: 3 }),
        },
        {
          title: "Blockquote",
          value: "blockquote",
          icon: <Quote size={20} />,
          action: (editor) => editor.chain().focus().toggleBlockquote().run(),
          isActive: (editor) => editor.isActive("blockquote"),
        },
        {
          title: "Horizontal Rule",
          value: "hr",
          icon: <SeparatorHorizontal size={20} />,
          action: (editor) => editor.chain().focus().setHorizontalRule().run(),
          isActive: () => false,
        },
        {
          title: "Code Block",
          value: "code-block",
          icon: <Code2 size={20} />,
          action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
          isActive: (editor) => editor.isActive("codeBlock"),
        },
      ],
    },
  ];

  const handleOpenColorPicker = (event, type, editor) => {
    // Implement color picker logic here
    console.log(`Open ${type} color picker`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.paper",
        px: 1,
        py: 0.5,
        gap: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {formattingButtons.map((group, groupIndex) => (
        <React.Fragment key={group.label}>
          <ToggleButtonGroup
            value={group.buttons
              .filter((button) => button.isActive(editor))
              .map((button) => button.value)}
            aria-label={group.label}
            sx={{
              gap: 0.5,
              "& .MuiToggleButton-root": {
                padding: 0.5,
                border: "none",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  color: "primary.main",
                },
              },
            }}
          >
            {group.buttons.map((button) => (
              <Tooltip key={button.value} title={button.title} arrow>
                <ToggleButton
                  value={button.value}
                  aria-label={button.title}
                  onClick={(e) => button.action(editor, e)}
                  selected={button.isActive(editor)}
                >
                  {button.icon}
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>
          {groupIndex < formattingButtons.length - 1 && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 28, mx: 1 }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.shape({
    chain: PropTypes.func.isRequired,
    isActive: PropTypes.func.isRequired,
  }),
};

export default MenuBar;
