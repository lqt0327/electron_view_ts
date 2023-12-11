<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Delete, Star, Position, Back, Edit } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCardStore } from '../store/store'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

let quill_view: Quill;
let quill_edit: Quill;

const store = useCardStore()
const { setAbout } = store
const {nowCardData} = storeToRefs(store)

const goBack = () => {
  history.back()
}

const startEXE = () => {
  if(nowCardData.value.startLink) {
    window.electronAPI.openApp(nowCardData.value.startLink).catch((err: Error)=>{
      console.error('程序启动异常: ', err)
      ElMessage({
        type: 'info',
        message: '程序启动异常，请检查启动链接',
      })
    })
  }else {
    ElMessage({
      type: 'info',
      message: '程序启动链接缺失',
    })
  }
}

const editFlag = ref(false)
const handleSave = () => {
  editFlag.value = false
  const about = quill_edit.getContents()
  setAbout(JSON.stringify(about))
  initQuill(0)
}
const editCard = ()=>{
  editFlag.value = true
  initQuill(1)
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block', 'image', 'link', 'video'],

  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

const initQuill = (type: number) => {
  if(!quill_edit) {
    quill_edit = new Quill('#page-editor-about-edit', {
      readOnly: false,
      modules: {
        toolbar: toolbarOptions
      },
      // placeholder: '请输入...',
      theme: 'snow'  // or 'bubble'
    });
  }
  if(!quill_view) {
    quill_view = new Quill('#page-editor-about-view', {
      readOnly: true,
      modules: {
        toolbar: false
      },
      theme: 'bubble'
    });
  }
  
  const about = nowCardData.value.about
  if(type === 1) {
    editFlag.value = true
  }else {
    editFlag.value = false
  }
  
  try {
    const data = JSON.parse(about)
    if(type === 1) {
      quill_edit.setContents(data)
    }else {
      quill_view.setContents(data)
    }
  }catch (err) {
    console.log(err)
  }
  
}

onMounted(()=>{
  initQuill(0)
})

</script>

<template>
  <div class="about">
    <div class="about-header">
      <div class="header-back" @click="goBack"><el-icon><Back /></el-icon><div class="header-back-text">Back</div></div>
      <div class="header-title">{{ nowCardData.title_cn }}</div>
      <el-button type="primary" class="header-save" v-if="editFlag" @click="handleSave">保存</el-button>
    </div>

    <div class="about-container">
      <div class="about-wrap" v-show="editFlag">
        <div id="page-editor-about-edit"></div>
      </div>
      <div class="about-wrap" v-show="!editFlag">
        <div id="page-editor-about-view"></div>
      </div>
      <div class="about-options">
        <el-button 
          class="about-options__item" 
          title="启动" 
          type="success" 
          :icon="Position" 
          circle
          @click="startEXE"
         />
        <el-button class="about-options__item" title="收藏" type="warning" :icon="Star" circle />
        <el-button class="about-options__item" title="编辑" type="info" :icon="Edit" circle @click="editCard" />
        <el-button class="about-options__item" title="删除" type="danger" :icon="Delete" circle />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.about {
  display: flex;
  justify-content: center;
}
.about-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  background-color: #fff;
  .header-save {
    position: absolute;
    right: 20px;
  }
  .header-back {
    display: flex;
    align-items: center;
    cursor: pointer;
    .header-back-text {
      font-size: 14px;
      font-weight: 600;
      margin-left: 10px;
      padding-right: 15px;
      border-right: 1px solid #dcdfe6;
    }
  }
  .header-title {
    padding-left: 15px;
    font-size: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.about-container {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 30px;
  background-color: var(--background-color-default);
  .about-options {
    position: fixed;
    bottom: 50px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    button {
      margin-bottom: 10px;
    }
    :deep(.el-button+.el-button) {
      margin-left: 0;
    }
  }
}
.about-wrap {
  width: 100%;
}
#page-editor-about-edit, #page-editor-about-view {
  width: 100%;
}
</style>