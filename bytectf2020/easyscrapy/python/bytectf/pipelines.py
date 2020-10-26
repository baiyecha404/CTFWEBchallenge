import pymongo

class BytectfPipeline:
 
    def __init__(self):
    
        MONGODB_HOST = '172.18.0.2'
        MONGODB_PORT = 27017
        MONGODB_DBNAME = 'result'
        MONGODB_TABLE = 'result'
        MONGODB_USER = 'N0rth3'
        MONGODB_PASSWD = 'E7B70D0456DAD39E22735E0AC64A69AD'
        mongo_client = pymongo.MongoClient("%s:%d" % (MONGODB_HOST, MONGODB_PORT))
        mongo_client[MONGODB_DBNAME].authenticate(MONGODB_USER, MONGODB_PASSWD, MONGODB_DBNAME)
        mongo_db = mongo_client[MONGODB_DBNAME]
        self.table = mongo_db[MONGODB_TABLE]



    def process_item(self, item, spider):
        quote_info = dict(item)
        print(quote_info)
        self.table.insert(quote_info)
        return item
