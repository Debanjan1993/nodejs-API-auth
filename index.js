const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const app = new Koa();
const router = new Router();


router.get('/home', async(ctx) => {
    ctx.status = 200;
    ctx.body = 'Hello'
})

router.post('/posts', async(ctx) => {
    ctx.status = 200;
    ctx.body = 'Posts added';
})

router.post('/login', async(ctx) => {
    const user = {
        id: 1,
        name: "debanjan",
        email: "debnjan@bitqit.com"
    }
    jwt.sign({ user: user }, 'secretKey', (err, token) => {
        if (err) {
            ctx.status = 500;
        } else {
            ctx.status = 200;
            ctx.body = token;
        }
    })
})


app.use(async(ctx, next) => {
    const isRouteProtected = ['/posts', '/home'].includes(ctx.url);
    if (isRouteProtected) {
        const bearerHeader = ctx.headers['authorization'];
        if (bearerHeader) {
            const token = bearerHeader.split(" ").reverse()[0];
            jwt.verify(token, 'secretKey', (err, authData) => {
                if (err) {
                    ctx.status = 403
                } else {
                    next();
                }
            })
        } else {
            ctx.status = 403;
        }
    } else {
        await next();
    }
})

app.use(router.routes());
app.listen(3500, () => {
    console.log('App is running on port 3500');
})