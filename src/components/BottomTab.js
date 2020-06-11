import * as React from 'react'
import { StyleSheet } from 'react-native'
import { BottomNavigation } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'

import ConfiguredStyle from '@constants/Variables'

import ContactList from '@screens/user/ContactList'
import Home from '@screens/home/Home'
import Settings from '@screens/settings/Settings'

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: ConfiguredStyle.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1'
  },
  tab: {
    textAlign: 'center',
    height: ConfiguredStyle.size.s35,
    width: ConfiguredStyle.size.s35
  },
});

export default class BottomTab extends React.PureComponent {

  state = {
    index: 1,
    routes: [
      { key: 'contactList' },
      { key: 'home' },
      { key: 'settings' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    contactList: ContactList,
    home: Home,
    settings: Settings,
  });

  render() {
    return (
      <BottomNavigation
        barStyle={styles.barStyle}
        activeColor={ConfiguredStyle.colors.primary}
        inactiveColor={'#dbdaf1'}
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={({ route, jumpTo }) => {
          switch (route.key) {
            case 'contactList':
              return <ContactList jumpTo={jumpTo} {...this.props} />;
            case 'home':
              return <Home jumpTo={jumpTo} {...this.props} />;
            case 'settings':
              return <Settings jumpTo={jumpTo} {...this.props} />;
          }
        }}
        renderIcon={({ route, focused, color }) => {
          switch (route.key) {
            case 'contactList':
              return <Ionicons name={'md-person'} size={ConfiguredStyle.size.s30} color={color} style={styles.tab} />;
            case 'home':
              return <Ionicons name={'ios-chatbubbles'} size={ConfiguredStyle.size.s30} color={color} style={styles.tab} />;
            case 'settings':
              return <Ionicons name={'md-settings'} size={ConfiguredStyle.size.s30} color={color} style={styles.tab} />;
          }
        }}
      />
    );
  }
}