<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import Header from '../components/header/index.vue'
import EditDialog from '../components/edit-dialog/index.vue'
import MoreLineList from './application/more-line-list/index.vue'
import OneLineList from './application/one-line-list/index.vue'
import { useCardStore } from '../store/store'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const router = useRouter()

const store = useCardStore()
const { setCardData } = store
const { nowCardData } = storeToRefs(store)

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
  dataKeyBySort.value = Object.keys(quickLinkData.value).sort().reverse()
  console.log(formatListData(quickLinkData.value, sort),'????===')
}

/**
 * 针对 QuickLinkData 进行快排
 * @param arr 
 */
const quickSort = (arr: any[]): any[] => {
  if(arr.length <= 1) return arr;
  let left = []
  let right = []
  let cur = arr.shift()
  let t1 = cur.createTime.replace(/(-)*/g, '')
  for(let v of arr) {
    let t2 = v.createTime.replace(/(-)*/g, '')
    if(t2 > t1) {
      right.push(v)
    }else {
      left.push(v)
    }
  }
  return quickSort(left).concat(cur, quickSort(right))
}

/**
 * 格式化数据，对数据进行 时间排序+扁平化 处理
 * @param data 
 * @param sort 
 */
const formatListData = (data: QuickLinkData, sort = "default") => {
  let res = []
  if(sort === 'default') {
    let arr = Object.values(data.default)
    res = quickSort(arr)
  }else if (sort === 'time') {
    let arr = Object.keys(data).sort((a,b)=> Number(b) - Number(a))
    for(let v of arr) {
      let tmp = Object.values(data[v])
      let q = quickSort(tmp)
      res.push(...q)
    }
  }
  return res
}

const setSearchListData = async (list_key: Array<string>) => {
  let data: QuickLinkData = await initListData()
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
  }).catch((err) => {
    console.error('卡片删除错误: ', err)
    ElMessage({
      type: 'info',
      message: 'Delete canceled',
    })
  })
}

const dialogFormVisible = ref(false)
const editCard = (cardData: QuickLinkDataItem) => {
  setCardData(cardData)
  dialogFormVisible.value = true
}
const closeDialog = () => {
  dialogFormVisible.value = false
}

</script>

<template>
  <div class="home">
    <Header :setCurrentListData="setCurrentListData" @setSearchListData="setSearchListData" ></Header>
    <MoreLineList 
      v-if="false"
      :dataKeyBySort="dataKeyBySort"
      :quickLinkData="quickLinkData"
      :goToAbout="goToAbout" 
      :editCard="editCard" 
      :handleDelete="handleDelete" 
    />
    <OneLineList 
      v-if="true"
      :dataKeyBySort="dataKeyBySort"
      :quickLinkData="quickLinkData"
      :goToAbout="goToAbout" 
      :editCard="editCard" 
      :handleDelete="handleDelete" 
    />
    <EditDialog 
      v-if="dialogFormVisible" 
      :nowCardData="nowCardData" 
      :setCardData="setCardData"  
      type="edit"
      @closeDialog="closeDialog" 
      @setCurrentListData="setCurrentListData" 
    />
  </div>
</template>

<style lang="less" scoped>
.home {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>