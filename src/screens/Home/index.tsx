import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableWithoutFeedback } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { orderBy } from 'lodash';
import ActionButton from 'react-native-action-button';
import DatabaseObservable from '../../services/DatabaseObservable';

import PinItem from '../../components/PinItem';
import Icon from 'react-native-vector-icons/Ionicons';

class HomeScreen extends React.Component<IMapDispatchToProps & NavigationScreenProps, {title?: string, viewMode: 'list' | 'image'}> {
  public state: {title?: string, viewMode: 'list' | 'image'} = {
    viewMode: 'list'
  }

  static navigationOptions = {
    title: 'Pinned places',
  };

  private handleSwitchView = (viewName: 'list' | 'image') => () => {
    this.setState(state => ({
      ...state,
      viewMode: viewName
    }))
  }

  public render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <View style={{paddingRight:50, paddingLeft: 50, paddingTop: 5,height: 50, width: '100%', borderBottomColor: '#E1E7ED', borderBottomWidth: 1, borderStyle: 'solid', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <TouchableWithoutFeedback onPress={this.handleSwitchView('list')}>
            <Icon name="ios-list" color={this.state.viewMode==='list' ? '#3780FF' : '#B4C1D8'} size={27}  />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleSwitchView('image')}>
            <Icon name="ios-image" color={this.state.viewMode==='image' ? '#3780FF' : '#B4C1D8'} size={27}  />
          </TouchableWithoutFeedback>
        </View>
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
            (loadingPins: boolean, error: any, pinList: [{link: string, category: string, rate: number, key: string, timestamp: number}]) => {
              if(loadingPins) return <ActivityIndicator size="small" color="black" />
              return (
                <ScrollView style={{width: '100%'}}>
                  { pinList.map((pin) => (
                    <PinItem
                      link={pin.link}
                      rate={pin.rate}
                      fullMargin={false}
                      key={pin.key}
                      unpinIdea={this.handleUnpinIdea(pin.key)}
                      editRating={this.handleEditRating(pin.key)}
                      navigate={this.props.navigation.navigate}
                      viewMode={this.state.viewMode}
                      creationTime={pin.timestamp}
                    />
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