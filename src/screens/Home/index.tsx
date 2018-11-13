import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { orderBy } from 'lodash';
import ActionButton from 'react-native-action-button';
import DatabaseObservable from '../../services/DatabaseObservable';

import PinItem from '../../components/PinItem';

class HomeScreen extends React.Component<IMapDispatchToProps & NavigationScreenProps, {title?: string}> {
  public state: {title?: string} = {}

  public render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <DatabaseObservable path="/pins" snapMap={(snap) => {
													const pinList: any = [];
													snap.forEach((rowSnap): any => {
														pinList.push({
															rate: rowSnap.child('rate').val(),
                              link: rowSnap.child('link').val(),
                              key: rowSnap.key
														}); 
                          });
													return orderBy(pinList, ['rate'],['desc']);
												}}>
          {
            (loadingPins: boolean, error: any, pinList: [{link: string, category: string, rate: number}]) => {
              if(loadingPins) return <Text>Loading pins...</Text>
              console.log(' ORDERED LIST: ', pinList)
              return (
                <ScrollView style={{width: '100%'}}>
                  { pinList.map((pin, pid) => (
                    <PinItem link={pin.link} rate={pin.rate} fullMargin={false} key={pid} />
                  ))}
                </ScrollView>
              )
            }
          }
        </DatabaseObservable>
        <ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => this.props.navigation.navigate('NewPinModal')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

/*****************************/
//   MAP DISPATCH TO PROPS   //
/*****************************/

interface IMapDispatchToProps {}

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({})

export default connect(null, mapDispatchToProps)(HomeScreen);