import { createStackNavigator } from 'react-navigation';
import { HomeScreen, NewPinModalScreen, EditRatingModalScreen } from '../screens';

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
    NewPinModal: NewPinModalScreen,
    EditRatingModal: EditRatingModalScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      backgroundColor: "transparent",
      opacity: 0.99
    },
  });

