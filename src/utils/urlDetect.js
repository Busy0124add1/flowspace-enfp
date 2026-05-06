const URL_RE = /(https?:\/\/\S+)/
const TRAIL_PUNCT = /[，。、；！？)）】」]+$/

export function extractFirstUrl(text) {
  if (!text || typeof text !== 'string') return null
  const m = text.match(URL_RE)
  if (!m) return null
  return m[1].replace(TRAIL_PUNCT, '')
}

const SOURCE_MAP = [
  { match: ['douyin.com'], source: 'douyin' },
  { match: ['zhihu.com'], source: 'zhihu' },
  { match: ['xiaohongshu.com', 'xhslink.com'], source: 'xhs' },
  { match: ['mp.weixin.qq.com'], source: 'wechat' },
  { match: ['bilibili.com', 'b23.tv'], source: 'bilibili' },
]

export function guessSource(url) {
  if (!url || typeof url !== 'string') return null
  let hostname
  try {
    hostname = new URL(url).hostname.toLowerCase()
  } catch {
    return null
  }
  for (const { match, source } of SOURCE_MAP) {
    if (match.some((d) => hostname === d || hostname.endsWith('.' + d))) {
      return source
    }
  }
  return null
}
