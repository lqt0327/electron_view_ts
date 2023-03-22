<script setup lang="ts">
import { Search, CloseBold } from '@element-plus/icons-vue'
import { ref } from 'vue'

const emits = defineEmits(['setSearchListData'])

const props = defineProps({
    setCurrentListData: {
        type: Function,
        required: true,
    }
})

const selectImage = async ()=> {
    if(window.electronAPI) {
        await window.electronAPI.openFile('image')
        props.setCurrentListData()
    }else {
        ElMessage('未知异常，请稍后重试～')
    }
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
        value: 'favorite',
        label: '收藏夹',
    },
    {
        value: 'recent',
        label: '最近',
    },
    {
        value: 'all',
        label: '全部',
    },
]

const handleSearch = (value: string) => {
    window.electronAPI.searchQuickLinkData(value).then((res: ResponseParam.getQuickLinkData)=>{
        if(res.status.code === 0) {
            emits('setSearchListData', res.result)
        }
    })
}

const closeSearch = () => {
    props.setCurrentListData()
    keywords.value = ''
}

const sortType = ref('default')
const classType = ref('all')
const keywords = ref('')
</script>

<template>
    <div class="header">
        <div class="header-select">
            <div class="header-filter">
                <el-select v-model="sortType" class="m-2" placeholder="Select" placement="bottom">
                    <el-option
                    v-for="item in options_sort"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
                <el-select v-model="classType" class="m-2" placeholder="Select" placement="bottom">
                    <el-option
                    v-for="item in options_class"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </div>
            <div class="search">
                <el-input v-model="keywords" placeholder="请输入" :prefix-icon="Search" @change="handleSearch" />
            </div>
        </div>
        <div class="header-options">
            <el-button type="primary" round @click="selectImage">扫描文件</el-button>
            <el-button type="primary">Primary22</el-button>
        </div>
        <div class="header-options" v-if="keywords">
            <el-button type="primary" round @click="closeSearch">{{keywords}}&nbsp;<el-icon><CloseBold /></el-icon></el-button>
        </div>
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
}
</style>