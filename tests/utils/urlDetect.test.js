import { describe, it, expect } from 'vitest'
import { extractFirstUrl, guessSource } from '@/utils/urlDetect'

describe('extractFirstUrl', () => {
  it('returns null when no url', () => {
    expect(extractFirstUrl('hello world')).toBeNull()
  })

  it('extracts http URL', () => {
    expect(extractFirstUrl('see http://foo.com now')).toBe('http://foo.com')
  })

  it('extracts https URL', () => {
    expect(extractFirstUrl('link: https://bar.com/x')).toBe('https://bar.com/x')
  })

  it('extracts first URL when multiple', () => {
    expect(extractFirstUrl('a https://a.com and https://b.com')).toBe('https://a.com')
  })

  it('strips trailing Chinese punctuation', () => {
    expect(extractFirstUrl('请看 https://zhihu.com/q/123。非常棒')).toBe('https://zhihu.com/q/123')
    expect(extractFirstUrl('是这个https://a.com）')).toBe('https://a.com')
  })

  it('handles text with only url', () => {
    expect(extractFirstUrl('https://solo.com')).toBe('https://solo.com')
  })
})

describe('guessSource', () => {
  it('returns null for empty', () => {
    expect(guessSource('')).toBeNull()
    expect(guessSource(null)).toBeNull()
  })

  it('detects douyin', () => {
    expect(guessSource('https://v.douyin.com/abc123/')).toBe('douyin')
    expect(guessSource('https://www.douyin.com/video/9876')).toBe('douyin')
  })

  it('detects zhihu', () => {
    expect(guessSource('https://www.zhihu.com/question/1')).toBe('zhihu')
    expect(guessSource('https://zhuanlan.zhihu.com/p/123')).toBe('zhihu')
  })

  it('detects xhs', () => {
    expect(guessSource('https://www.xiaohongshu.com/explore/abc')).toBe('xhs')
    expect(guessSource('https://xhslink.com/a/abc')).toBe('xhs')
  })

  it('detects wechat', () => {
    expect(guessSource('https://mp.weixin.qq.com/s/XXX')).toBe('wechat')
  })

  it('detects bilibili', () => {
    expect(guessSource('https://www.bilibili.com/video/BV1')).toBe('bilibili')
    expect(guessSource('https://b23.tv/abc')).toBe('bilibili')
  })

  it('returns null for unknown domains', () => {
    expect(guessSource('https://random-blog.com/post/1')).toBeNull()
  })

  it('returns null for invalid urls', () => {
    expect(guessSource('not-a-url')).toBeNull()
  })
})
