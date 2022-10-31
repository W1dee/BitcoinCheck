import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import React from 'react';

const RefreshView = styled.View`
    padding: 10px 15px;
    flex-direction: row;
`;

export const Refresh = ({
    fetchCoins,
    navigation,
    iconName = 'bookmark-outline',
    pathForIcon = 'Home',
}) => {
    return (
        <RefreshView>
            <TouchableOpacity>
                <Icon
                    size={24}
                    name={iconName}
                    color="white"
                    onPress={() => navigation.navigate(pathForIcon)}
                />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
                <Icon
                    size={24}
                    name="reload"
                    color="white"
                    onPress={fetchCoins}
                />
            </TouchableOpacity>
        </RefreshView>
    );
};
