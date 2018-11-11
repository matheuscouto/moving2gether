import React from 'react'
import RootStack from './src/routes/root';


import { Provider } from 'react-redux';
import store from './src/store';
// import FAB from 'react-native-fab';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
            {/* <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={() => {console.log("FAB pressed")}} visible={true} iconTextComponent={<Icon name="plus"/>} /> */}
          <RootStack/>
      </Provider> 
    );
  }
}