<script setup lang="ts">
import { ref, reactive, toRefs, computed } from 'vue'
import UploadImage from '../upload-image/index.vue'
import StartLink from '../start-link/index.vue'
import { useOptionStore } from '../../store/store'

const emits = defineEmits(['closeDialog', 'setCurrentListData', 'setSearchListData'])
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

const store_option = useOptionStore()

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
  title_cn: '',
  custom_col: []
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
    if(store_option.keywords) {
      const { status, result } = await window.electronAPI.searchQuickLinkData(store_option.keywords)
      if(status.code === 0) {
        emits('setSearchListData', result)
      }
    }else {
      emits('setCurrentListData', store_option.classType)
    }
    onCloseDialog()
  }

  if(type.value === 'edit') {
    // TODO: 增加校验逻辑
    const pre = Object.assign({}, nowCardData.value)
    props.setCardData(form)
    try {
      await window.electronAPI.updateQuickLinkData(nowCardData.value._id, JSON.stringify(form))
    }catch(err) {
      console.error('更新卡片出错：', err)
      props.setCardData(pre)
    }
    if(store_option.keywords) {
      const { status, result } = await window.electronAPI.searchQuickLinkData(store_option.keywords)
      if(status.code === 0) {
        emits('setSearchListData', result)
      }
    }else {
      emits('setCurrentListData', store_option.classType)
    }
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
        <el-input v-model="form.title_cn" autocomplete="off" />
      </el-form-item>
      <el-form-item label="原标题" :label-width="formLabelWidth">
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