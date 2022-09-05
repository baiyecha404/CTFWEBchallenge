import asyncio, os, pathlib, shutil, traceback
from flag1 import flag1

RM_INTERVAL = 20 * 60
HEALTH_CHECK_INTERVAL = 30

data_path = pathlib.Path('data')
backup_path = pathlib.Path.home() / 'backup'


async def background_task1():
    while True:
        await asyncio.sleep(RM_INTERVAL)
        for path_name in data_path.iterdir():
            try:
                shutil.rmtree(path_name)
            except:
                traceback.print_exc()


async def background_task2():
    while True:
        timer = asyncio.create_task(asyncio.sleep(HEALTH_CHECK_INTERVAL))
        processes = {timer}
        for path_name in data_path.iterdir():
            if not path_name.is_dir():
                continue
            async def run(path_name):
                try:
                    if 'docker-entry' in os.listdir(path_name):
                        # experimental
                        await asyncio.create_subprocess_shell(f'sudo chmod -R a+rwx {path_name}; cd {path_name}; chmod a+x ./docker-entry; docker run --rm --cpus=".25" -m="256m" -v=$(realpath .):/data -u=user -w=/data sandbox /data/docker-entry')
                    else:
                        await asyncio.create_subprocess_shell(f'sudo chmod -R a+rwx {path_name}; cd {path_name}; sudo -u nobody ./run')
                except:
                    pass
            processes.add(asyncio.create_task(run(path_name)))

        await asyncio.wait(processes)


if __name__ == '__main__':
    try:
        os.mkdir('data')
    except FileExistsError:
        pass

    async def run():
        os.chmod('flag1.py', 0o440)
        os.chmod('flag2', 0o440)
        os.chmod('data', 0o711)
        asyncio.create_task(background_task1())
        await background_task2()

    asyncio.run(run())