import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2",
    "h3",
    "h4",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "strong",
    "em",
    "u",
    "s",
    "br",
    "hr",
    "span",
    "figure",
    "figcaption",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    span: ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }),
    img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
  },
};

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html ?? "", OPTIONS);
}

export function sanitizePlainText(value: string) {
  return sanitizeHtml(value ?? "", { allowedTags: [], allowedAttributes: {} });
}
