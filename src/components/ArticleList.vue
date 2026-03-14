<script setup lang="ts">
// 展示列表
// 1. 响应式数据的类型定义··
// 2. 传入 channelId 
// 3. channelId 改变列表更新，默认初始化就改发请求，使用 watch
// 4. 列表数据声明，赋值，展示

import axios from 'axios';
import { ref, watch } from 'vue';
import { useChannelStore } from '../stores/channel';
import { ArticleItem, ArticleResData } from '../types/data'

// const props = defineProps<{ channelId: number }>()

const store = useChannelStore()

const articles = ref<ArticleItem[]>([])
watch(()=>store.channelId, async ()=>{
  // 更新后执行的函数
  const res = await axios.get<ArticleResData>('http://geek.itheima.net/v1_0/articles', {
    params: {
      channel_id: store.channelId,
      timestamp: Date.now()
    }
  })
  articles.value = res.data.data.results
}, {
  immediate: true
})

</script>

<template>
  <div class="article-list">
    <div class="article-item" v-for="item in articles" :key="item.art_id">
      <p class="title">{{ item.title }}</p>
      <img
        v-for="(img,i) in item.cover.images"
        :key="i" class="img"
        :src="img"
        alt=""
      >
      <div class="info">
        <span>{{ item.aut_name }}</span>
        <span>{{ item.comm_count }}评论</span>
        <span>{{ item.pubdate }}</span>
      </div>
    </div>
  </div>
</template>
