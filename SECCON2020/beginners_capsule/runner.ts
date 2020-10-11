import Docker from 'dockerode';
import tmp from 'tmp';
import path from 'path';
import concatStream from 'concat-stream';
import {promises as fs} from 'fs';
import BluePromise, {TimeoutError} from 'bluebird';
import type {Writable} from 'stream';
import {PassThrough} from 'stream';

const LIB = `
module.exports.enableSeccompFilter = () => {
  const {
    SCMP_ACT_ALLOW,
    SCMP_ACT_ERRNO,
    NodeSeccomp,
    errors: {EACCESS},
  } = require('node-seccomp');

  const seccomp = NodeSeccomp();

  seccomp
    .init(SCMP_ACT_ALLOW)
    .ruleAdd(SCMP_ACT_ERRNO(EACCESS), 'open')
    .ruleAdd(SCMP_ACT_ERRNO(EACCESS), 'openat')
    .load();

  delete require.cache[require.resolve('node-seccomp')];
};
`;

const HEADER = `
import * as fs from 'fs';
// @ts-ignore
import {enableSeccompFilter} from './lib.js';

class Flag {
  #flag: string;
  constructor(flag: string) {
    this.#flag = flag;
  }
}

const flag = new Flag(fs.readFileSync('flag.txt').toString());
fs.unlinkSync('flag.txt');

enableSeccompFilter();

`;

const docker = new Docker();

export const execute = async (code: string) => {
  const {tmpPath, cleanup} = await new BluePromise((resolve, reject) => {
    tmp.dir({unsafeCleanup: true}, (error, dTmpPath, dCleanup) => {
      if (error) {
        reject(error);
      } else {
        resolve({tmpPath: dTmpPath, cleanup: dCleanup});
      }
    });
  });

  const libPath = path.join(tmpPath, 'lib.js');
  const flagPath = path.join(tmpPath, 'flag.txt');
  const codePath = path.join(tmpPath, 'index.ts');

  await BluePromise.all([
    fs.writeFile(libPath, LIB),
    fs.writeFile(flagPath, process.env.FLAG),
    fs.writeFile(codePath, HEADER + code),
  ]);

  let outputWriter: Writable;

  const outputPromise = new BluePromise((resolve) => {
    outputWriter = concatStream((stderr) => {
      resolve(stderr);
    });
  });

  const dockerVolumePath = (() => {
    if (path.sep === '\\') {
      return tmpPath.replace('C:\\', '/c/').replace(/\\/g, '/');
    }

    return tmpPath;
  })();

  let container: Docker.Container;
  const containerPromise = (async () => {
    container = await docker.createContainer({
      Hostname: '',
      User: '',
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      OpenStdin: false,
      StdinOnce: false,
      Env: null,
      Cmd: ['/node_modules/.bin/ts-node', 'index.ts'],
      Image: 'beginners_capsule',
      WorkingDir: '/volume',
      Volumes: {
        '/volume': {},
      },
      HostConfig: {
        Binds: [`${dockerVolumePath}:/volume:rw`],
        Memory: 512 * 1024 * 1024,
      },
    });

    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });

    const stdoutWriter = new PassThrough();
    const stderrWriter = new PassThrough();
    stdoutWriter.on('data', (data) => outputWriter.write(data));
    stderrWriter.on('data', (data) => outputWriter.write(data));

    container.modem.demuxStream(stream, stdoutWriter, stderrWriter);

    stream.on('end', () => {
      outputWriter.end();
    });

    await container.start();
    await container.wait();
    const data = await container.inspect();
    await container.remove();
    return data;
  })();

  const runner = BluePromise.all([
    outputPromise,
    containerPromise,
  ]);

  try {
    const [output] = await runner.timeout(30000);
    cleanup();
    return output.toString().slice(0, 10000);
  } catch (error) {
    cleanup();
    if (error instanceof TimeoutError) {
      return 'Execution timed out (30s)';
    }
    return error.toString();
  }
};
