import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import { StackActions, NavigationActions } from 'react-navigation'

import { getRoomsClear } from '@redux/chat/actions'
import { getUserInfoClear, getAllUserClear, logout } from '@redux/user/actions'

import WSHeader from '@components/WSHeader'
import WSList from '@components/WSList'

import common from '@styles/common'

const data = [
  { familyName: 'AntDesign', iconName: 'phone', name: 'Contact Us', page: 'ContactUs' },
  { familyName: 'MaterialCommunityIcons', iconName: 'shield-outline', name: 'Privacy Policy', page: 'BlankPage' },
  { familyName: 'AntDesign', iconName: 'filetext1', name: 'Terms of Service', page: 'BlankPage' },
  { familyName: 'MaterialCommunityIcons', iconName: 'logout', name: 'Signout', page: 'Login' }]

class Help extends Component {

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  handleBack = () => {
    const { navigation } = this.props
    return navigation.goBack();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  nextPage = async (e) => {
    const { navigation } = this.props
    if (e.page === 'Login') {
      const { getRoomsClear, getAllUserClear, logout } = this.props
      // getRoomsClear()
      // getAllUserClear()
      logout()
      // getUserInfoClear()
      await AsyncStorage.clear();
      await AsyncStorage.removeItem('token')
      await AsyncStorage.setItem('fromSignOut', 'true');
      // closeAllPage();
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'LoginStack' })],
      });
      navigation.dispatch(resetAction);
    }
    else {
      navigation.navigate(e.page)
      // navigateTo(e.page)
    }
  }

  render() {
    return (
      <View style={[common.flex1, common.bgWhite]}>
        <WSHeader
          name='Help'
          enableBack
          onLeftMethod={this.handleBack}
        />
        <WSList usersList={data} onBtnPress={this.nextPage} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRoomsClear: () => dispatch(getRoomsClear()),
    getUserInfoClear: () => dispatch(getUserInfoClear()),
    getAllUserClear: () => dispatch(getAllUserClear()),
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Help)