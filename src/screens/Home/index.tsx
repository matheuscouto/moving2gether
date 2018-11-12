import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { orderBy } from 'lodash';
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/FontAwesome';
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
                    <PinItem link={pin.link} rate={pin.rate} key={pid} />
                  ))}
                </ScrollView>
              )
            }
          }
        </DatabaseObservable>
        <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={() => this.props.navigation.navigate('NewPinModal')} visible={true} iconTextComponent={<Icon name="plus"/>} />
      </View>
    );
  }
}

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

/*****************************/
//   MAP DISPATCH TO PROPS   //
/*****************************/

interface IMapDispatchToProps {}

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({})

export default connect(null, mapDispatchToProps)(HomeScreen);