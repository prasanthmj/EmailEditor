<template>
  <div class="basic">
    <h1>Basic Example</h1>

    <div class="container grid-960">
      <div class="columns">
        <div id="editor-boundary" class="editorWrapper column col-6 col-sm-12">
          <vue-editor
            v-model="content"
            ref="editor"
            :editor-toolbar="toolbarSettings">
          </vue-editor>

          <vue-editor
            v-model="content"
            ref="editor"
            :editor-options="editorSettings">
          </vue-editor>
        </div>
      </div>
    </div>
    <h3>HTML code</h3>
    <div class="margin:2em;">
        <textarea v-model="content" rows="5" style="width:100%;"></textarea>
    </div>
  </div>
</template>

<script>
import { VueEditor, Quill } from "../../src/index.js";

export default {
  components: { VueEditor },

  data: () => ({
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"]
    ],
    editorSettings: {
      modules: {
        toolbar: [
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }]
        ]
      },
      placeholder: "Custom placeholder text here ..."
    },
    content: "<h1>Starting content</h1>"
  }),

  methods: {}
};
</script>
