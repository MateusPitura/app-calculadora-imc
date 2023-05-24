import React, {useState, useCallback} from 'react'
import {FlatList, View, Text, Button, TouchableHighlight} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import StyleHistorico from '../style/historico';
import Lixeira from '../assets/icons/bin.svg';
import LinearGradient from "react-native-linear-gradient";

export default function(){

    const [data, setData] = useState([]);

    const handleFetchData = async () => {
        const response = await AsyncStorage.getItem("@meuimc:calculos");
        const data = response? JSON.parse(response) : [];
        setData(data);
    }

    const excluir = async (id: string) => {
        const response = await AsyncStorage.getItem("@meuimc:calculos");
        const previousData = response? JSON.parse(response) : [];
        const data = previousData.filter((item: any) => item.id !== id);
        await AsyncStorage.setItem("@meuimc:calculos", JSON.stringify(data));
        setData(data);
    }

    useFocusEffect(useCallback(()=>{handleFetchData()}, []))

    return(
        <View style={StyleHistorico.background}>
            <FlatList
                data={data}
                style={{paddingBottom: 200,}}
                keyExtractor={item=>item.id}
                renderItem={({item})=>
                <LinearGradient
                    colors=
                    {
                        (item.imc<18.5 || item.imc>24.9)
                    ?
                        ['rgba(253,29,29,1)', 'rgba(252,176,69,1)']
                    :
                        ['rgba(255,255,255,1)', 'rgba(0,0,0,0)']
                    }
                    style={{
                        margin: 20,
                        borderRadius: 10,
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={StyleHistorico.cards}>
                        <View style={StyleHistorico.informationSection}>
                            <Text style={StyleHistorico.informationText}>{item.date}</Text>
                            <Text style={StyleHistorico.informationText}>{item.peso} kg</Text>
                        </View>
                        <View style={StyleHistorico.resultSection}>
                            <Text style={StyleHistorico.resultText}>{item.imc}</Text>
                        </View>
                        <View style={StyleHistorico.buttonSection}>
                            <TouchableHighlight
                                onPress={()=>{excluir(item.id)}}
                            >
                                <Lixeira fill={'#2E2E2E'} width={40} height={40}/>
                            </TouchableHighlight>
                        </View>
                    </View>
                </LinearGradient>
                }
            />
        </View>
    )
}