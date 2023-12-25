<script setup lang="ts">
import { ref, computed } from 'vue'
import {Marked} from 'marked'
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js"
import 'highlight.js/styles/monokai-sublime.css';
import '../../assets/style.css'

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
)
marked.use({
    gfm: true,
});

const md = ref('')
const viewer = ref(true)

const html = computed(() => {
  return marked.parse(md.value);
});

const change = () => {
  viewer.value = !viewer.value
}

</script>

<template>
  <div class="marked-container">
    <div @click="change">切换<span class="icon-file-excel"></span></div>
    <div class="marked-toolbar">
      <button class="toolbar-button icon-bold"></button>
    </div>
    <div class="marked-edit" v-if="viewer">
      <div class="marked-edit-content">
        <el-input
          class="marked-input"
          v-model="md"
          :rows="10"
          type="textarea"
          placeholder="Please input"
        />
      </div>
    </div>
    <div class="marked-preview" v-html="html" v-else></div>
  </div>
</template>

<style lang="less" scoped>
.marked-container {
  width: 100%;
  .marked-edit {
    .marked-edit-content {
      .marked-input {
        width: 100%;
      }
    }
  }
}
.toolbar-button {
  border: none;
  background: none;
  cursor: pointer;
}
</style>