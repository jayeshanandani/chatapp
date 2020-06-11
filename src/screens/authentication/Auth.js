import React, { Component } from 'react'
import { View, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
// import { Navigation } from 'react-native-navigation'
import SplashScreen from 'react-native-splash-screen'

import ConfiguredStyle from '@constants/Variables'
import images from '@constants/Image'

import common from '@styles/common'

class AuthComponent extends Component {
  constructor(props) {
    super(props);
    // Navigation.events().bindComponent(this);
    this.redirect();
  }

  componentDidMount() {
    SplashScreen.hide()
  }

  redirect = async () => {
    const { navigation } = this.props
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigation.navigate('TabNavigator')
    } else {
      await AsyncStorage.setItem('fromSignOut', 'false');
      const initialState = 'SwiperScreen';
      // Navigation.setRoot({
      //   root: {
      //     stack: {
      //       children: [{
      //         component: {
      //           name: initialState,
      //           options: {
      //             statusBar: {
      //               backgroundColor: ConfiguredStyle.colors.primary,
      //               visible: true
      //             },
      //             topBar: {
      //               visible: false,
      //               ...Platform.select({ android: { drawBehind: true } }),
      //             },
      //           },
      //         },
      //       }],
      //     },
      //   },
      // });
      navigation.navigate(initialState)
    }
  }

  render() {
    return (
      <View style={[common.flex1, common.exactCenter, { backgroundColor: ConfiguredStyle.colors.primary }]}>
        <Image source={images.logo_splash} style={{ height: '50%', width: '50%' }} resizeMode={'contain'} />
      </View>
    )
  }
}

export default AuthComponent