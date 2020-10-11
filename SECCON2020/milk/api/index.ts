import {Application} from 'https://deno.land/x/oak/mod.ts';
import normalizeUrl from 'https://dev.jspm.io/normalize-url';
import type {UserSchema} from './mongo.ts';
import users from './users.ts';
import notes from './notes.ts';
import root from './root.ts';

interface State {
  user: UserSchema,
}

const app = new Application<State>({keys: [Math.random().toString()]});

// Logger
app.use(async (ctx, next) => {
  try {
    await next();
    console.log(`${ctx.request.method} ${ctx.request.url}`);
  } catch (e) {
    console.error(e);
  }
});

// Referer validation
app.use(async (ctx, next) => {
  const referer = ctx.request.headers.get('referer');
  if (!referer) {
    ctx.response.body = 'Referer header is not set';
    ctx.response.status = 400;
    return;
  }

  // @ts-ignore
  const refererUrl = new URL(normalizeUrl(referer));
  if (refererUrl.host !== 'milk.chal.seccon.jp') {
    ctx.response.body = 'Bad Referer header';
    ctx.response.status = 400;
    return;
  }

  await next();
});

app.use(root.routes());
app.use(users.routes());
app.use(notes.routes());

await app.listen({port: 8000});