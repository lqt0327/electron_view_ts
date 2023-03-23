<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import UploadImage from '../upload-image/index.vue'

const emits = defineEmits(['closeDialog'])
const props = defineProps({
  setCardData: {
    type: Function,
    required: true,
  },
  nowCardData: {
    type: Object,
    required: true
  },
})

const formLabelWidth = '140px'

const {nowCardData} = toRefs(props)

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
  props.setCardData(form)
}

const submit = () => {
  // TODO: 增加校验逻辑
  let tmp = Object.assign({}, nowCardData.value)
  props.setCardData(form)
  window.electronAPI.updateQuickLinkData(nowCardData.value.id, JSON.stringify(form)).catch((err: any) => {
    console.error('更新卡片出错：', err)
    props.setCardData(tmp)
  })
  emits('closeDialog', 1)
}

const onCloseDialog = () =>{
  emits('closeDialog')
}
</script>

<template>
  <el-dialog :model-value="true" title="编辑内容" width="500" :before-close="onCloseDialog">
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
      </el-form-item>
      <el-form-item label="简介内容" :label-width="formLabelWidth">
        <el-input v-model="form.about" autocomplete="off" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="启动链接" :label-width="formLabelWidth">
        <el-input v-model="form.startLink" autocomplete="off" />
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