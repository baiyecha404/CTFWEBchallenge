import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import qs from 'querystring';
import {promises as fs} from 'fs';
import axios from 'axios';
import {execute} from './runner';

const app = fastify({trustProxy: '127.0.0.1'});
app.register(fastifyStatic, {
  root: __dirname,
});

app.get('/', (request, reply) => {
  reply.type('text/html');
  reply.sendFile('index.html');
  console.log(`[${new Date().toISOString()}]  GET / 200`);
});

app.post('/', async (request, reply) => {
  if (typeof request.body !== 'string') {
    reply.status(400);
    reply.send('Bad Request');
    return;
  }

  const params = qs.parse(request.body);
  if (typeof params.code !== 'string' || params.code.length > 2000 || typeof params.token !== 'string') {
    reply.status(400);
    reply.send('Bad Request');
    return;
  }

  const {data: challengeResult} = await axios({
    method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    data: qs.stringify({
      secret: process.env.RECAPTCHA_SECRET,
      response: params.token,
      remoteip: request.ip,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!challengeResult.success) {
    reply.status(422);
    reply.send('reCAPTCHA failed');
    return;
  }

  try {
    const result = await execute(params.code.toString());

    reply.type('text/plain');
    reply.send(result);
    if (result.includes('SECCON{')) {
      await fs.writeFile(`../solutions/${Date.now()}.json`, JSON.stringify({
        ip: request.ip,
	      code: params.code,
        result,
      }, null, '  '));
    }

    console.log(`[${new Date().toISOString()}] POST / 200 ${JSON.stringify(params.code)}`);
  } catch (e) {
    console.error(e);
    console.log(`[${new Date().toISOString()}] POST / 500 ${JSON.stringify(params.code)}`);
  }
});

app.listen(65433);
