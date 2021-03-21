const request = require('request');

request({
          
    uri: `http://127.0.0.1/addsub`,
    qs: {
      email: {
        har: {
        url: 'http://127.0.0.1/har'
      }
    },
    }
}).pipe(process.stdout);
