import {Router} from 'https://deno.land/x/oak/mod.ts';
import {v4 as UUID} from 'https://deno.land/std/uuid/mod.ts';
import {Tokens} from './mongo.ts';

const router = new Router();

router.get('/csrf-token', async (ctx) => {
  const username = ctx.cookies.get('username') || '';

  if (ctx.request.url.search.length <= 12) {
    ctx.response.body = 'Path is shorter than expected';
    ctx.response.status = 400;
    return;
  }

  const token = UUID.generate();
  await Tokens.insertOne({token, username});

  ctx.response.body = `csrfTokenCallback('${token}')`;
  ctx.response.headers.set('Content-Type', 'text/javascript');
});

export default router;