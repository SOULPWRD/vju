import { EditorView, basicSetup } from "codemirror";
import db from "./db.json" with { type: "json" };

const parent = document.getElementById("editor");
const preview = document.getElementById("preview-iframe");
const snippetBuffer = document.getElementById("snippet-buffer");

function makeLayout(content = "") {
  return [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    '<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>',
    "</head>",
    "<body>",
    "<div>",
    content,
    "</div>",
    "</body>",
    "</html>",
  ].join("");
}

function debounce(callback, latency = 0) {
  let timerId;

  function clear() {
    clearTimeout(timerId);
  }

  function update(...args) {
    timerId = setTimeout(function () {
      callback(...args);
    }, latency);
  }

  return function debounced(...args) {
    if (timerId) {
      clear();
    }

    update(...args);
    return clear;
  };
}

const updatePreview = debounce(function (text) {
  preview.srcdoc = text;
}, 165);

const onDocumentChanged = EditorView.updateListener.of(function (update) {
  if (!update.docChanged) {
    return;
  }

  updatePreview(makeLayout(update.state.doc.toString().trim()));
});

function start() {
  const editor = new EditorView({
    parent,
    doc: db.a,
    extensions: [basicSetup, onDocumentChanged],
  });

  snippetBuffer.addEventListener("htmx:afterSwap", function () {
    const doc = snippetBuffer.textContent ?? "";
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: doc },
    });
  });

  document.body.addEventListener("htmx:configRequest", function (e) {
    if (e.target && e.target.id === "editor-form") {
      e.detail.parameters.content = editor.state.doc.toString();
    }
  });

  updatePreview(makeLayout(editor.state.doc.toString()));
}

start();
