import React from 'react';
import { View, Text, TouchableWithoutFeedback, TextInput, Button, Animated, ViewStyle } from 'react-native';
import { Dispatch } from 'redux';
import { pinIdea } from '../../store/app/pin';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import StarRating from 'react-native-star-rating';

interface IState {
  link: string,
  rate: 1 | 2 | 3 | 4 | 5,
}

class HomeScreen extends React.Component<IMapDispatchToProps & NavigationScreenProps, IState> {
  state: IState = {
    link: '',
    rate: 2,
  }

  render() {
    return (
      <FadeInView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', padding: 20 }} navigation={this.props.navigation}>
        <View style={{ padding: 18, width: '100%',  backgroundColor: 'white', shadowColor: 'black', shadowRadius: 5, shadowOffset: { width: 5, height: 5 }, justifyContent:"center", borderRadius: 4, alignItems: 'center'}}>
          <Text>Cole o link aqui</Text>
          <TextInput style={{height: 40, borderRadius: 2, marginTop: 10, marginBottom: 10, width: '100%', borderColor: 'black', borderWidth: 1, borderStyle: 'solid'}} value={this.state.link} onChangeText={this.handleInputChange('link')} />
          <StarRating
            disabled={false}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            halfStar={'ios-star-half'}
            iconSet={'Ionicons'}
            maxStars={5}
            rating={this.state.rate}
            selectedStar={(rating) => this.handleInputChange('rate')(rating)}
            fullStarColor={'#F59D01'}
            emptyStarColor="#F59D01"
          />
          <Button title="Enviar" onPress={this.handleCreateNewPin} />
        </View>
     </FadeInView>
    );
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

class FadeInView extends React.Component<{style: ViewStyle} & NavigationScreenProps> {
  state = {
    backgroundColor: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.sequence([
        Animated.timing(this.state.backgroundColor, {
            delay: 300,
            duration: 400,
            toValue: 1
        }),
    ]).start();
  }

  render() {
    const backgroundColor = this.state.backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(55, 55, 55, 0)','rgba(55, 55, 55, 0.5)']
    });
    return (
      <Animated.View
        style={{
          ...this.props.style,
          backgroundColor,
        }}
      >

      <TouchableWithoutFeedback onPress={this.willLeaveScreen} ><View style={{flex:1, width: '100%'}} /></TouchableWithoutFeedback>
      {this.props.children}

      <TouchableWithoutFeedback onPress={this.willLeaveScreen} ><View style={{flex:1, width: '100%'}} /></TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  willLeaveScreen = () => {
    Animated.sequence([
        Animated.timing(this.state.backgroundColor, {
            delay: 0,
            duration: 1,
            toValue: 0
        }),
    ]).start();
    this.props.navigation.goBack()
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