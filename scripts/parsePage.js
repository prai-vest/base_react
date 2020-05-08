
const rp = require('@root/request')
const cheerio = require('cheerio')

module.exports = function parsePage(page) {
  const pageNum = page || 1

  let uri = 'http://www.ivworld.net'
  if (pageNum > 1) {
    uri += `/page/${pageNum}/`
  }

  return rp(uri)
  .then((response) => cheerio.load(response.body))
  .then(($) => {
    const posts = []
    $('.post').each(function processPost(i) {
      const postData = {
        contentHTML: [], idolName: '', marker: false, code: '',
      }
      postData.postDate = $('.postdate', this).html().replace('<br>', '-')
      const title = $('.posttitle', this).text()
      if (title !== 'Mirror website') {
        postData.title = title
        if (pageNum === 1 && i === 1) {
          postData.marker = true
        }
        // get code
        const regexResult = /\[([a-zA-Z]+-\w+)]/g.exec(postData.title)
        if (regexResult) {
          [, postData.code] = regexResult
        }

        postData.tags = $('.postmetadata a', this).map(function collectTags() {
          return $(this).text()
        }).get()

        const pTags = $('.entry p', this).toArray()
        // get title from ptag if it wasn't retrieved before
        if (postData.code === '') {
          const subtitle = $(pTags[0]).text()
          const regexResult2 = /\[?([a-zA-Z]+-\w+)\]?/g.exec(subtitle)
          if (regexResult2) {
            [, postData.code] = regexResult2
          }
        }
        // get image src
        pTags.slice(0, 2).forEach((item) => {
          const imgSrc = $(item).find('img').attr('src')
          if (imgSrc) {
            postData.imgSrc = imgSrc
          }
        })
        // get content html and actress name
        pTags.slice(2).forEach((item) => {
          if ($(item).hasClass('tags')) {
            postData.idolName = $('a', item).text()
          } else {
            postData.contentHTML.push($(item).html())
          }
        })
        posts.push(postData)
      }
    })
    return posts
  })
  .catch(() => {
    throw new Error(`Error parsing page ${pageNum}`)
  })
}
