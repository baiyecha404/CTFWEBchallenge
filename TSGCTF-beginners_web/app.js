const fastify = require('fastify');
const nunjucks = require('nunjucks');
const crypto = require('crypto');


const converters = {};

const flagConverter = (input, callback) => {
  const flag = 'TSGCTF{Goo00o0o000o000ood_job!_you_are_rEADy_7o_do_m0re_Web}';
  callback(null, flag);
};

const base64Converter = (input, callback) => {
  try {
    const result = Buffer.from(input).toString('base64');
    callback(null, result)
  } catch (error) {
    callback(error);
  }
};

const scryptConverter = (input, callback) => {
  crypto.scrypt(input, 'I like sugar', 64, (error, key) => {
    if (error) {
      callback(error);
    } else {
      callback(null, key.toString('hex'));
    }
  });
};


const app = fastify();
app.register(require('point-of-view'), {engine: {nunjucks}});
app.register(require('fastify-formbody'));
app.register(require('fastify-cookie'));
app.register(require('fastify-session'), {secret: Math.random().toString(2), cookie: {secure: false}});

app.get('/', async (request, reply) => {
  reply.view('index.html', {sessionId: request.session.sessionId});
});

app.post('/', async (request, reply) => {
  console.log(request.body);
  
  if (request.body.converter.match(/[FLAG]/)) {
    throw new Error("Don't be evil :)");
  }

  if (request.body.input.length < 10) {
    throw new Error('Too short :(');
  }

  if (request.body.input.length > 1000) {
    throw new Error('Too long :(');
  }

  converters['base64'] = base64Converter;
  converters['scrypt'] = scryptConverter;
  converters[`FLAG_${request.session.sessionId}`] = flagConverter;
  console.log(converters);
  
  const result = await new Promise((resolve, reject) => {
    converters[request.body.converter](request.body.input, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

  reply.view('index.html', {
    input: request.body.input,
    result,
    sessionId: request.session.sessionId,
  });
});

app.setErrorHandler((error, request, reply) => {
  reply.view('index.html', {error, sessionId: request.session.sessionId});
});

app.listen(59101, '0.0.0.0');