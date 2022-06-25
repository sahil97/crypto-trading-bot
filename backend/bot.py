import pandas as pd
from datetime import datetime
import plotly.graph_objects as go
# from plotutils import plot_results

from binance.client import Client
from keys import api_key, secret_key 
from helper import *

def run_bot(coin='BTC', start_date='May 10, 2022', end_date='May 19, 2022'):
    client = Client(api_key, secret_key)

    # symbols = ['BTC']
    nstd = 3

    # coin = 'BTC'
    # start_str = 'May 10, 2022'
    # end_str = 'May 19, 2022'

    start_str = start_date
    end_str = end_date
    symbols = [coin]

    klines = client.get_historical_klines(symbol = f'{coin}USDT',
                                        interval = client.KLINE_INTERVAL_1MINUTE,
                                        start_str = start_str,
                                        end_str = end_str)

    cols = ['OpenTime',
            f'{coin}-USD_Open',
            f'{coin}-USD_High',
            f'{coin}-USD_Low',
            f'{coin}-USD_Close',
            f'{coin}-USD_volume',
            'CloseTime',
            f'{coin}-QuoteAssetVolume',
            f'{coin}-NumberOfTrades',
            f'{coin}-TBBAV',
            f'{coin}-TBQAV',
            f'{coin}-ignore']

    coins_df = pd.DataFrame(klines, columns=cols)

    coins_df['OpenTime'] = [datetime.fromtimestamp(ts/1000) for ts in coins_df['OpenTime']]
    coins_df['CloseTime'] = [datetime.fromtimestamp(ts/1000) for ts in coins_df['CloseTime']]

    for col in coins_df.columns:
        if not 'Time' in col:
            coins_df[col] = coins_df[col].astype(float)


    df = coins_df.copy()

    df['BTC_sma'] = sma(df['BTC-USD_Open'], 20)
    df['BTC_upper_band'], df['BTC_lower_band'] = bollinger_band(df['BTC-USD_Open'], df['BTC_sma'], 20, nstd)
    df.dropna(inplace=True)

    env = TradingEnv(balance_amount=100,balance_unit='USDT', trading_fee_multiplier=0.99925, symbols=['BTC'])

    for i in range(len(df)):
        if env.balance_unit == 'USDT':
            
            for symbol in symbols:
                if env.bottoms[symbol] == 'hit' and df[f'{symbol}-USD_Low'].iloc[i] > df[f'{symbol}_lower_band'].iloc[i]:
                    env.bottoms[symbol] = 'released'
                if df[f'{symbol}-USD_Low'].iloc[i] < df[f'{symbol}_lower_band'].iloc[i]: #buy signal
                    if env.bottoms[symbol] == 'released':
                        env.buy(symbol, df[f'{symbol}_lower_band'].iloc[i], df['OpenTime'].iloc[i])
                        env.reset_bottoms()
                        break
                    else:
                        env.bottoms[symbol] = 'hit'
                    
        if env.balance_unit != 'USDT':
            if env.tops[env.balance_unit] == 'hit' and (df[f'{env.balance_unit}-USD_High'].iloc[i] < df[f'{env.balance_unit}_upper_band'].iloc[i]):
                env.tops[env.balance_unit] = 'released'
                
            if df[f'{env.balance_unit}-USD_High'].iloc[i] > df[f'{env.balance_unit}_upper_band'].iloc[i]: #sell signal
                if env.tops[env.balance_unit] == 'released':
                    env.sell(df[f'{env.balance_unit}_upper_band'].iloc[i], df['OpenTime'].iloc[i])
                    env.reset_tops()
                else:
                    env.tops[env.balance_unit] = 'hit'

    if env.balance_unit != 'USDT':
        env.sell(df[f'{env.balance_unit}-USD_Close'].iloc[-1], df['OpenTime'].iloc[-1])

    print(f'num buys: {len(env.buys)}')
    print(f'num sells: {len(env.sells)}')
    print(f'ending balance: {env.balance_amount} {env.balance_unit}')

    return [env.buys, env.sells, round(env.balance_amount, 3), env.balance_unit]