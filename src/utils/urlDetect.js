// 只匹配 URL 安全字符（ASCII 可见字符，排除中文/空白/常见尾随标点），
// 避免在 "https://zhihu.com/q/123。非常棒" 这种中文串里把"非常棒"一起吞进来。
const URL_RE = /(https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'*+,;=%]+)/
const TRAIL_PUNCT = /[，。、；！？)）】」.,;!?)]+$/

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
