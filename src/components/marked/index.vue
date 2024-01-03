<script setup lang="ts">
import { ref, computed } from 'vue'
import {Marked} from 'marked'
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js"
import 'highlight.js/styles/monokai-sublime.css';
import '../../assets/style.css'
import './markdown.less';

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

const title = ref('')
const titles = [
  {
    value: '#',
    label: '标题一(大)',
  },
  {
    value: '##',
    label: '标题二(中)',
  },
  {
    value: '###',
    label: '标题三(小)',
  },
]
const updateTitleSize = (val: string) => {
  updateMD(`${val} 示例文本`)
}

const color = ref('#000000')
const predefineColors = ref([
  '#000000',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const changeColor = (color: string | null) => {
  console.log(color,'???---')
}

const updateMD = (content: string) => {
  md.value += '\n' + content
}
</script>

<template>
  <div class="marked-container">
    <div @click="change">切换<span class="icon-file-excel"></span></div>
    <div class="marked-toolbar">
      <div class="toolbar-wrap">
        <button class="toolbar-button icon-bold" @click="updateMD('**示例文本**')"></button>
        <!-- <button class="toolbar-button icon-font-size" ></button> -->
        <button class="toolbar-button icon-underline" @click="updateMD('<u>示例文本</u>')"></button>
        <button class="toolbar-button icon-italic" @click="updateMD('_示例文本_')"></button>
        <button class="toolbar-button icon-strikethrough" @click="updateMD('~~示例文本~~')"></button>
        <button class="toolbar-button icon-quotes-right" @click="updateMD('> 示例文本')"></button>
        <button class="toolbar-button icon-embed2" @click="updateMD('```\n示例文本\n```')"></button>
        <button class="toolbar-button icon-link" @click="updateMD('[示例链接](https://www.baidu.com)')"></button>

        <button class="toolbar-button icon-image"></button>
        
        <button class="toolbar-button icon-list-numbered" @click="updateMD('1. 第一项\n2. 第二项\n    1. 子项1')"></button>
        <button class="toolbar-button icon-list2" @click="updateMD('- 第一项\n- 第二项\n    - 子项1')"></button>
        <!-- <button class="toolbar-button icon-indent-decrease"></button> -->
        <!-- <button class="toolbar-button icon-indent-increase"></button> -->
        <button class="toolbar-button icon-paragraph-left"></button>
        <button class="toolbar-button icon-paragraph-center"></button>
        <button class="toolbar-button icon-paragraph-right"></button>
        <button class="toolbar-button icon-paragraph-justify"></button>
        <el-color-picker v-model="color" show-alpha :predefine="predefineColors" size="small" @change="changeColor" />
      </div>
      <div class="toolbar-wrap">
        <el-select v-model="title" placeholder="请选择标题" @change="updateTitleSize">
          <el-option
            v-for="item in titles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left;">{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>
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