<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useCardStore } from '../../store/store'

const emits = defineEmits(['closeDialog'])

const props = defineProps({
  dialogFormVisible: Boolean,
})

const { dialogFormVisible } = toRefs(props)

const formLabelWidth = '140px'

const store = useCardStore()
const { nowCardData } = storeToRefs(store)

const { setCardData } = store

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

const submit = () => {
  // TODO: 增加校验逻辑
  let tmp = Object.assign({}, nowCardData.value)
  setCardData(form)
  window.electronAPI.updateQuickLinkData(nowCardData.value.id, JSON.stringify(form)).catch((err: any) => {
    console.error('更新卡片出错：', err)
    setCardData(tmp)
  })
  emits('closeDialog', 1)
}
</script>

<template>
  <el-dialog :model-value="dialogFormVisible" title="编辑内容" width="500" :before-close="onCloseDialog">
    <el-form :model="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="卡片封面" :label-width="formLabelWidth">
        <el-input v-model="form.img" autocomplete="off" />
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

<style lang="less" scoped></style>