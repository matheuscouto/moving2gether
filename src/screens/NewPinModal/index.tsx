import React from 'react';
import { View, Text, TouchableWithoutFeedback, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dispatch } from 'redux';
import { pinIdea } from '../../store/app/pin';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';

interface IState {
  link: string,
  rate: 1 | 2 | 3 | 4 | 5,
}

class HomeScreen extends React.Component<IMapDispatchToProps & NavigationScreenProps, IState> {
  state: IState = {
    link: '',
    rate: 2
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', padding: 20, backgroundColor: 'rgba(55, 55, 55, 0.5)' }}>
      <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} ><View style={{flex:1, width: '100%'}} /></TouchableWithoutFeedback>
        <View style={{ padding: 18, width: '100%',  backgroundColor: 'white', shadowColor: 'black', shadowRadius: 5, shadowOffset: { width: 5, height: 5 }, justifyContent:"center", borderRadius: 4, alignItems: 'center'}}>
          <Text>Cole o link aqui</Text>
          <TextInput style={{height: 40, borderRadius: 2, marginTop: 10, marginBottom: 10, width: '100%', borderColor: 'black', borderWidth: 1, borderStyle: 'solid'}} value={this.state.link} onChangeText={this.handleInputChange('link')} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableWithoutFeedback onPress={this.handleStarClick(1)} >
              <Icon size={45} style={{marginRight: 5}}  color={'#F59D01'} name="ios-star" />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.handleStarClick(2)} >
              <Icon size={45} style={{marginRight: 5}}  color={'#F59D01'} name={this.state.rate >= 2 ? 'ios-star' : 'ios-star-outline' } />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.handleStarClick(3)} >
              <Icon size={45} style={{marginRight: 5}}  color={'#F59D01'} name={this.state.rate >= 3 ? 'ios-star' : 'ios-star-outline' } />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.handleStarClick(4)} >
              <Icon size={45} style={{marginRight: 5}}  color={'#F59D01'} name={this.state.rate >= 4 ? 'ios-star' : 'ios-star-outline' } />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.handleStarClick(5)} >
              <Icon size={45} color={'#F59D01'} name={this.state.rate >= 5 ? 'ios-star' : 'ios-star-outline' } />
            </TouchableWithoutFeedback>
          </View>
          <Button title="Enviar" onPress={this.handleCreateNewPin} />
        </View>
        <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()} ><View style={{flex:1, width: '100%'}} /></TouchableWithoutFeedback>
     </View>
    );
  }

  handleStarClick = (rate: number) => () => {
    this.handleInputChange('rate')(rate);
  }

  handleInputChange = (name: string) => (input: string | number) => {
    this.setState(state => ({
      ...state,
      [name]: input,
    }))
  }

  private handleCreateNewPin = () => {
    this.props.navigation.goBack();
    const { link, rate } = this.state;
    this.props.newPin(link, rate);
  }


}

/*****************************/
//   MAP DISPATCH TO PROPS   //
/****************************/

interface IMapDispatchToProps {
  newPin: (link: string, rate: number) => void
}

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({
  newPin: (link, rate) => dispatch(pinIdea.started({link, category: '-', rate}))
})

export default connect(null, mapDispatchToProps)(HomeScreen);