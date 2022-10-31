import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, Row, Rows } from 'react-native-table-component';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LogBox } from 'react-native';

import { RefreshAddToFavorites } from '../components/RefreshAddToFavorites';
import { Loader } from '../components/Loader';
import { HeaderText } from '../components/HeaderText';
import { InfoTextCenter } from '../components/InfoTextCenter';
import { ChartCoin } from '../components/ChartCoin';
import { TableMarkets } from '../components/TableMarkets';

import { TIME_PERIODS, PERIODS_OBJ } from '../constants/timePerionds';
import { Details } from '../components/Details';
import { getHistoryCoin } from '../api/getHistoryCoin';
import { getUrlCoin, getUrlHistory, getUrlMarkets } from '../api/getUrlCoin';
import { HEADER_MARKETS_TABLE } from '../constants/headerMarketsTable';
import { fixedNumber, pointsInNumber } from '../api/transformNumber';
import { currencyConverter } from '../api/currencyConverter';

const CoinSafeAreaView = styled.SafeAreaView`
    padding: 0 15px;
`;
const CoinScrollView = styled.ScrollView``;

export const CoinInfo = ({ route, navigation }) => {
    const {
        rateUsd,
        currencySymbol,
        symbol: symbolCur,
    } = useSelector((reducer) => reducer.currency);
    const { idCoin = 'bitcoin', title = 'Bitcoin' } = route.params;
    navigation.setOptions({
        title,
    });

    const [isLoading, setIsLoading] = React.useState(true);
    const [coin, setCoin] = React.useState({});
    const [historyCoin, setHistoryCoin] = React.useState([]);
    const [markets, setMarkets] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [timePeriod, setTimePeriod] = React.useState(null);
    const [items, setItems] = React.useState(TIME_PERIODS);

    const [isAddedToFavorites, setIsAddedToFavorites] = React.useState(false);
    const checkFavorites = async () => {
        const arr = (await AsyncStorage.getItem('favorites'))
            ? JSON.parse(await AsyncStorage.getItem('favorites'))
            : [];
        if (arr.find((e) => e === coin.id)) {
            setIsAddedToFavorites(true);
        }
    };
    checkFavorites();

    const fetchCoin = () => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        setTimePeriod(PERIODS_OBJ.TEN_MINUTES.value);
        setIsLoading(true);
        axios
            .get(getUrlCoin(idCoin))
            .then(({ data }) => {
                setCoin(data.data);
            })
            .catch(() => Alert.alert('Error', 'Failed to load!'));
        axios
            .get(getUrlMarkets(idCoin))
            .then(({ data }) => {
                const arrMarkets = data.data.map((e) => {
                    return [
                        e.exchangeId,
                        `${
                            currencySymbol ? currencySymbol : symbolCur
                        } ${pointsInNumber(
                            currencyConverter(e.priceUsd, rateUsd),
                            3,
                        )}`,
                        pointsInNumber(e.volumePercent, 5) + '%',
                    ];
                });
                setMarkets(arrMarkets);
            })
            .catch(() => Alert.alert('Error', 'Failed to load!'))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const changeTimePeriod = () => {
        switch (timePeriod) {
            case PERIODS_OBJ.TEN_MINUTES.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 720000;
                axios
                    .get(getUrlHistory(idCoin, 'm1', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistoryTenMinutes(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.THIRTY_MINUTES.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 2100000;
                axios
                    .get(getUrlHistory(idCoin, 'm5', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistoryThirtyMinutes(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.ONE_HOUR.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 4500000;
                axios
                    .get(
                        getUrlHistory(idCoin, 'm15', previousTime, currentTime),
                    )
                    .then(({ data }) => {
                        const arrHistoryCoin = getHistoryCoin.getHistoryOneHour(
                            data.data,
                            rateUsd,
                        );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.THREE_HOURS.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 12600000;
                axios
                    .get(
                        getUrlHistory(idCoin, 'm30', previousTime, currentTime),
                    )
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistoryThreeHours(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.SIX_HOURS.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 25200000;
                axios
                    .get(getUrlHistory(idCoin, 'h1', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistorySixHours(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.TWELVE_HOURS.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 50400000;
                axios
                    .get(getUrlHistory(idCoin, 'h2', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistoryTwelveHours(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.ONE_DAY.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 111600000;
                axios
                    .get(getUrlHistory(idCoin, 'h6', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin = getHistoryCoin.getHistoryOneDay(
                            data.data,
                            rateUsd,
                        );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.SEVEN_DAYS.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 691200000;
                axios
                    .get(getUrlHistory(idCoin, 'd1', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistorySevenDays(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.ONE_MONTH.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 2764800000;
                axios
                    .get(getUrlHistory(idCoin, 'd1', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistoryOneMonth(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.THREE_MONTHS.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 8121600000;
                axios
                    .get(getUrlHistory(idCoin, 'd1', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistoryThreeMonths(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.SIX_MONTHS.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 16156800000;
                axios
                    .get(getUrlHistory(idCoin, 'd1', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin =
                            getHistoryCoin.getHistorySixMonths(
                                data.data,
                                rateUsd,
                            );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
            case PERIODS_OBJ.ONE_YEAR.value: {
                let currentTime = Date.now();
                let previousTime = currentTime - 32227200000;
                axios
                    .get(getUrlHistory(idCoin, 'd1', previousTime, currentTime))
                    .then(({ data }) => {
                        const arrHistoryCoin = getHistoryCoin.getHistoryOneYear(
                            data.data,
                            rateUsd,
                        );
                        setHistoryCoin(arrHistoryCoin);
                    })
                    .catch(() => Alert.alert('Error', 'Failed to load!'));
                break;
            }
        }
    };

    const addToFavorites = async () => {
        const arr = await AsyncStorage.getItem('favorites');
        const favorites = arr ? JSON.parse(arr) : [];
        if (favorites.find((e) => e === coin.id)) {
            let newFavorites = favorites.filter((e) => e !== coin.id);
            await AsyncStorage.setItem(
                'favorites',
                JSON.stringify(newFavorites),
            );
            setIsAddedToFavorites(false);
        } else {
            favorites.push(coin.id);
            setIsAddedToFavorites(true);
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        }
    };

    React.useEffect(fetchCoin, []);
    React.useEffect(changeTimePeriod, [timePeriod]);

    return (
        <View style={{ backgroundColor: '#333333', height: '100%' }}>
            <RefreshAddToFavorites
                fetchCoins={fetchCoin}
                addToFavorites={addToFavorites}
                isAddedToFavorites={isAddedToFavorites}
            />
            {isLoading ? (
                <Loader />
            ) : (
                <ScrollView nestedScrollEnabled={true}>
                    <CoinSafeAreaView>
                        <CoinScrollView>
                            <Details
                                coin={coin}
                                currencySymbol={currencySymbol}
                                symbolCur={symbolCur}
                                rateUsd={rateUsd}
                            />
                        </CoinScrollView>
                        <InfoTextCenter text="Chart" />
                        <DropDownPicker
                            open={open}
                            value={timePeriod}
                            items={items}
                            setOpen={setOpen}
                            setValue={setTimePeriod}
                            setItems={setItems}
                            theme="DARK"
                            placeholder={'Select time period'}
                            dropDownDirection="AUTO"
                            bottomOffset={100}
                            selectedItemContainerStyle={{
                                backgroundColor: 'grey',
                            }}
                            listMode="MODAL"
                            modalTitle="Select time period"
                            modalContentContainerStyle={{
                                backgroundColor: '#333333',
                            }}
                            style={{
                                backgroundColor: '#333333',
                                borderRadius: 0,
                                borderColor: '#555555',
                            }}
                        />
                        <ChartCoin
                            historyCoin={historyCoin}
                            currencySymbol={currencySymbol}
                            symbolCur={symbolCur}
                            rateUsd={rateUsd}
                        />
                        <TableMarkets markets={markets} />
                    </CoinSafeAreaView>
                </ScrollView>
            )}
        </View>
    );
};
