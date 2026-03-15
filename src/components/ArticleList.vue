<script setup lang="ts">
// 展示列表
// 1. 响应式数据的类型定义··
// 2. 传入 channelId 
// 3. channelId 改变列表更新，默认初始化就改发请求，使用 watch
// 4. 列表数据声明，赋值，展示

import axios from 'axios';
import { ref, watch, nextTick, onMounted } from 'vue';
import { useChannelStore } from '../stores/channel';
import { ArticleItem, ArticleResData } from '../types/data'

// const props = defineProps<{ channelId: number }>()

const store = useChannelStore()

const articles = ref<ArticleItem[]>([])
const articleListRef = ref()
const offset = 100 // 偏移量
const distance = 100 // 偏移量
watch(()=>store.channelId, async ()=>{
  // 更新后执行的函数
  const res = await axios.get<ArticleResData>('http://geek.itheima.net/v1_0/articles', {
    params: {
      channel_id: store.channelId,
      timestamp: Date.now()
    }
  })
  articles.value = res.data.data.results
  // 初始化渲染图片
  nextTick(() => {
    // 图片懒加载-getBoundingClientRect()
    lazyLoadImgs()
    // intersectionObserverLazyImgs()
  })
}, {
  immediate: true
})

// 图片懒加载
const lazyLoadImgs = () => {
  const lazyImgs = Array.from(document.querySelectorAll('.lazy-img')) as HTMLImageElement[]
  const articleListClientHeight = articleListRef.value.clientHeight
  lazyImgs.forEach(lazyImg => {
    let lazyImgRect = lazyImg.getBoundingClientRect()
    let isInView = lazyImgRect.top <= articleListClientHeight + offset && lazyImgRect.bottom > 0
    // 如果在可视区域，将src赋值，成功后将data-src属性和lazy-img 类删除，
    // 并过滤掉已渲染的图片，如果懒加载完成后，将监听事件删除掉
    if (isInView) {
      lazyImg.src = lazyImg.dataset.src || ''
      lazyImg.classList.remove('lazy-img')
      lazyImg.removeAttribute('data-src')
      lazyImgs.filter(img => img !== lazyImg)
      if (lazyImgs.length === 0) {
        articleListRef.value.removeEventListener('scroll', handleThrottle)
      }
    }
  })
}

// 节流操作
const throttle = (fn: any, delay = 200) => {
  let lastTime = 0
  return function(...args: any) {
    let nowTime = Date.now()
    if (nowTime - lastTime >= delay) {
      fn(...args)
      lastTime = nowTime
    }
  }
}

// 防抖
const debounce = (fn: any, delay = 200) => {
  let timer: any = null
  return function(...args: any[]) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const laodMoreData = (el: any) => {
  let elClientH = el.target.clientHeight
  let elScrollTop = el.target.scrollTop
  let elScrollH = el.target.scrollHeight
  console.log(elScrollH, elScrollTop, elClientH)
  if ((elScrollTop + elClientH) >= (elScrollH - distance)) {
    console.log('上拉加载数据')
  }
}

const handleThrottle = throttle(lazyLoadImgs, 200)

const handleLoadMore = debounce(laodMoreData, 200)

onMounted(() => {
  // 添加监听事件
  articleListRef.value.addEventListener('scroll', handleThrottle)
  // 上拉加载数据 
  articleListRef.value.addEventListener('scroll', handleLoadMore)
})

const lazyImgsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let lazyImg = entry.target
      let img = lazyImg  as HTMLImageElement
      img.src = img.dataset.src || ''
      lazyImg.classList.remove('lazy-img')
      lazyImgsObserver.unobserve(lazyImg)
    }
  })
  })

const intersectionObserverLazyImgs = () => {
  const lazyImgs = Array.from(document.querySelectorAll('.lazy-img'))
  lazyImgs?.forEach(lazyImg => {
    lazyImgsObserver.observe(lazyImg)
  })
}

</script>

<template>
  <div class="article-list" ref="articleListRef">
    <div class="article-item" v-for="item in articles" :key="item.art_id">
      <p class="title">{{ item.title }}</p>
      <img
        v-for="(img,i) in item.cover.images"
        :key="i"
        class="img lazy-img"
        :data-src="img"
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
