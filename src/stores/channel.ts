import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useChannelStore = defineStore('channel', () => {

  const channelId = ref(0)

  const changeChannel = (id: number) => {
    channelId.value = id
  }

  return { channelId, changeChannel}
})