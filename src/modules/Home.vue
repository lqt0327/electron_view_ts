<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { MoreFilled, Edit, StarFilled, DeleteFilled, Star } from '@element-plus/icons-vue'
import Header from '../components/header/index.vue'
import EditDialog from '../components/edit-dialog/index.vue'
import { useCardStore } from '../store/store'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useCardStore()
const { setCardData } = store

// 渲染层监听不到文件的变化，需要在node层进行处理

const quickLinkData: Ref<QuickLinkData> = ref({})
const dataKeyBySort: Ref<string[]> = ref([])

const initListData = (sort = "default") => {
  if (window?.electronAPI?.getQuickLinkData && typeof window.electronAPI.getQuickLinkData === 'function') {
    return window.electronAPI.getQuickLinkData(sort).then((res: ResponseParam.getQuickLinkData) => {
      if(res.status.code === 0) {
        return res.result
      }else {
        return {}
      }
    }).catch((err: any) => {
      console.log(err)
      return {}
    })
  }
  return {}
}

/**
 * 
 * @param {*} sort -排序方式 time: 按时间排序 ｜ default: 按文件加入顺序排序
 */
const setCurrentListData = async (sort: string) => {
  quickLinkData.value = await initListData(sort)
  dataKeyBySort.value = Object.keys(quickLinkData.value).sort()
}

const setSearchListData = async (list_key: Array<string>) => {
  let data: QuickLinkData = await initListData()
  // let tmp: QuickLinkDataItem = {
  //   id: '',
  //   title: '',
  //   img: '',
  //   factory: '',
  //   createTime: Date.now(),
  //   banner: '',
  //   about: '',
  //   startLink: '',
  // }
  let tmp: any = {}
  for(let v of list_key) {
    if(typeof data.default[v] === 'object') {
      tmp[v] = data.default[v]
    }
  }
  quickLinkData.value = {'default': tmp}
  dataKeyBySort.value = ['default']
}

onMounted(async () => {
  setCurrentListData('time')
})

const goToAbout = (data: QuickLinkDataItem) => {
  setCardData(data)
  router.push(`/about?id=${data.id}`)
}

/**
 * 需要判断链接类型 http ｜ file
 * 根据类型做不同判断
 * @param {*} startLink 
 */
const goToPage = (startLink: string) => {
  if (!startLink) {
    ElMessage({
      message: 'Warning, startLink is null.',
      type: 'warning',
    })
    return
  }
  window.open(startLink, "_self")
}

/**
 * 删除卡片
 */
const handleDelete = (key1: string, key2: string) => {
  ElMessageBox.confirm(
    '确认删除该卡片？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    delete quickLinkData.value[key1][key2]
    window.electronAPI.deleteQuickLinkData(key2).catch((err:any) => {
      console.error('卡片删除错误: ', err)
    })
    ElMessage({
      type: 'success',
      message: 'Delete completed',
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: 'Delete canceled',
    })
  })
}

const dialogFormVisible = ref(false)
const editCard = () => {
  dialogFormVisible.value = true
}
const closeDialog = () => {
  dialogFormVisible.value = false
}

</script>

<template>
  <div class="home">
    <Header :setCurrentListData="setCurrentListData" @setSearchListData="setSearchListData" ></Header>
    <div class="home-container">
      <template v-for="key_1 in dataKeyBySort">
        <template v-for="key_2 in Object.keys(quickLinkData[key_1])">
          <div class="home-wrap" v-if="quickLinkData[key_1][key_2].img">
            <el-image class="home-wrap-image" :src="quickLinkData[key_1][key_2].img" fit="cover"
              @click="goToAbout(quickLinkData[key_1][key_2])" />
            <div class="home-wrap-content">
              <h3 class="home-wrap-content__item title">{{ quickLinkData[key_1][key_2].title }}</h3>
              <p class="home-wrap-content__item factory">{{ quickLinkData[key_1][key_2].factory }}</p>
              <p class="home-wrap-content__item createTime">{{ quickLinkData[key_1][key_2].createTime }}</p>
            </div>
            <div class="home-wrap-options">
              <div class="option-collect">
                <el-icon>
                  <Star v-if="true" />
                  <StarFilled v-else />
                </el-icon>
              </div>
              <el-dropdown trigger="click">
                <span class="more-option-icon">
                  <el-icon :size="20">
                    <MoreFilled />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :icon="Edit" @click="editCard">编辑</el-dropdown-item>
                    <el-dropdown-item :icon="DeleteFilled" @click="handleDelete(key_1, key_2)">删除</el-dropdown-item>
                    <el-dropdown-item :icon="StarFilled">收藏</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="home-wrap" v-else>
            <div class="home-wrap-desc">
              {{ quickLinkData[key_1][key_2].title }}
            </div>
          </div>
        </template>
      </template>
    </div>
    <EditDialog :dialogFormVisible="dialogFormVisible" @closeDialog="closeDialog" />
  </div>
</template>

<style lang="less" scoped>
.home {
  padding: 20px;

  .home-container {
    display: flex;
    flex-wrap: wrap;
    width: 800px;
    background-color: var(--background-color-card);
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;

    .home-wrap {
      position: relative;
      width: 140px;
      // height: 100px;
      flex-shrink: 0;
      margin: 10px;
      box-sizing: border-box;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
      border-radius: 4px;
      overflow: hidden;
    }

    .home-wrap-image {
      width: 100%;
      height: 100px;
      cursor: pointer;
    }

    .home-wrap-desc {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .home-wrap-content {
      padding: 4px;

      .home-wrap-content__item {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &.title {
          margin: 0;
          font-size: 16px;
        }

        &.factory,
        &.createTime {
          margin: 0;
          font-size: 14px;
        }
      }
    }

    .home-wrap-options {
      position: absolute;
      bottom: 0;
      right: 8px;
      display: flex;
      cursor: pointer;

      .option-collect {
        margin-right: 5px;
        cursor: pointer;
      }

      .more-option-icon {}
    }
  }
}</style>