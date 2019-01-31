<template>
  <div class="quillWrapper">
    <slot name="toolbar"></slot>
    <div :id="id" ref="quillContainer"></div>
    <input v-if="useCustomImageHandler" @change="emitImageInfo($event)" ref="fileInput" id="file-upload" type="file" accept="image/*" style="display:none;">
  </div>
</template>

<script>
import _Quill from "quill";
//import defaultToolbar from "./helpers/default-toolbar";
import merge from "lodash.merge";
import oldApi from "./helpers/old-api";
import MarkdownShortcuts from "./helpers/markdown-shortcuts";

import myToolbar from './helpers/mytoolbar.js';
import BlotFormatter, { DeleteAction, ResizeAction, ImageSpec } from 'quill-blot-formatter';
import ImageExtractor from './helpers/ImageExtractor';

const Quill = window.Quill || _Quill;

class CustomImageSpec extends ImageSpec {
    getActions() {
        return [ResizeAction, DeleteAction];
    }
}

export default {
  name: "VueEditor",
  mixins: [oldApi],
  props: {
    id: {
      type: String,
      default: "quill-container"
    },
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean
    },
    editorToolbar: Array,
    editorOptions: {
      type: Object,
      required: false,
      default: () => ({})
    },
    useCustomImageHandler: {
      type: Boolean,
      default: false
    },
    useMarkdownShortcuts: {
      type: Boolean,
      default: false
    },
    noImage:{
      type:Boolean,
      default:false
    },
    proxy:{
        type: Object,
        default: function () 
        {
        return {};
        }
      }
  },

  data: () => ({
    quill: null
  }),

  mounted() {
    this.registerCustomModules(Quill);
    this.registerPrototypes();
    this.initializeEditor();
    this.initProxy();
  },

  methods: {
    initializeEditor() {
      this.$emit("register",Quill);
      this.setupQuillEditor();
      this.checkForCustomImageHandler();
      this.handleInitialContent();
      this.registerEditorEventListeners();
      this.$emit("ready", this.quill);
    },

    setupQuillEditor() {
      

      let editorConfig = {
        debug: false,
        modules: this.setModules(),
        theme: "snow",
        placeholder: this.placeholder ? this.placeholder : "",
        readOnly: this.disabled ? this.disabled : false
      };

      if(this.noImage)
      {
        editorConfig.modules['toolbar'][3]=['link'];
      }

      this.prepareEditorConfig(editorConfig);
      this.quill = new Quill(this.$refs.quillContainer, editorConfig);
    },

    setModules() 
    {
      let modules = {
        toolbar: this.editorToolbar ? this.editorToolbar : myToolbar,
        blotFormatter: { specs: [ CustomImageSpec] }
      };
      if (this.useMarkdownShortcuts) {
        Quill.register("modules/markdownShortcuts", MarkdownShortcuts, true);
        modules["markdownShortcuts"] = {};
      }

      var Font = Quill.import('formats/font');
      // We do not add Sans Serif since it is the default
      Font.whitelist = myToolbar[0][0].font;
      Quill.register(Font, true);
      Quill.register('modules/blotFormatter', BlotFormatter);

      return modules;
    },
    
    prepareEditorConfig(editorConfig) {
      if (
        Object.keys(this.editorOptions).length > 0 &&
        this.editorOptions.constructor === Object
      ) {
        if (
          this.editorOptions.modules &&
          typeof this.editorOptions.modules.toolbar !== "undefined"
        ) {
          // We don't want to merge default toolbar with provided toolbar.
          delete editorConfig.modules.toolbar;
        }
        merge(editorConfig, this.editorOptions);
      }
    },

    registerPrototypes() {
      Quill.prototype.getHTML = function() {
        return this.container.querySelector(".ql-editor").innerHTML;
      };
      Quill.prototype.getWordCount = function() {
        return this.container.querySelector(".ql-editor").innerText.length;
      };
    },

    registerEditorEventListeners() {
      this.quill.on("text-change", this.handleTextChange);
      this.quill.on("selection-change", this.handleSelectionChange);
      this.listenForEditorEvent("text-change");
      this.listenForEditorEvent("selection-change");
      this.listenForEditorEvent("editor-change");
    },

    listenForEditorEvent(type) {
      this.quill.on(type, (...args) => {
        this.$emit(type, ...args);
      });
    },

    handleInitialContent() {
      if (this.value) this.quill.root.innerHTML = this.value; // Set initial editor content
    },

    handleSelectionChange(range, oldRange) {
      if (!range && oldRange) this.$emit("blur", this.quill);
      else if (range && !oldRange) this.$emit("focus", this.quill);
    },

    handleTextChange() {
      let editorContent =
        this.quill.getHTML() === "<p><br></p>" ? "" : this.quill.getHTML();
      this.$emit("input", editorContent);
    },

    checkForCustomImageHandler() {
      this.useCustomImageHandler === true ? this.setupCustomImageHandler() : "";
    },

    setupCustomImageHandler() {
      let toolbar = this.quill.getModule("toolbar");
      toolbar.addHandler("image", this.customImageHandler);
    },

    customImageHandler(image, callback) {
      this.$refs.fileInput.click();
    },

    emitImageInfo($event) {
      const resetUploader = function() {
        var uploader = document.getElementById("file-upload");
        uploader.value = "";
      };
      let file = $event.target.files[0];
      let Editor = this.quill;
      let range = Editor.getSelection();
      let cursorLocation = range.index;
      this.$emit("imageAdded", file, Editor, cursorLocation, resetUploader);
    },

    getContentHTML()
    {
      var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

      var cfg = {
          inlineStyles:
          {
              font: function(value, b)
              {
                  var mapping = 
                  {
                    'sans-serif': "font-family: arial, helvetica, 'sans-serif'",
                    'serif': "font-family: 'times new roman', 'serif'",
                    'fixed-width': "font-family: monospace",
                    'wide': "font-family: 'Arial black','sans-serif'",
                    'narrow': "font-family: 'Arial Narrow','sans-serif'",
                    'comic-sans': "font-family: 'comic sans ms','sans-serif'",
                    'garamond': "font-family: garamond, serif",
                    'georgea': "font-family: georgia, serif",
                    'tahoma': "font-family: tahoma, sans-serif",
                    'trebuchet': "font-family: trebuchet ms, sans-serif",
                    'verdana': "font-family: verdana, sans-serif"
                  };

                  var ret = mapping[value];

                  return ret;
              }

          }
      };
      let delta = this.quill.getContents();

      var ops = JSON.parse(JSON.stringify(delta.ops));
      var converter = new QuillDeltaToHtmlConverter(ops, cfg);

      var ret = '<div style="font-family:arial, helvetica, \'sans-serif\'; font-size:16px; line-height:1.42; text-align:left; white-space:pre-wrap; width:100%;">';
      ret += converter.convert();
      ret += '</div>';
        
      return ret;     
    },
    initProxy()
    {
      
      this.proxy.insert = function(txt)
      {
          this.quill.focus();
          var range = this.quill.getSelection();
          this.quill.pasteHTML(range.index, txt);
      }.bind(this);

      this.proxy.getHTML = function()
      {
        return this.getContentHTML();
      }.bind(this);

      this.proxy.getEmail = function()
      {
          let html = this.proxy.getHTML();
          let extractor = new ImageExtractor();
          return extractor.extract(html);
      }.bind(this);

    }
  },

  watch: {
    value(val) {
      if (val != this.quill.root.innerHTML && !this.quill.hasFocus()) {
        this.quill.root.innerHTML = val;
      }
    },
    disabled(status) {
      this.quill.enable(!status);
    }
  },

  beforeDestroy() {
    this.quill = null;
    delete this.quill;
  }
};
</script>

<style src="quill/dist/quill.snow.css"></style>
<style src="./styles/vue2-editor.scss" lang='scss'></style>
<style src="./styles/fonts.scss" lang='scss'></style>
