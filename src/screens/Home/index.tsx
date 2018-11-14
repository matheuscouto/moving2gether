import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { orderBy } from 'lodash';
import ActionButton from 'react-native-action-button';
import DatabaseObservable from '../../services/DatabaseObservable';

import PinItem from '../../components/PinItem';

class HomeScreen extends React.Component<IMapDispatchToProps & NavigationScreenProps, {title?: string}> {
  public state: {title?: string} = {}

  static navigationOptions = {
    title: 'Pinned places',
  };

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
													return orderBy(pinList, ['rate'], ['desc']);
												}}>
          {
            (loadingPins: boolean, error: any, pinList: [{link: string, category: string, rate: number, key: string}]) => {
              if(loadingPins) return <ActivityIndicator size="small" color="black" />
              return (
                <ScrollView style={{width: '100%'}}>
                  { pinList.map((pin) => (
                    <PinItem link={pin.link} rate={pin.rate} fullMargin={false} key={pin.key} unpinIdea={this.handleUnpinIdea(pin.key)} editRating={this.handleEditRating(pin.key)} navigate={this.props.navigation.navigate} />
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

  private handleUnpinIdea = (pid: string) => () => Alert.alert(
    'Atenção',
    'Deseja realmente excluir?',
    [
      {text: 'Sim', onPress: () => this.props.unpinIdea(pid)},
      {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    ],
    { cancelable: true }
  )

  private handleEditRating = (pid: string) => (rate: number) => () => this.props.editRaring(pid, rate)
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
import { unpinIdea, editRating } from '../../store/app/pin';

/*****************************/
//   MAP DISPATCH TO PROPS   //
/*****************************/

interface IMapDispatchToProps {
  unpinIdea: (pid: string) => void;
  editRaring: (pid: string, rate: number) => void;
}

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({
  unpinIdea: (pid) => dispatch(unpinIdea.started({pid})),
  editRaring: (pid, rate) => dispatch(editRating.started({pid, rate})),
})

export default connect(null, mapDispatchToProps)(HomeScreen);