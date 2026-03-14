<script setup lang="ts">
// 1. 声明列表数据
// 2. 在组件初始化完毕（渲染完毕）发请求，赋值给声明好的列表
// 3. 展示

import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useChannelStore } from '../stores/channel';
import { ChannelItem, ChannelResData } from '../types/data';

const channels = ref<ChannelItem[]>([])

onMounted(async () => {
  const res = await axios.get<ChannelResData>('http://geek.itheima.net/v1_0/channels')
  channels.value = res.data.data.channels
})

// defineProps<{ channelId: number }>()
// const emit = defineEmits<{
//   (e: 'changeChannel', id: number): void
// }>()

const store = useChannelStore()
 
</script>

<template>
  <div class="channel-nav">
    <nav class="list">
      <a
        class="item"
        :class="{ active: store.channelId === item.id }"
        href="javascript:;"
        v-for="item in channels"
        :key="item.id"
        @click="store.changeChannel(item.id)"
      >
        {{ item.name }}
      </a>
    </nav>
  </div>
</template>
