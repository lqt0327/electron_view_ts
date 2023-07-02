<script setup lang="ts">
import { Search, CloseBold } from '@element-plus/icons-vue'
import EditDialog from '../edit-dialog/index.vue'
import DatabaseDialog from '../database-dialog/index.vue'
import { ref } from 'vue'
import { useCardStore, useOptionStore } from '../../store/store'
import { storeToRefs } from 'pinia'

const store_card = useCardStore()
const { setCardData } = store_card
const { nowCardData } = storeToRefs(store_card)

const store_option = useOptionStore()

const emits = defineEmits(['setSearchListData'])

const props = defineProps({
  setCurrentListData: {
    type: Function,
    required: true,
  }
})

const dialogFormVisible = ref(false)
const dialogDatabaseVisible = ref(false)

const closeDialog = () => {
  dialogFormVisible.value = false
}

const closeDatabaseDialog = () => {
  dialogDatabaseVisible.value = false
}

const editCard = () => {
  // TODO: id需要主线程中调用函数生成，
  store_card.$reset()
  dialogFormVisible.value = true
}

const options_sort = [
  {
    value: 'time',
    label: '时间',
  },
  // {
  //   value: 'factory',
  //   label: '厂商',
  // },
  {
    value: 'default',
    label: '默认',
  },
  {
    value: 'collect',
    label: '收藏夹',
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
  props.setCurrentListData(store_option.classType)
  store_option.keywords = ''
}

const autoReadData = () => {
  window.electronAPI.autoWriteListData().then((res: any)=>{
    if(res.status.code === 0) {
      if(res.result) {
        props.setCurrentListData(store_option.classType)
      }
    }else {
      ElMessage.error(res.status.message || 'unknown error')
    }
  })
}

const handleSort = (val: string) => {
  props.setCurrentListData(val)
}

const initDatabase = () => {
  window.electronAPI.initDatabase()
}

const outputDatabase = () => {
  window.electronAPI.outputDatabase()
}

const importDatabase = () => {
  dialogDatabaseVisible.value = true
}

/**
 * 分类 选择
 */
const handleClass = (val: string) => {
  props.setCurrentListData(val)
}

/**
 * 需要暴露给父组件的属性
 */
defineExpose({
  // sortType
})

</script>

<template>
  <div class="header">
    <div class="header-select">
      <div class="header-filter">
        <el-select v-model="store_option.classType" class="m-2" placeholder="Select" placement="bottom" @change="handleClass">
          <el-option v-for="item in options_class" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <!-- <el-select v-model="store_option.classType" class="m-2" placeholder="Select" placement="bottom" @change="handleClass">
          <el-option v-for="item in options_class" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
      </div>
      <div class="search">
        <el-input v-model="store_option.keywords" placeholder="请输入" :prefix-icon="Search" @change="handleSearch" />
      </div>
    </div>
    <div class="header-options">
      <el-button type="primary" round @click="editCard">手动添加</el-button>
      <!-- <el-button type="primary" round @click="autoReadData">JSON写入</el-button>
      <el-button type="primary" round @click="initDatabase">同步数据库</el-button> -->
      <el-button type="primary" round @click="outputDatabase">导出数据库</el-button>
      <el-button type="primary" round @click="importDatabase">导入数据库</el-button>
    </div>
    <div class="options-tips">自动扫描所选目录下的所有exe文件，生成快捷启动卡片</div>
    <div class="header-options" v-if="store_option.keywords">
      <el-button type="primary" round @click="closeSearch">{{ store_option.keywords }}&nbsp;<el-icon>
          <CloseBold />
        </el-icon></el-button>
    </div>
    <EditDialog 
      v-if="dialogFormVisible" 
      :nowCardData="nowCardData" 
      :setCardData="setCardData" 
      @closeDialog="closeDialog"
      @setCurrentListData="props.setCurrentListData" 
      type="create" 
    />
    <DatabaseDialog 
      v-if="dialogDatabaseVisible" 
      @closeDialog="closeDatabaseDialog"
      @setCurrentListData="props.setCurrentListData" 
    />
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