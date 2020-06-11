import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  BackHandler
} from 'react-native'

import images from '@constants/Image'
import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSBoldText from '@components/WSBoldText'
import WSGreyText from '@components/WSGreyText'
import WSHeader from '@components/WSHeader'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  image: {
    flex: ConfiguredStyle.flex.one,
    backgroundColor: ConfiguredStyle.colors.white,
    justifyContent: enums.CENTER,
    alignItems: enums.CENTER,
    paddingHorizontal: ConfiguredStyle.padding.md,
  },
})

class SuccessContactUs extends Component {

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

  render() {
    return (
      <View style={[common.flex1, common.bgWhite]}>
        <WSHeader
          name="Contact Us"
          enableBack
          onLeftMethod={this.handleBack}
        />
        <View style={pageStyle.image}>
          <View style={common.pb30}>
            <Image source={images.contact} />
          </View>
          <WSBoldText description="Submitted" />
          <WSGreyText
            description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod"
            style={common.textCenter}
          />
        </View>
      </View>
    )
  }
}

export default SuccessContactUs