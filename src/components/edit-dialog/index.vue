<script setup lang="ts">
import { ref, reactive, toRefs, computed } from 'vue'
import UploadImage from '../upload-image/index.vue'
import StartLink from '../start-link/index.vue'

const emits = defineEmits(['closeDialog', 'setCurrentListData'])
const props = defineProps({
  setCardData: {
    type: Function,
    required: true,
  },
  nowCardData: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const formLabelWidth = '140px'

const {nowCardData, type} = toRefs(props)

const dialogTitle = computed(()=>{
  if(type.value === 'create') {
    return '新建内容'
  }
  if(type.value === 'edit') {
    return '编辑内容'
  }
  return '编辑内容'
})

const form = reactive(Object.assign({
  id: '',
  title: '',
  img: '',
  factory: '',
  createTime: '',
  banner: '',
  about: '',
  startLink: '',
}, nowCardData.value))

const setImageUrl = (url: string) => {
  form.img = url
}

const setBannerUrl = (url: string) => {
  form.banner = url
}

const setStartLink = (url: string) => {
  form.startLink = url
}

const submit = async () => {

  if(type.value === 'create') {
    const id = await window.electronAPI.encodeById(form.title)
    form.id = id
    window.electronAPI.addQuickLinkData(JSON.stringify(form)).catch((err: Error)=>{
      console.log('新增卡片出错：', err)
    })
    emits('setCurrentListData', 'time')
    onCloseDialog()
  }

  if(type.value === 'edit') {
    // TODO: 增加校验逻辑
    const pre = Object.assign({}, nowCardData.value)
    props.setCardData(form)
    window.electronAPI.updateQuickLinkData(nowCardData.value.id, JSON.stringify(form)).catch((err: any) => {
      console.error('更新卡片出错：', err)
      props.setCardData(pre)
    })
    emits('setCurrentListData', 'time')
    onCloseDialog()
  }
  
}

const onCloseDialog = () =>{
  emits('closeDialog')
}
</script>

<template>
  <el-dialog :model-value="true" v-bind:title="dialogTitle" width="500" :before-close="onCloseDialog">
    <el-form :model="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="卡片封面" :label-width="formLabelWidth">
        <el-input v-model="form.img" autocomplete="off" />
        <UploadImage :imageUrl="form.img" :setImageUrl="setImageUrl" />
      </el-form-item>
      <el-form-item label="厂商" :label-width="formLabelWidth">
        <el-input v-model="form.factory" autocomplete="off" />
      </el-form-item>
      <el-form-item label="时间" :label-width="formLabelWidth">
        <el-input v-model="form.createTime" autocomplete="off" />
      </el-form-item>
      <el-form-item label="简介封面" :label-width="formLabelWidth">
        <el-input v-model="form.banner" autocomplete="off" />
        <UploadImage :imageUrl="form.banner" :setImageUrl="setBannerUrl" />
      </el-form-item>
      <el-form-item label="简介内容" :label-width="formLabelWidth">
        <el-input v-model="form.about" autocomplete="off" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="启动链接" :label-width="formLabelWidth">
        <el-input v-model="form.startLink" autocomplete="off" />
        <StartLink :start-link="form.startLink" :setStartLink="setStartLink" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseDialog">取消</el-button>
        <el-button type="primary" @click="submit">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
</style>