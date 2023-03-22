<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Delete, Star, Position, Back, Edit } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCardStore } from '../store/store'
import { useRoute } from 'vue-router'
import EditDialog from '../components/edit-dialog/index.vue'

const route = useRoute()

const targetId = route.query.id
console.log(targetId,'???Zzzzllll')
const store = useCardStore()
const {cardData, nowCardData} = storeToRefs(store)

const goBack = () => {
  history.back()
}

const startEXE = () => {
  if(nowCardData.value.startLink.includes('http://') || nowCardData.value.startLink.includes('https://')) {
    window.open(nowCardData.value.startLink, '_self')
    return
  }
  if(nowCardData.value.startLink) {
    window.electronAPI.openEXE(nowCardData.value.startLink)
  }else {
    ElMessage({
      type: 'info',
      message: '程序启动链接缺失',
    })
  }
}

const dialogFormVisible = ref(false)
const editCard = ()=>{
  dialogFormVisible.value = true
}
const closeDialog = () => {
  dialogFormVisible.value = false
}

</script>

<template>
  <div class="about">
    <header class="about-header">
      <div class="header-back" @click="goBack"><el-icon><Back /></el-icon><div class="header-back-text">Back</div></div>
      <div class="header-title">{{ nowCardData.title }}</div>
    </header>

    <div class="about-container">
      <div class="about-banner">
        <img class="about-banner-image" :src="nowCardData.banner" alt="">
      </div>
      <div class="about-desc">
        {{ nowCardData.about }}
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

    <EditDialog :dialogFormVisible="dialogFormVisible" @closeDialog="closeDialog"/>
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
  }
}
.about-container {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 30px;
  .about-banner {
    margin-top: 30px;
    width: 600px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: var(--background-color-card);
    .about-banner-image {
      width: 100%;
      border-radius: 2px;
      box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
    }
  }
  .about-desc {
    width: 600px;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--background-color-card);
    border-radius: 5px;
  }
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
</style>