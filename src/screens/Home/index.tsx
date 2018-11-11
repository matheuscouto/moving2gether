import React from 'react';
import { View, Text, AlertIOS } from 'react-native';
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dispatch } from 'redux';
import { pinIdea } from '../../store/app/pin';
import { connect } from 'react-redux';
import DatabaseObservable from '../../services/DatabaseObservable';
import { map } from 'lodash';

class HomeScreen extends React.Component<IMapDispatchToProps> {
  
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <DatabaseObservable path="/pins">
          {
            (loadingPins: boolean, error: any, pinCollection: {[pid: string]: {link: string, category: string}}) => {
              if(loadingPins) return <Text>Loading pins...</Text>
              return (
                <View>
                  {map(pinCollection, (pin, pid) => (
                    <Text key={pid}>{pin.link}</Text>
                  ))}
                </View>
              )
            }
          }
        </DatabaseObservable>
        <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={this.handleNewPinModal} visible={true} iconTextComponent={<Icon name="plus"/>} />
      </View>
    );
  }

  private handleNewPinModal = () => {
    AlertIOS.prompt(
      'Cole o link aqui',
      '',
      this.handleCreateNewPin
    );
  }

  private handleCreateNewPin = (link: string) => {
    this.props.newPin(link)
  }
}

/*****************************/
//   MAP DISPATCH TO PROPS   //
/****************************/

interface IMapDispatchToProps {
  newPin: (link: string) => void
}

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({
  newPin: (link) => dispatch(pinIdea.started({link, category: '-'}))
})

export default connect(null, mapDispatchToProps)(HomeScreen);