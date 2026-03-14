<script setup lang="ts">
import ChannelNav from "./components/ChannelNav.vue";
import ArticleList from "./components/ArticleList.vue";
import { ref } from "vue";

// 频道切换
// 1. 把数据  频道ID 数据放在App.vue组件，共享给 ChannelNav ArticleList 组件
// 2. 默认是 推荐 0  传递给 ChannelNav  默认激活推荐的
// 3. 当点击频道的时候，需要传当频道的ID给 App.vue，修改频道ID
// const channelId = ref(0)


</script>

<template>
  <ChannelNav></ChannelNav>
  <ArticleList></ArticleList>
</template>
