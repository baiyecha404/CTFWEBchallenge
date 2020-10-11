import {Router} from 'https://deno.land/x/oak/mod.ts';
import {ObjectId} from 'https://deno.land/x/mongo/ts/types.ts';
import {Notes, Tokens, Users} from './mongo.ts';

const router = new Router({prefix: '/notes'});

// CSRF Token validation
router.use(async (ctx, next) => {
  const tokenString = ctx.request.url.searchParams.get('token') || '';
  const token = await Tokens.findOne({token: tokenString});
  if (!token) {
    ctx.response.body = 'Bad CSRF token';
    ctx.response.status = 400;
    return;
  }
  if (token.username === '') {
    ctx.response.status = 403;
    return;
  }

  await Tokens.deleteOne({_id: token._id});

  ctx.state.user = (await Users.findOne({username: token.username}))!;

  await next();
});

router.get('/get', async (ctx) => {
  const id = ctx.request.url.searchParams.get('id') || '';

  const note = await Notes.findOne({_id: ObjectId(id)});
  if (!note) {
    ctx.response.status = 404;
    return;
  }
  if (note.username !== ctx.state.user.username && !ctx.state.user.admin) {
    ctx.response.status = 403;
    return;
  }

  ctx.response.body = {ok: true, note};
});

router.get('/post', async (ctx) => {
  const body = ctx.request.url.searchParams.get('body') || '';
  if (body.length > 1000) {
    ctx.response.status = 400;
    return;
  }

  const note = await Notes.insertOne({username: ctx.state.user.username, body});

  ctx.response.body = {ok: true, note};
});

router.get('/flag', async (ctx) => {
  if (!ctx.state.user.admin) {
    ctx.response.body = 'Flag is the privilege available only from admin, right?';
    ctx.response.status = 403;
    return;
  }

  ctx.response.body = Deno.env.get('FLAG');
});

export default router;