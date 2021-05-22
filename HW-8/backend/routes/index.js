let express = require('express');
let http = require('https');
let router = express.Router();
let path = require('path')
let tiingo_token = '89a2957e50090a2dd5a1a5b021eda5036cb451be';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')
  res.send('1')
});

router.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')
  res.send('1')
});

router.get('/auto', function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')
  res.send('');
})

router.get('/auto/:kw', function(req, res, next){
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')

  const options = {
    host: 'api.tiingo.com',
    path: '/tiingo/utilities/search/' + req.params['kw'],
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + tiingo_token,
    },
  };

  let body_chunks = '';
  http.get(options, function(query_res){
    query_res.on('data', function(chunks) {
      body_chunks += chunks;
    }).on('end', function() {
      res.send(body_chunks);
    })
  }).on('error', function(e) {
    res.send('ERROR: ' + e.message);
  });
});


router.get('/general/:ticker', function(req, res, next) {

  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')

  const options = {
    host: 'api.tiingo.com',
    path: '/tiingo/daily/' + req.params['ticker'],
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + tiingo_token,
    },
  };

  let body_chunks = '';
  http.get(options, function(query_res){
    query_res.on('data', function(chunks) {
      body_chunks += chunks;
    }).on('end', function() {
      res.send(body_chunks);
    })
  }).on('error', function(e) {
    res.send('ERROR: ' + e.message);
  });
});

router.get('/lastprice/:ticker', function(req, res, next) {

  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')

  const options = {
    host: 'api.tiingo.com',
    path: '/iex/?tickers=' + req.params['ticker'],
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + tiingo_token,
    },
  };

  let body_chunks = '';
  http.get(options, function(query_res){
    query_res.on('data', function(chunks) {
      body_chunks += chunks;
    }).on('end', function() {
      res.send(body_chunks);
    })
  }).on('error', function(e) {
    res.send('ERROR: ' + e.message);
  });

});


router.get('/oneday/:ticker/:date', function(req, res, next) {

  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')

  const options = {
    host: 'api.tiingo.com',
    path: '/iex/' + req.params['ticker'] + '/prices?startDate=' + req.params['date'] + '&resampleFreq=4min',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + tiingo_token,
    },
  };

  let body_chunks = '';
  http.get(options, function(query_res){
    query_res.on('data', function(chunks) {
      body_chunks += chunks;
    }).on('end', function() {
      res.send(body_chunks);
    })
  }).on('error', function(e) {
    res.send('ERROR: ' + e.message);
  });

});


router.get('/historical/:ticker/:date', function(req, res, next) {

  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Origin, Access-Control-Allow-Headers')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')

  let date = new Date(req.params['date']);
  date.setFullYear(date.getFullYear() - 2);
  date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

  const options = {
    host: 'api.tiingo.com',
    path: '/tiingo/daily/' + req.params['ticker'] + '/prices?startDate=' + date + '&resampleFreq=daily',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + tiingo_token,
    },
  };

  let body_chunks = '';
  http.get(options, function(query_res){
    query_res.on('data', function(chunks) {
      body_chunks += chunks;
    }).on('end', function() {
      res.send(body_chunks);
    })
  }).on('error', function(e) {
    res.send('ERROR: ' + e.message);
  });

});


router.get('/graph/:ticker/:today', function(req, res, next){
  res.sendFile(path.join(__dirname, 'graph.html'));
});


router.get('/news/:ticker', function(req, res, next){

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.header('Access-Control-Max-Age', '86400')

  const options = {
    host: 'newsapi.org',
    path: '/v2/everything?apiKey=6ade30097e5e4bbab10e1b499be4352e&q=' + req.params['ticker'],
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + tiingo_token,
    },
  };

  let body_chunks = '';
  const articleList = [];
  http.get(options, function(query_res){
    query_res.on('data', function(chunks) {
      body_chunks += chunks;
    }).on('end', function() {
      const rawData = JSON.parse(body_chunks);
      const num = Math.min(rawData.totalResults, 20);
      const aList = rawData.articles;
      for (let i = 0; i < num; i ++) {
        // aList[i].source.name = escape(aList[i].source.name);
        // aList[i].source.id = escape(aList[i].source.id);
        // aList[i].urlToImage = escape(aList[i].urlToImage);
        // aList[i].title = escape(aList[i].title);
        aList[i].publishedAt = new Date(aList[i].publishedAt).getTime() / 1000;
        // aList[i].url = escape(aList[i].url);
        // aList[i].author = escape(aList[i].author);
        // aList[i].content = escape(aList[i].content);
        // aList[i].description = escape(aList[i].description);
        articleList.push(aList[i]);
      }
      res.send(JSON.stringify(articleList));
    })
  }).on('error', function(e) {
    res.send('ERROR: ' + e.message);
  });
});

router.get('/nopic', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'nopic.jpg'))
})


module.exports = router;
