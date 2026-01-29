import { h, raw } from "../html.js";

const {
  html,
  div,
  a,
  head,
  body,
  footer,
  script,
  iframe,
  label,
  input,
  form,
  link,
  pre,
  title,
  button,
  textarea,
} = h;

function makeMainLayout() {
  return html([
    head([
      title("vju"),
      link({ rel: "stylesheet", href: "assets/styles.css" }),
      script(
        {
          type: "importmap",
        },
        raw(
          JSON.stringify({
            imports: {
              codemirror: "https://esm.sh/codemirror@6.0.2",
            },
          }),
        ),
      ),
      script({
        type: "module",
        src: "assets/main.js",
      }),
      script({
        src: "https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js",
      }),
    ]),
    body([
      div({ class: "container" }, [
        div({ id: "snippets", class: "snippets" }, [
          form(
            {
              id: "snippet-picker",
              "hx-get": "/snippets",
              "hx-trigger": "change",
              "hx-target": "#snippet-buffer",
              "hx-swap": "textContent",
            },
            [
              label([
                input({
                  type: "radio",
                  class: "type",
                  name: "name",
                  value: "a",
                  checked: true,
                }),
                "Snippet A",
              ]),
              label([
                input({
                  type: "radio",
                  class: "type",
                  name: "name",
                  value: "b",
                  checked: false,
                }),
                "Snippet B",
              ]),
              label([
                input({
                  type: "radio",
                  class: "type",
                  name: "name",
                  value: "c",
                  checked: false,
                }),
                "Snippet C",
              ]),
            ],
          ),
          pre({ id: "snippet-buffer", hidden: true }),
        ]),
        form(
          {
            id: "editor-form",
            "hx-include": "#snippet-picker",
            "hx-put": "/snippets",
            "hx-swap": "none",
          },
          [
            button({ id: "editor-save", type: "submit" }, "save"),
            div({ id: "editor", class: "editor" }),
            textarea({ name: "content", id: "editor-content", hidden: true }),
          ],
        ),
        div({ id: "flash", "aria-live": "polite" }),
        div({ id: "preview", class: "preview" }, [
          iframe({ id: "preview-iframe" }),
        ]),
      ]),
    ]),
    footer([
      a({ href: "https://github.com/SOULPWRD/vju", target: "_blank" }, "vju"),
    ]),
  ]);
}

export { makeMainLayout };
