import {
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo,
  SeparatorHorizontal,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import PropTypes from "prop-types";
import React, { memo, Suspense, useState } from "react";

// Use React.lazy() for dialogs to reduce initial bundle size
const LinkDialog = React.lazy(() => import("./components/LinkDialog"));
const ImageUploadDialog = React.lazy(() =>
  import("./components/ImageUploadDialog")
);

// Pre-define button groups outside of component to prevent recreation on render
const formattingButtonGroups = [
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
  {
    label: "Lists & Indentation",
    buttons: [
      {
        title: "Bullet List",
        value: "bullet-list",
        icon: <List size={20} />,
        action: (editor) => editor.chain().focus().toggleBulletList().run(),
        isActive: (editor) => editor.isActive("bulletList"),
      },
      {
        title: "Numbered List",
        value: "ordered-list",
        icon: <ListOrdered size={20} />,
        action: (editor) => editor.chain().focus().toggleOrderedList().run(),
        isActive: (editor) => editor.isActive("orderedList"),
      },
    ],
  },
  {
    label: "Alignment & Layout",
    buttons: [
      {
        title: "Align Left",
        value: "align-left",
        icon: <AlignLeft size={20} />,
        action: (editor) => editor.chain().focus().setTextAlign("left").run(),
        isActive: (editor) => editor.isActive({ textAlign: "left" }),
      },
      {
        title: "Align Center",
        value: "align-center",
        icon: <AlignCenter size={20} />,
        action: (editor) => editor.chain().focus().setTextAlign("center").run(),
        isActive: (editor) => editor.isActive({ textAlign: "center" }),
      },
      {
        title: "Align Right",
        value: "align-right",
        icon: <AlignRight size={20} />,
        action: (editor) => editor.chain().focus().setTextAlign("right").run(),
        isActive: (editor) => editor.isActive({ textAlign: "right" }),
      },
    ],
  },
  {
    label: "Media",
    buttons: [
      {
        title: "Insert Link",
        value: "link",
        icon: <Link size={20} />,
        action: () => {}, // Will be overridden in component
        isActive: (editor) => editor.isActive("link"),
      },
      {
        title: "Insert Image",
        value: "image",
        icon: <ImageIcon size={20} />,
        action: () => {}, // Will be overridden in component
        isActive: (editor) => editor.isActive("image"),
      },
    ],
  },
  {
    label: "History",
    buttons: [
      {
        title: "Undo",
        value: "undo",
        icon: <Undo size={20} />,
        action: (editor) => editor.chain().focus().undo().run(),
        disabled: (editor) => !editor.can().undo(),
        isActive: () => false,
      },
      {
        title: "Redo",
        value: "redo",
        icon: <Redo size={20} />,
        action: (editor) => editor.chain().focus().redo().run(),
        disabled: (editor) => !editor.can().redo(),
        isActive: () => false,
      },
    ],
  },
];

// Memoize the toggle button styles
const toggleButtonSx = {
  gap: 0.2,
  "& .MuiToggleButton-root": {
    padding: 1,
    border: "none",
    "&:hover": {
      backgroundColor: "action.hover",
    },
    "&.Mui-selected": {
      backgroundColor: "action.selected",
      color: "primary.main",
    },
    "&.Mui-disabled": {
      border: "none",
      color: "text.disabled",
    },
  },
};

// Create memoized button components
const EditorButton = memo(({ button, editor, customAction }) => {
  const handleClick = () => {
    if (customAction) {
      customAction();
    } else {
      button.action(editor);
    }
  };

  return (
    <Tooltip title={button.title} arrow placement="top">
      <span>
        <ToggleButton
          value={button.value}
          aria-label={button.title}
          onClick={handleClick}
          selected={button.isActive(editor)}
          disabled={button.disabled ? button.disabled(editor) : false}
        >
          {button.icon}
        </ToggleButton>
      </span>
    </Tooltip>
  );
});

EditorButton.propTypes = {
  button: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  customAction: PropTypes.func,
};

EditorButton.displayName = "EditorButton";

// Create memoized button group component
const ButtonGroup = memo(({ group, editor, customActions }) => {
  const activeValues = group.buttons
    .filter((button) => button.isActive(editor))
    .map((button) => button.value);

  return (
    <ToggleButtonGroup
      value={activeValues}
      aria-label={group.label}
      sx={toggleButtonSx}
    >
      {group.buttons.map((button) => (
        <EditorButton
          key={`${group.label}-${button.value}`}
          button={button}
          editor={editor}
          customAction={
            button.value === "link"
              ? customActions.handleOpenLinkDialog
              : button.value === "image"
              ? customActions.handleOpenImageDialog
              : null
          }
        />
      ))}
    </ToggleButtonGroup>
  );
});

ButtonGroup.propTypes = {
  group: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  customActions: PropTypes.object.isRequired,
};

ButtonGroup.displayName = "ButtonGroup";

const MenuBar = memo(({ editor }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  if (!editor) return null;

  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
  };

  const handleSaveLink = () => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      const finalUrl = linkUrl.startsWith("http")
        ? linkUrl
        : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: finalUrl }).run();
    }
    handleCloseLinkDialog();
  };

  const handleOpenLinkDialog = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setLinkDialogOpen(true);
  };

  const handleOpenImageDialog = () => {
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };

  const customActions = {
    handleOpenLinkDialog,
    handleOpenImageDialog,
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
        flexWrap: "wrap",
      }}
    >
      {formattingButtonGroups.map((group, groupIndex) => (
        <React.Fragment key={group.label}>
          <ButtonGroup
            group={group}
            editor={editor}
            customActions={customActions}
          />
          {groupIndex < formattingButtonGroups.length - 1 && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 28, mx: 1 }}
            />
          )}
        </React.Fragment>
      ))}

      <Suspense fallback={<div>Loading...</div>}>
        {linkDialogOpen && (
          <LinkDialog
            editor={editor}
            open={linkDialogOpen}
            onClose={handleCloseLinkDialog}
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            handleSaveLink={handleSaveLink}
          />
        )}

        {imageDialogOpen && (
          <ImageUploadDialog
            open={imageDialogOpen}
            onClose={handleCloseImageDialog}
            editor={editor}
          />
        )}
      </Suspense>
    </Box>
  );
});

MenuBar.propTypes = {
  editor: PropTypes.shape({
    chain: PropTypes.func.isRequired,
    isActive: PropTypes.func.isRequired,
    getAttributes: PropTypes.func.isRequired,
    can: PropTypes.func.isRequired,
    focus: PropTypes.func.isRequired,
  }),
};

MenuBar.displayName = "MenuBar";

export default MenuBar;
