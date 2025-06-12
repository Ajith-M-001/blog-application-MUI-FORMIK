import { Box, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import { UserCard } from "./UserCard";
import { useMemo } from "react";
import { useBlogData } from "../../../shared/store/blogStore";
import cld from "../../../lib/claudinary";
import {
  AdvancedImage,
  lazyload,
  responsive,
  placeholder,
} from "@cloudinary/react";
import BlogActionsBar from "./UI/BlogActionsBar";
import PropTypes from "prop-types";

const BlogContent = () => {
  const theme = useTheme();

  const blog = useBlogData();

  const renderContent = useMemo(() => {
    if (!blog?.content?.content) return null;

    return blog.content.content.map((element, index) => {
      console.log(element, "element");
      switch (element.type) {
        case "paragraph":
          return (
            <Typography
              key={index}
              sx={{
                mb: 2,
                lineHeight: 1.6,
                textAlign: element.attrs?.textAlign || "justify",
                "& a": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
            >
              {element?.content?.map((textElement, textIndex) => {
                if (textElement.type === "text") {
                  let textComponent = textElement.text;
                  if (textElement.marks) {
                    textElement.marks.forEach((mark) => {
                      switch (mark.type) {
                        case "bold":
                          textComponent = (
                            <strong key={textIndex}>{textComponent}</strong>
                          );
                          break;
                        case "italic":
                          textComponent = (
                            <em key={textIndex}>{textComponent}</em>
                          );
                          break;
                        case "underline":
                          textComponent = (
                            <u key={textIndex}>{textComponent}</u>
                          );
                          break;
                        case "code":
                          textComponent = (
                            <code key={textIndex}>{textComponent}</code>
                          );
                          break;
                        case "link":
                          textComponent = (
                            <a
                              key={textIndex}
                              href={mark.attrs.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {textComponent}
                            </a>
                          );
                          break;
                        case "highlight":
                          textComponent = (
                            <span
                              key={textIndex}
                              style={{
                                backgroundColor: mark.attrs?.color || "#ffff00", // fallback to yellow
                                padding: "2px 4px",
                                borderRadius: "4px",
                                color: "#000",
                              }}
                            >
                              {textComponent}
                            </span>
                          );
                          break;

                        default:
                          break;
                      }
                    });
                  }

                  return textComponent;
                }
                return null;
              })}
            </Typography>
          );
        case "heading": {
          const variant = `h${element.attrs.level}`;
          return (
            <Typography
              key={index}
              variant={variant}
              sx={{
                mt: 4,
                mb: 2,
                fontWeight: 700,
                textAlign: element.attrs?.textAlign || "left",
                ...(element.attrs.level === 3 && { color: "text.secondary" }),
              }}
            >
              {element.content?.[0]?.text}
            </Typography>
          );
        }

        case "image":
          return (
            <Box
              key={index}
              component="img"
              src={element.attrs.src}
              sx={{
                maxWidth: "100%",
                height: "auto",
                my: 4,
                borderRadius: "8px",
                boxShadow: 3,
              }}
            />
          );

        case "bulletList":
          return (
            <Box component="ul" key={index} sx={{ pl: 4, mb: 3 }}>
              {element.content?.map((item, i) => (
                <li key={i}>
                  {item.content?.map((para, j) => (
                    <Typography key={j} variant="body1" sx={{ mb: 1 }}>
                      {para.content?.map((c) => c.text).join("")}
                    </Typography>
                  ))}
                </li>
              ))}
            </Box>
          );

        case "orderedList":
          return (
            <Box component="ol" key={index} sx={{ pl: 4, mb: 3 }}>
              {element.content?.map((item, i) => (
                <li key={i}>
                  {item.content?.map((para, j) => (
                    <Typography key={j} variant="body1" sx={{ mb: 1 }}>
                      {para.content?.map((c) => c.text).join("")}
                    </Typography>
                  ))}
                </li>
              ))}
            </Box>
          );

        case "horizontalRule":
          return <Divider key={index} sx={{ my: 4 }} />;

        case "blockquote":
          return (
            <Box
              key={index}
              sx={{
                borderLeft: "4px solid",
                borderColor: "divider",
                p: 3,
                my: 3,
                fontStyle: "italic",
                color: "text.secondary",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {element.content?.[0]?.content?.[0]?.text}
            </Box>
          );

        case "codeBlock":
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: theme.palette.background.card,
                p: 2,
                borderRadius: 1,
                mb: 3,
                overflowX: "auto",
                fontFamily: "monospace",
              }}
            >
              <pre style={{ margin: 0 }}>
                <code>{element.content?.map((c) => c.text).join("")}</code>
              </pre>
            </Box>
          );

        default:
          return null;
      }
    });
  }, [blog?.content?.content, theme?.palette?.mode]);

  const image = cld
    .image(blog?.coverImage?.public_id)
    .quality("auto:low")
    .format("auto");

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <>
        <Typography variant="h1" component="h1">
          {blog?.title}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          {blog?.description}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Chip label={blog.category?.name} />
        </Stack>

        {blog?.coverImage?.url && (
          <AdvancedImage
            cldImg={image}
            plugins={[lazyload(), responsive(), placeholder("blur")]}
            style={{
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "cover",
              borderRadius: 24,
              marginBottom: 24,
            }}
            alt={blog.title}
          />
        )}

        <UserCard />
        <BlogActionsBar />

        <Box>{renderContent}</Box>

        <BlogActionsBar />
      </>
    </Stack>
  );
};

BlogContent.propTypes = {
  blogActivity: PropTypes.object,
};

export { BlogContent };
