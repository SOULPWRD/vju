const unpaired_tags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

const paired_tags = [
  // root and metadata
  "html",
  "head",
  "title",
  "style",
  "script",
  "noscript",

  // sectioning and layout
  "body",
  "header",
  "footer",
  "main",
  "section",
  "article",
  "aside",
  "nav",
  "address",
  "div",
  "span",
  "details",
  "summary",
  "dialog",

  // headings
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hgroup",

  // text content and formatting
  "p",
  "blockquote",
  "pre",
  "ol",
  "ul",
  "li",
  "dl",
  "dt",
  "dd",
  "figure",
  "figcaption",
  "a",
  "em",
  "strong",
  "small",
  "s",
  "cite",
  "q",
  "dfn",
  "abbr",
  "ruby",
  "rt",
  "rp",
  "data",
  "time",
  "code",
  "var",
  "samp",
  "kbd",
  "sub",
  "sup",
  "i",
  "b",
  "u",
  "mark",
  "bdi",
  "bdo",

  // tables
  "table",
  "caption",
  "colgroup",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",

  // forms
  "form",
  "label",
  "button",
  "select",
  "optgroup",
  "option",
  "textarea",
  "fieldset",
  "legend",
  "output",
  "progress",
  "meter",
  "datalist",

  // multimedia and interactive
  "audio",
  "video",
  "canvas",
  "iframe",
  "object",
  "picture",
  "map",
  "template",
  "slot",
];

const unique_symbol = Object.freeze(Object.create(null));

const all_tags = [...unpaired_tags, ...paired_tags];

const escape_characters = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function safe(str) {
  return {
    is_safe: unique_symbol,
    render: function () {
      return String(str);
    },
  };
}

function is_unpaired(tag_name) {
  return unpaired_tags.includes(tag_name);
}

function is_attribute(value) {
  return typeof value === "object" && Array.isArray(value) === false;
}

function esc_html(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return escape_characters[character];
  });
}

function parse_arguments(...args) {
  if (Array.isArray(args) && is_attribute(args[0])) {
    return {
      attrs: args[0],
      children: args.slice(1),
    };
  }

  return {
    attrs: null,
    children: args,
  };
}

function render_attributes(name, value) {
  if (value === null || value === undefined || value === false) {
    return "";
  }

  if (value === true) {
    return ` ${name}`;
  }

  return ` ${name}="${esc_html(value)}"`;
}

function attributes_to_string(attributes) {
  return Object.entries(attributes)
    .map(function ([name, value]) {
      return render_attributes(name, value);
    })
    .join("");
}

function render_node(node) {
  if (node === null || node === undefined || node === false) {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return esc_html(node);
  }

  if (Array.isArray(node)) {
    return node.map(render_node).join("");
  }

  if (node.is_safe === unique_symbol) {
    return node.render();
  }

  // default fallback
  return esc_html(JSON.stringify(node));
}

function make_tag(tag_name) {
  return function (...args) {
    const { attrs, children } = parse_arguments(...args);
    const string_attrs = attributes_to_string(attrs ?? {});
    const string_children = render_node(children.flat());

    if (is_unpaired(tag_name)) {
      return safe(`<${tag_name}${string_attrs}/>`);
    }

    return safe(`<${tag_name}${string_attrs}>${string_children}</${tag_name}>`);
  };
}

function raw(html) {
  return safe(String(html));
}

function render(node) {
  return node.is_safe === unique_symbol ? node.render() : "";
}

const tag_helpers = all_tags.reduce(function (container, tag_name) {
  container[tag_name] = make_tag(tag_name);
  return container;
}, {});

export { tag_helpers as h, raw, render };
