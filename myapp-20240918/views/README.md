xy:
本文件夹存放所有前端HTML页面，使用jade(pug)前端模板引擎

浏览器输入localhost:2024,app.js根据框架代码初始的index.js(工程中被我更名为index_route.js)
/* GET home page. */
//xy: 跳转至未登录的index界面
router.get('/', function (req, res, next) {
  res.render('index.jade', { title: 'AutoChem' , udpStatus: "hello", username: req.session.username });
  //res.render('index.jade', { title: 'AutoChem' , udpStatus: "hello"});
});
开始渲染index界面。这里index把导航栏其他功能的按钮disable掉了，强制用户登录。
用户登录后路由跳转到index_logged.jade进行渲染，这里其他功能的按钮可以点击。
这种用户登录的方法不科学不合理，但对于初学的我来说最快能够实现~
弊端：用户只需要在浏览器地址栏直接输入发送URL请求依旧可以不登录直接跳转,
后期可以使用一个全局变量代表是否登录，根据全局变量的状态进行路由跳转渲染，
暂时就钻个空子叭hhh