// Default Helmet props
export default Object.freeze({
  htmlAttributes: {lang: 'en'},
  title: 'Title',
  defaultTitle: 'Default Title',
  titleTemplate: '%s - 一个好玩的地方',
  meta: [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'}
  ],
  link: [
    {rel: 'shortcut icon', href: '/favicon.ico'}
  ],
  script: [],
  style: []
})
