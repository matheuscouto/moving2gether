import { createStackNavigator } from 'react-navigation';
import { HomeScreen, NewPinModalScreen } from '../screens';

const MainStack = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
}, {
  cardStyle: {
    backgroundColor: "white"
  },
})

export default createStackNavigator({
    Main: MainStack,
    NewPinModal: NewPinModalScreen
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      backgroundColor: "transparent",
      opacity: 0.99
    },
  });

