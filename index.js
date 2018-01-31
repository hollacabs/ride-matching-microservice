const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./router');

let app = new Koa();

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.use(ctx => {
  ctx.body = 'Hello Koa';
});

let port = 3000;

app.listen(port, () => {
  console.log('Koa is listening on port ' + port);
});
