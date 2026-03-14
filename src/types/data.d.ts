export type ChannelItem = {
  id: number
  name: string
}

export type ChannelResData = {
  data: {
    channels: ChannelItem[]
  }
  message: string
}

// 文章数据类型
export type ArticleItem = {
  art_id: string
  aut_id: string
  aut_name: string
  comm_count: number
  cover: {
    type: number
    images?: string[]
  }
  is_top: number
  pubdate: string
  title: string
}

// 文章响应数据类型
export type ArticleResData = {
  data: {
    results: ArticleItem[]
  }
  message: string
}