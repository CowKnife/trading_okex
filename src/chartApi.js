const supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', 'D', 'W'];

let currentExchange = 'OKEX';

/**
 *
 * @param {string} exchange 交易所
 * @param {string} ticker 策略
 * @param {string} resolution 周期
 * @param {json} config 从本地读的json配置
 * @param {number} limit 最大条数
 */
const getBarsData = async (ticker, resolution, config, limit = 2000) => {
    console.warn('getBarsData');
    const exchange = ticker.split('!@#')[1];
    const symbol = config.tickers[exchange][ticker.split('!@#')[0]];
    console.table({
        exchange,
        ticker,
        resolution
    });
    let url = '';
    let type;
    switch (exchange) {
        case 'Binance':
            if (resolution === 'D') {
                type = '1d';
            } else if (resolution === 'W') {
                type = '1w';
            } else {
                const interval = Number(resolution);
                if (interval < 60) {
                    type = interval + 'm';
                } else {
                    type = interval / 60 + 'h';
                }
            }
            url = `https://www.binance.com/api/v1/klines?symbol=${symbol}&interval=${type}`;
            break;
        default:
            if (resolution === 'D') {
                type = 'day';
            } else if (resolution === 'W') {
                type = 'week';
            } else {
                const interval = Number(resolution);
                if (interval < 60) {
                    type = interval + 'min';
                } else {
                    type = interval / 60 + 'hour';
                }
            }
            url = `https://www.okex.com/v2/spot/markets/kline?symbol=${symbol}&type=${type}&coinVol=0&limit=${limit}`;
    }
    const response = await fetch(`${config.host}:${config.port}/proxy`, {
        method: 'POST',
        headers: new Headers({
            credentials: 'same-origin',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            url
        })
    });
    const result = await response.json();
    let finalResult = [];
    switch (exchange) {
        case 'Binance':
            finalResult = result.map(i => ({
                time: i[0],
                open: Number(i[1]),
                high: Number(i[2]),
                low: Number(i[3]),
                close: Number(i[4]),
                volume: Number(i[5])
            }));
            break;
        default:
            finalResult = result.data.map(i => ({
                time: i.time,
                open: Number(i.open),
                high: Number(i.high),
                low: Number(i.low),
                close: Number(i.close),
                volume: Number(i.volume)
            }));
    }
    return finalResult;
};

export default config => {
    return {
        onReady: async callback => {
            console.warn('chartApi onReady');
            callback({
                exchanges: config.exchanges,
                symbols_types: config.strategies,
                supported_resolutions: supportedResolutions,
                supports_marks: true
                // supports_timescale_marks: true,
            });
        },
        searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
            console.warn('chartApi searchSymbols ');
            console.table({ userInput, exchange, symbolType });
            if (exchange) {
                currentExchange = exchange;
                const arr = config.strategies.map(i => {
                    console.log(exchange);
                    console.log(config.tickers[exchange]);
                    return {
                        symbol: i.value,
                        full_name: i.name,
                        description: i.name,
                        exchange: currentExchange,
                        ticker: i.value + '!@#' + currentExchange,
                        type: 'bitcoin'
                    };
                });
                onResultReadyCallback(arr);
            }
        },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            console.warn('chartApi resolveSymbol');
            console.table({ symbolName });
            await setTimeout(() => {}, 0);
            onSymbolResolvedCallback({
                name: symbolName,
                description: '',
                type: 'crypto',
                session: '24x7',
                timezone: 'Etc/UTC',
                ticker: symbolName,
                exchange: currentExchange,
                minmov: 1,
                pricescale: 100000000,
                has_intraday: true,
                has_daily: true,
                has_weekly_and_monthly: true,
                intraday_multipliers: ['1', '3', '5', '15', '30', '60', '120', '240'],
                supported_resolutions: supportedResolutions,
                volume_precision: 8,
                data_status: 'streaming'
            });
        },
        getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
            console.warn('chartApi getBars');
            console.warn('getBars symbolInfo', symbolInfo);
            console.table({ resolution, from, to, firstDataRequest });
            const finalResult = await getBarsData(symbolInfo.ticker, resolution, config);
            let meta = {
                noData: false
            };
            if (finalResult.length === 0) {
                meta = {
                    noData: true
                    // nextTime: to
                };
            } else {
                if (finalResult[0].time > to * 1000) {
                    meta = {
                        noData: true
                        // nextTime: finalResult[finalResult.length - 1].time / 1000
                    };
                }
            }
            console.table(meta);
            onHistoryCallback(meta.noData ? [] : finalResult, meta);
        },
        subscribeBars: async (
            symbolInfo,
            resolution,
            onRealtimeCallback,
            subscriberUID,
            onResetCacheNeededCallback
        ) => {
            console.warn('chartApi subscribeBars');
            console.warn('subscribeBars symbolInfo', symbolInfo);
            console.table({ resolution, subscriberUID });
            const finalResult = await getBarsData(symbolInfo.ticker, resolution, config, 1);
            if (finalResult.length === 1) {
                onRealtimeCallback(finalResult[0]);
            }
        },
        unsubscribeBars: subscriberUID => {
            console.warn('chartApi unsubscribeBars');
            console.table({ subscriberUID });
        },
        calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
            console.warn('chartApi calculateHistoryDepth');
            console.table({ resolution, resolutionBack, intervalBack });
            // return resolution === 'D' ? {resolutionBack: 'M', intervalBack: 3} : undefined;
        },
        getMarks: async (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
            console.warn('chartApi getMarks');
            console.warn('getMarks symbolInfo', symbolInfo);
            console.table({ startDate, endDate, resolution });
            try {
                // const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8888`);
                const response = await fetch(`${config.host}:${config.port}/info`);
                const result = await response.json();
                onDataCallback(
                    result.map(i => ({
                        id: i.datetime + '',
                        time: Math.ceil(new Date(i.datetime).getTime() / 1000),
                        color: i.direction === '空' ? 'yellow' : 'blue',
                        label: i.direction,
                        text: `
                        <div>
                            <p>${i.offset}</p>
                            <p>价格：${i.price}</p>
                            <p>交易量：${i.volume}</p>
                        </div>
                    `,
                        labelFontColor: 'white',
                        minSize: 14
                    }))
                );
            } catch (e) {
                console.error('getMarks catch error', e);
            }
        },
        getServerTime: callback => {
            console.warn('chartApi getServerTime');
            // callback();
        }
    };
};
