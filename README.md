# config.json说明
```json
{
    "title": "量化交易系统",
    "expires": 86400,
    "accounts": {
        "admin": "b123456c"
    },
    "host": "http://192.168.1.99",
    "port": "5000",
    "exchanges": [
        {
            "name": "OKEX",
            "value": "OKEX",
            "desc": "OKEX"
        },
        {
            "name": "Binance",
            "value": "Binance",
            "desc": "Binance"
        },
        {
            "name": "Bitmex",
            "value": "Bitmex",
            "desc": "Bitmex"
        }
    ],
    "strategies": [
        {
            "name": "revH_trade",
            "value": "revH_trade"
        },
        {
            "name": "fcv_btc_trade",
            "value": "fcv_btc_trade"
        },
        {
            "name": "fcv_eth_trade",
            "value": "fcv_eth_trade"
        },
        {
            "name": "fcv_eos_trade",
            "value": "fcv_eos_trade"
        }
    ],
    "tickers": {
        "OKEX": {
            "revH_trade": "btc_usdt",
            "fcv_btc_trade": "btc_usdt",
            "fcv_eth_trade": "eth_usdt",
            "fcv_eos_trade": "eos_usdt"
        },
        "Binance": {
            "revH_trade": "BTCUSDT",
            "fcv_btc_trade": "BTCUSDT",
            "fcv_eth_trade": "ETHUSDT",
            "fcv_eos_trade": "EOSUSDT"
        },
        "Bitmex": {
            "revH_trade": "XBTUSD",
            "fcv_btc_trade": "XBTUSD",
            "fcv_eth_trade": "ETHUSD",
            "fcv_eos_trade": "EOSZ18"
        }
    },
    "klineLimit": {
        "OKEX": 2000,
        "Binance": 500,
        "Bitmex": 1440
    }
}
```