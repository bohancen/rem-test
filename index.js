const path = require('path')
const {
  title,
  basename,
  metas=[],
  version,
  static_path,
} = require('./config.list')

// 配置html
const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${title}</title>
  <meta name="basename" content="${basename}"/>
  <meta name="version" content="${version}"/>
  <meta name="static_path" content="${static_path}"/>
${metas.reduce((pre,{name,content})=>{
  pre+=`\n  <meta name="${name}" content="${content}"/>`
  return pre
},'')}
  <link rel="stylesheet" href="${static_path}/animate.min.css"/>
  <link rel="stylesheet" href="${static_path}/index.css"/>
  <script>
      function resetWidth() {
        var docEl = document.documentElement
        var rem = (docEl.getBoundingClientRect().width/640)*32
        rem = rem>22?22 : rem
        docEl.style.fontSize = rem + 'px';
      }
      resetWidth();
      window.addEventListener('resize', function () {
        resetWidth();
      })
  </script>
  {{append_head}}
</head>

<body>
    <div class="root" id="root"></div>
    <script type="text/javascript" src="${static_path}/react.js"></script>
    <script type="text/javascript" src="${static_path}/react-dom.js"></script>
    <script type="text/javascript" src="${static_path}/index.js"></script>
    {{append_body}}
</body>

</html>
`

module.exports=function(app,express,append_body=''){

  // 静态资源
  // app.use(static_path,express.static(path.resolve(__dirname, './static/')))
  app.use(static_path,express.static(path.resolve(__dirname, './static/')))

  // 通配路由
  // let router_basename_all = path.join(basename,'./*')
  app.get(basename,(req,res)=>{
    let csrfToken = req.csrfToken ? req.csrfToken() : ''
    let send_html = html.replace('{{append_head}}',`<meta name="csrf-token" content="${csrfToken}"/>`)
    send_html = send_html.replace('{{append_body}}',append_body)
    res.send(send_html)
  })
}