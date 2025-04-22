import PropTypes from "prop-types";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import { useState } from "react";

const MenuBar = ({ editor }) => {
  const [highlightColor, setHighlightColor] = useState("#ffff00"); // Default yellow

  if (!editor) return null;

  const applyHighlight = () => {
    editor.chain().focus().toggleHighlight({ color: highlightColor }).run();
  };

  const formattingButtons = [
    {
      title: "Bold",
      icon: <FormatBoldIcon fontSize="small" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      title: "Italic",
      icon: <FormatItalicIcon fontSize="small" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      title: "Underline",
      icon: <FormatUnderlinedIcon fontSize="small" />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      title: "Strikethrough",
      icon: <StrikethroughSIcon fontSize="small" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      title: "Highlight",
      icon: <FormatColorFillIcon fontSize="small" />,
      action: applyHighlight,
      isActive: editor.isActive("highlight"),
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
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {formattingButtons.map(({ title, icon, action, isActive }, i) => (
          <Tooltip key={i} title={title} arrow placement="top">
            <IconButton
              onClick={action}
              size="small"
              edge="start"
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
        ))}
        <Tooltip title="Pick highlight color" arrow placement="top">
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        </Tooltip>
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
