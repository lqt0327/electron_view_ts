<script setup lang="ts">
import { Search, CloseBold } from '@element-plus/icons-vue'
import EditDialog from '../edit-dialog/index.vue'
import { ref } from 'vue'
import { useCardStore } from '../../store/store'
import { storeToRefs } from 'pinia'

const store = useCardStore()
const { setCardData } = store
const { nowCardData } = storeToRefs(store)

const emits = defineEmits(['setSearchListData'])

const props = defineProps({
  setCurrentListData: {
    type: Function,
    required: true,
  }
})

const dialogFormVisible = ref(false)

const closeDialog = () => {
  dialogFormVisible.value = false
}

const selectApp = async () => {
  if (window.electronAPI) {
    await window.electronAPI.openFile('exe')
    props.setCurrentListData()
  } else {
    ElMessage('未知异常，请稍后重试～')
  }
}

const editCard = () => {
  // TODO: id需要主线程中调用函数生成，

  setCardData({
    id: '',
    title: '',
    img: '',
    factory: '',
    createTime: (new Date()).getFullYear().toString(),
    banner: '',
    about: '',
    startLink: '',
  })
  dialogFormVisible.value = true
}

const options_sort = [
  {
    value: 'time',
    label: '时间',
  },
  {
    value: 'factory',
    label: '厂商',
  },
  {
    value: 'default',
    label: '默认',
  },
]

const options_class = [
  {
    value: 'collect',
    label: '收藏夹',
  },
  {
    value: 'default',
    label: '全部',
  },
]

const handleSearch = (value: string) => {
  window.electronAPI.searchQuickLinkData(value).then((res: ResponseParam.getQuickLinkData) => {
    if (res.status.code === 0) {
      emits('setSearchListData', res.result)
    }
  })
}

const closeSearch = () => {
  props.setCurrentListData()
  keywords.value = ''
}

const sortType = ref('default')
const classType = ref('default')
const keywords = ref('')

const autoReadData = () => {
  window.electronAPI.autoWriteListData().then((res: any)=>{
    if(res.status.code === 0) {
      console.log(res,'????----')
      if(res.result) {
        props.setCurrentListData()
      }
    }else {
      ElMessage.error(res.status.message || 'unknown error')
    }
  })
}

const handleClass = (val: string) => {
  console.log(val, ';;;;;')
  window.electronAPI.getQuickLinkData(val).then((res: any)=>{
    console.log(res,'?????[[[]]]')
    if(res.status.code === 0) {
      if(res.result) {
        props.setCurrentListData(val)
      }
    }
  })
}

</script>

<template>
  <div class="header">
    <div class="header-select">
      <div class="header-filter">
        <el-select v-model="sortType" class="m-2" placeholder="Select" placement="bottom">
          <el-option v-for="item in options_sort" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="classType" class="m-2" placeholder="Select" placement="bottom" @change="handleClass">
          <el-option v-for="item in options_class" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="search">
        <el-input v-model="keywords" placeholder="请输入" :prefix-icon="Search" @change="handleSearch" />
      </div>
    </div>
    <div class="header-options">
      <el-button type="primary" round @click="selectApp">扫描文件</el-button>
      <el-button type="primary" round @click="editCard">手动添加</el-button>
      <el-button type="primary" round @click="autoReadData">JSON写入</el-button>
    </div>
    <div class="options-tips">自动扫描所选目录下的所有exe文件，生成快捷启动卡片</div>
    <div class="header-options" v-if="keywords">
      <el-button type="primary" round @click="closeSearch">{{ keywords }}&nbsp;<el-icon>
          <CloseBold />
        </el-icon></el-button>
    </div>
    <EditDialog v-if="dialogFormVisible" :nowCardData="nowCardData" :setCardData="setCardData" @closeDialog="closeDialog"
      @setCurrentListData="props.setCurrentListData" type="create" />
  </div>
</template>

<style lang="less" scoped>
.header {
  padding: 20px;
  background-color: var(--background-color-card);
  border-radius: 5px;
  width: 800px;

  .header-select {
    width: 100%;
    min-width: 800px;
    display: flex;
    justify-content: space-between;

    .header-filter {
      >div {
        margin-right: 10px;
      }
    }
  }

  .header-options {
    margin-top: 20px;
  }

  .options-tips {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
    height: 20px;
    line-height: 20px;
  }
}
</style>