import { defineStore } from 'pinia'

export const useCardStore = defineStore('cardContent', {
    state: ()=> ({ 
        cardData: {
            id: '',
            title: '',
            img: '',
            factory: '',
            createTime: '',
            banner: '',
            about: '',
            startLink: '',
        },
        sortType: 'default',
        classType: 'default',
        keywords: '',
    }),
    getters: {
        nowCardData: (state) => {
            if(state.cardData && state.cardData.id) {
                return state.cardData
            }
            const cardData: QuickLinkDataItem = JSON.parse(localStorage.getItem('cardData') || '{}')
            return cardData
        }
    },
    actions: {
        setCardData(data: QuickLinkDataItem) {
            this.cardData = Object.assign({},data)
            localStorage.setItem('cardData', JSON.stringify(data))
        },
    }
})