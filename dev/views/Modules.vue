<template>
  <div class="basic">
    <h1>Basic Example</h1>

    <div class="container grid-960">
      <div class="columns">
        <div id="editor-boundary" class="editorWrapper column col-6 col-sm-12">
          <vue-editor
            v-model="content"
            :editor-options="editorSettings" @register="registerModules" >
          </vue-editor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueEditor from "../../src/index.js";

import { ImageDrop } from "quill-image-drop-module";
//Quill.register("modules/imageDrop", ImageDrop);

export default {
  components: { VueEditor },

  data: () => ({
    editorSettings: {
      modules: {
        imageDrop: true
      }
    },
    content: "<h1>Starting content</h1>"
  }),
  methods:
  {
    registerModules(Quill)
    {
      Quill.register("modules/imageDrop", ImageDrop);
    }
  }
};
</script>
