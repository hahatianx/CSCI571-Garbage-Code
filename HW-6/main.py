from flask import Flask,  render_template
import json
import requests
import datetime, time
import functools
from dateutil.relativedelta import relativedelta


app = Flask(__name__, static_url_path='/static')
TIINGO_TOKEN = '89a2957e50090a2dd5a1a5b021eda5036cb451be'


def tiingo_get_data(method_type, ticker):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token {}'.format(TIINGO_TOKEN),
    }
    url = 'https://api.tiingo.com/{}/{}'.format(method_type, ticker)
    response = requests.get(url, headers=headers).json()
    if method_type == 'iex':
        if len(response) == 0:
            success, response = False, None
        else:
            success, response = True, response[0]
    else:
        if len(response) == 1:
            success, response = False, None
        else:
            success, response = True, response
    return success, response


@app.route('/getHistory/<ticker>', methods=['GET'])
def retrieve_history_data(ticker):
    def tiingo_get_history(ticker):
        def calc_date():
            cur_date = datetime.date.today()
            date_delta = relativedelta(months=6)
            start_date = cur_date - date_delta
            return start_date

        start_date = calc_date()
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token {}'.format(TIINGO_TOKEN),
        }
        url = 'https://api.tiingo.com/iex/{}/prices?startDate={}&resampleFreq=12hour&columns=close,volume'.format(
            ticker, start_date,
        )
        response = requests.get(url, headers=headers).json()
        close_list, volume_list = [], []
        for each_sample in response:
            close_list.append((each_sample['date'], round(each_sample['close'], 2)))
            volume_list.append((each_sample['date'], each_sample['volume']))
        return close_list, volume_list

    stock_name = ticker.split('=')[1].lower()
    close_list, volume_list = tiingo_get_history(stock_name)
    ok = True if len(close_list) > 0 else False
    ret_dict = {
        'status': ok,
        'close_list': close_list,
        'volume_list': volume_list,
    }
    return json.dumps(ret_dict)


@app.route('/getDaily/<ticker>', methods=['GET'])
def retrieve_daily_data(ticker):

    def calc_tiingo_daily_data(input_dict):
        if input_dict is None:
            return None
        company_name = input_dict['name']
        stock_ticker_symbol = input_dict['ticker']
        stock_exchange_code = input_dict['exchangeCode']
        company_start_date = input_dict['startDate']
        description = input_dict['description']
        return{
            'company_name': company_name,
            'stock_ticker_symbol': stock_ticker_symbol,
            'stock_exchange_code': stock_exchange_code,
            'company_start_date': company_start_date,
            'description': description,
        }

    stock_name = ticker.split('=')[1].lower()
    ok, tiingo_info = tiingo_get_data('tiingo/daily', stock_name)
    # if we get a no, that means this name is invalid, return false directly
    ret_dict = {
        'status': ok,
        'data': calc_tiingo_daily_data(tiingo_info),
    }
    return json.dumps(ret_dict)


@app.route('/getIex/<ticker>', methods=['GET'])
def retrieve_iex_data(ticker):

    def calc_tiingo_iex_data(input_dict):
        if input_dict is None:
            return None
        stock_ticker_symbol = input_dict['ticker']
        trading_day = input_dict['timestamp'][:10]
        previous_closing_price = input_dict['prevClose']
        opening_price = input_dict['open']
        high_price = input_dict['high']
        low_price = input_dict['low']
        last_price = input_dict['last']
        change = last_price - previous_closing_price
        change_percentage = '{:.2f}%'.format(change * 100 / previous_closing_price)
        shares_traded = input_dict['volume']
        return {
            'stock_ticker_symbol': stock_ticker_symbol,
            'trading_day': trading_day,
            'previous_closing_price': round(previous_closing_price, 2),
            'opening_price': round(opening_price, 2),
            'high_price': round(high_price, 2),
            'low_price': round(low_price, 2),
            'last_price': round(last_price, 2),
            'change': round(change, 2),
            'change_percentage': change_percentage,
            'number_of_shares_traded': shares_traded,
        }

    stock_name = ticker.split('=')[1].lower()
    ok, tiingo_info = tiingo_get_data('iex', stock_name)
    ret_dict = {
        'status': ok,
        'data': calc_tiingo_iex_data(tiingo_info),
    }
    return json.dumps(ret_dict)


@app.route('/getNews/<ticker>', methods=['GET'])
def retrieve_news_data(ticker):

    def retrieve_news(ticker):

        url = 'https://newsapi.org/v2/everything?apiKey=6ade30097e5e4bbab10e1b499be4352e&q={}'.format(ticker)
        headers = {
            'Content-Type': 'application/json',
        }
        response = requests.get(url, headers=headers).json()
        status = response['status']
        ok = False if status.upper() == 'ERROR' else True
        if not ok:
            response = None
        return ok, response

    def calc_news_data(input_dict):

        def time_comp(x, y):
            x = time.mktime(time.strptime(x['publishedAt'], '%Y-%m-%dT%H:%M:%SZ'))
            y = time.mktime(time.strptime(y['publishedAt'], '%Y-%m-%dT%H:%M:%SZ'))
            return y - x

        if input_dict is None:
            return None
        nums = input_dict['totalResults']
        articles = sorted(input_dict['articles'], key=functools.cmp_to_key(time_comp))
        ret_list = []
        for i in range(min(5, nums)):
            ret_list.append({
                'image': articles[i]['urlToImage'],
                'title': articles[i]['title'],
                'date': articles[i]['publishedAt'],
                'link': articles[i]['url'],
            })
        return ret_list

    stock_name = ticker.split('=')[1].lower()
    ok, news_info = retrieve_news(stock_name)
    ret_dict = {
        'status': ok,
        'data': calc_news_data(news_info),
    }
    return json.dumps(ret_dict)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
