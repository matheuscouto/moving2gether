import { createStackNavigator } from 'react-navigation';
import { HomeScreen } from '../screens';

export default createStackNavigator({
    Home: {
      screen: HomeScreen
    },
  });