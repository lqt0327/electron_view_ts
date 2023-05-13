<script setup lang="ts">
import { onMounted, toRefs, watch } from 'vue'
import type { PropType } from 'vue'
import { MoreFilled, Edit, StarFilled, DeleteFilled, Star } from '@element-plus/icons-vue'

const props = defineProps({
  quickLinkData: {
    type: Object,
    required: true
  },
  goToAbout: {
    type: Function,
    required: true
  },
  editCard: {
    type: Function,
    required: true
  },
  handleDelete: {
    type: Function,
    required: true
  }
})

const { quickLinkData } = toRefs(props)

const collectCard = (cardData: QuickLinkDataItem) => {
  window.electronAPI.collect(JSON.stringify(cardData))
    .then((res: any) => {
      ElMessage('已收藏')
    })
    .catch((err: any) => {
      console.error('卡片删除错误: ', err)
    })
}

</script>

<template>
  <div class="home-container">
    <template v-for="(data, index) in quickLinkData">
      <div class="home-wrap">
        <el-image class="home-wrap-image" :src="data.img" fit="cover" @click="goToAbout(data)" />
        <div class="home-wrap-content">
          <div class="home-content-title" @click="goToAbout(data)">{{ data.title }}</div>
          <div class="home-content-factory">厂商：{{ data.factory }}</div>
          <div class="home-content-createTime">时间：{{ data.createTime }}</div>
          <div class="home-wrap-option">
            <div class="option-edit" @click="editCard(data)">
              <el-icon size="20">
                <Edit />
              </el-icon>
              <span class="label-text">编辑</span>
            </div>
            <span class="option-line">|</span>
            <div class="option-star" @click="collectCard(data)">
              <el-icon size="20">
                <Star />
              </el-icon>
              <span class="label-text">收藏</span>
            </div>
            <span class="option-line">|</span>
            <div class="option-delete" @click="handleDelete(index, data)">
              <el-icon size="20">
                <DeleteFilled />
              </el-icon>
              <span class="label-text">删除</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  width: 800px;
  background-color: var(--background-color-card);
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}

.home-wrap {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #efeff2;
}

.home-wrap-image {
  width: 200px;
  height: 130px;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.home-wrap-content {
  padding: 10px;
  font-size: 14px;
  line-height: 22px;
  position: relative;

  .home-content-title {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: 10px;
    width: 600px;
    color: var(--text-color-active);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
  }

  .home-wrap-option {
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    width: 500px;
    color: var(--text-color-active);

    .option-edit,
    .option-delete,
    .option-star {
      display: flex;
      cursor: pointer;
    }

    .option-line {
      margin: 0 10px;
    }

    .label-text {
      margin-left: 5px;
    }
  }
}</style>