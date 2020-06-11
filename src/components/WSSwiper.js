import React, { memo } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import ConfiguredStyle from '@constants/Variables'
import Typography from '@constants/Typography'
import enums from '@constants/Enum'

import WSButton from '@components/WSButton'
import WSTouchable from '@components/WSTouchable'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  bottomView: {
    flex: ConfiguredStyle.flex.one,
    justifyContent: enums.END,
  },
  background: {
    backgroundColor: ConfiguredStyle.colors.white,
  },
  loginBtn: {
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: ConfiguredStyle.size.sm,
    width: ConfiguredStyle.size.s150,
  },
  topSec: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: ConfiguredStyle.margin.sm,
  },
  skipBtn: {
    overflow: 'hidden',
    borderRadius: ConfiguredStyle.size.sm,
  },
  skipText: {
    padding: ConfiguredStyle.padding.sm,
    color: ConfiguredStyle.colors.grey.medium,
  },
  icon: {
    fontSize: ConfiguredStyle.fonts.f18,
    color: ConfiguredStyle.colors.black,
  },
  resizeStyle: {
    height: ConfiguredStyle.size.s40,
    width: ConfiguredStyle.size.s40,
    borderRadius: ConfiguredStyle.size.s40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const WSSwiper = (props) => {
  const {
    title,
    description,
    width,
    buttonName,
    bottomText,
    image,
    onGetMethod,
    enableBack,
    header,
    onSkipButton,
    onBackButton,
    onLogin,
  } = props

  return (
    <View style={[common.flex1, common.exactCenter, pageStyle.background]}>
      <View style={[common.flexDirectionRow, common.ph20, pageStyle.topSec]}>
        <View style={pageStyle.resizeStyle}>
          {enableBack && <WSTouchable
            onPress={onBackButton}
            rippleColor={ConfiguredStyle.colors.rippleColorDark}
            style={pageStyle.resizeStyle}
          >
            <FontAwesome5 name="arrow-left" size={ConfiguredStyle.fonts.f18} color={ConfiguredStyle.colors.black} />
          </WSTouchable>}
        </View>
        <View style={pageStyle.skipBtn}>
          <WSTouchable
            onPress={onSkipButton}
            rippleColor={ConfiguredStyle.colors.rippleColorDark}
          >
            <Text style={[Typography.h3, pageStyle.skipText]}>{header}</Text>
          </WSTouchable>
        </View>
      </View>
      <Image source={image} style={[common.mb10, common.flex1]} resizeMode={'contain'} />
      <View style={[common.ph40, common.flex1]}>
        <Text style={[Typography.h1, common.pb30, common.mt10]}>{title}</Text>
        <Text style={[Typography.h3, common.pb30, common.lineHeight25]}>{description}</Text>
        <View style={pageStyle.bottomView}>
          <WSButton
            onBtnPress={onGetMethod}
            name={buttonName}
            width={width}
            contentStyle={!buttonName ? { paddingLeft: ConfiguredStyle.padding.p25 } : {}}
            style={!buttonName ? { borderRadius: ConfiguredStyle.size.md } : {}}
            icon={!buttonName ? 'arrow-right' : ''}
          />
        </View>
      </View>
      <View style={[common.mb10]}>
        <WSButton
          onBtnPress={onLogin}
          disabled={bottomText == '' ? true : false}
          name={bottomText}
          width={width}
          mode={'text'}
          labelStyle={{ color: ConfiguredStyle.colors.black }}
        />
      </View>
      {/* <View style={[pageStyle.loginBtn, common.mv10]}>
        <WSTouchable
          onPress={onLogin}
          rippleColor={ConfiguredStyle.colors.rippleColorDark}
          disabled={bottomText == '' ? true : false}
        >
          <Text style={[common.textCenter, common.mv10, common.f15, { color: ConfiguredStyle.colors.black }]}>{bottomText}</Text>
        </WSTouchable>
      </View> */}
    </View>
  )
}

WSSwiper.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonName: PropTypes.string,
  bottomText: PropTypes.string,
  enableBack: PropTypes.bool,
  header: PropTypes.string,
  image: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
  onGetMethod: PropTypes.func,
  onSkipButton: PropTypes.func,
  onBackButton: PropTypes.func,
  onLogin: PropTypes.func,
}

WSSwiper.defaultProps = {
  title: '',
  description: '',
  buttonName: '',
  bottomText: '',
  enableBack: false,
  header: '',
}

export default withNavigation(memo(WSSwiper))