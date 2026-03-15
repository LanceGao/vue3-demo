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
// 上拉加载文本
const loadText = ref('')
const distance = 100 // 偏移量
// 下拉刷新提示文本
const pullText = ref('')
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

const loadMoreData = (el: any) => {
  let elClientH = el.target.clientHeight
  let elScrollTop = el.target.scrollTop
  let elScrollH = el.target.scrollHeight
    loadText.value = '加载更多...'
  if ((elScrollTop + elClientH) >= (elScrollH - distance)) {
    console.log('上拉加载数据')
    loadText.value = '加载中...'
    setTimeout(() => {
     loadText.value = ''
    })
  }
}

const handleThrottle = throttle(lazyLoadImgs, 200)

const handleLoadMore = debounce(loadMoreData, 200)

// 下拉刷新
const pullRefresh = () => {
  // 初始位置
  let initPosi = 0
  // 下拉的最大距离
  let maxPullDistance = 80
  // 监听touchstart事件，记录初始位置，设置样式
  articleListRef.value.addEventListener('touchstart', function(el: any) {
    initPosi = el.touches[0].pageY
    articleListRef.value.style.position = 'relative'
    articleListRef.value.style.transition = `transform 0s`
  })

  // 监听touchmove事件，当下拉时将元素transform设置
  articleListRef.value.addEventListener('touchmove', function(el: any) {
    let curPosi = el.touches[0].pageY
    let moveDistance = curPosi - initPosi
    if (moveDistance > 0 && moveDistance < maxPullDistance) {
      pullText.value = '下拉刷新...'
      articleListRef.value.style.transform = `translateY(${moveDistance}px)`
      if (moveDistance > 70) {
        pullText.value = '释放刷新...'
      }
    }
  })
  // 监听touchend事件，将元素样式恢复
  articleListRef.value.addEventListener('touchend', function(el: any) {
    pullText.value = '更新中...'
    articleListRef.value.style.transform = 'translateY(0px)'
    articleListRef.value.style.translate = 'transform 0.5s ease 1s'
    setTimeout(() => {
      pullText.value = ''
    }, 800)
  })
}



onMounted(() => {
  // 添加监听事件
  articleListRef.value.addEventListener('scroll', handleThrottle)
  // 上拉加载数据 
  articleListRef.value.addEventListener('scroll', handleLoadMore)
  // 下拉刷新数据
  pullRefresh()
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
  <span class="pull-text" v-if="pullText">{{pullText}}</span>
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
  <span class="load-text" v-if="loadText">{{loadText}}</span>
</template>

<style scoped>
.pull-text {
  text-align: center;
  padding: 10px 0;
}
</style>
