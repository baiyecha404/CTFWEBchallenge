import {Router} from 'https://deno.land/x/oak/mod.ts';
import {Users} from './mongo.ts';

const router = new Router({prefix: '/users'});

router.get('/signup', async (ctx) => {
  const username = ctx.request.url.searchParams.get('username') || '';
  const password = ctx.request.url.searchParams.get('password') || '';

  if (username.length < 8 || 32 < username.length || password.length < 8 || 32 < password.length) {
    ctx.response.status = 400;
    return;
  }

  const user = await Users.findOne({username});
  if (user) {
    ctx.response.status = 409;
    ctx.response.body = 'User already exists';
    return;
  }

  await Users.insertOne({username, password, admin: false});

  ctx.cookies.set('username', username);
  ctx.response.body = 'ok';
});

router.get('/signin', async (ctx) => {
  const username = ctx.request.url.searchParams.get('username') || '';
  const password = ctx.request.url.searchParams.get('password') || '';

  if (username.length < 8 || 32 < username.length || password.length < 8 || 32 < password.length) {
    ctx.response.status = 400;
    return;
  }

  const user = await Users.findOne({username, password});
  if (!user) {
    ctx.response.status = 422;
    ctx.response.body = 'Bad authentication';
    return;
  }

  ctx.cookies.set('username', username);
  ctx.response.body = 'ok';
});

router.get('/signout', (ctx) => {
  ctx.cookies.delete('username');
  ctx.response.body = 'ok';
});

export default router;