import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Thumbnail, Icon } from 'native-base'
import { connect } from 'react-redux'

import Typography from '@constants/Typography'
import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'
import images from '@constants/Image'

import WSButton from '@components/WSButton'
import WSIcon from '@components/WSIcon'
import WSTouchable from '@components/WSTouchable'

import common from '@styles/common'
import styles from '@styles/AppStyle'

const pageStyle = StyleSheet.create({
  facebook: {
    marginRight: ConfiguredStyle.margin.xsm,
    color: ConfiguredStyle.colors.social.fb,
  },
  linkedIn: {
    color: ConfiguredStyle.colors.social.linkedIn,
  },
  whiteBorder: {
    borderWidth: 2, borderColor: ConfiguredStyle.colors.white,
  },
  multiThumbnail: {
    position: enums.ABSOLUTE,
    left: ConfiguredStyle.size.sm,
  },
  timePosition: {
    position: enums.ABSOLUTE,
    right: 0,
    top: ConfiguredStyle.size.s15,
  },
  iconColor: {
    fontSize: ConfiguredStyle.fonts.f18,
    color: ConfiguredStyle.colors.primary,
  },
  basicInfoContainer: {
    overflow: 'hidden',
    backgroundColor: ConfiguredStyle.colors.white,
    marginTop: ConfiguredStyle.margin.sm,
    paddingHorizontal: 10,
    borderRadius: ConfiguredStyle.size.s5,
    elevation: ConfiguredStyle.elevation.ssm3,
    shadowColor: ConfiguredStyle.colors.pureBlack,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    justifyContent: enums.END
  },
  youLabel: {
    fontSize: ConfiguredStyle.fonts.f18,
    fontWeight: enums.BOLD,
    color: ConfiguredStyle.colors.primary,
    marginLeft: ConfiguredStyle.margin.sm
  },
  name: {
    fontSize: ConfiguredStyle.fonts.f13,
    fontWeight: '700',
    color: ConfiguredStyle.colors.black,
    marginLeft: ConfiguredStyle.margin.xsm
  },
  tagStyle: {
    fontSize: ConfiguredStyle.fonts.f13,
    color: ConfiguredStyle.colors.grey.dark,
  },
  time: {
    position: enums.ABSOLUTE,
    top: ConfiguredStyle.size.s5,
    right: ConfiguredStyle.size.none,
    fontSize: ConfiguredStyle.fonts.xssm,
    color: ConfiguredStyle.colors.grey.medium,
  },
})

const InfoCard = (props) => {
  const {
    onPress,
    loggedInUserRoomDetails,
    userProfile,
    userData
  } = props
  return (
    <View style={common.ph20}>
      <WSTouchable
        rippleColor={ConfiguredStyle.colors.rippleColorDark}
        onPress={onPress}
        style={pageStyle.basicInfoContainer}
      >
        <View style={{ position: 'relative' }}>
          <View style={[common.flexDirectionRow, common.alignItemCenter, common.mv10]}>
            <Thumbnail large source={(userProfile) ? { uri: userProfile } : images.avatar} />
            <View>
              <View style={[common.flexDirectionRow, { alignItems: 'center', }]}>
                <Text style={pageStyle.youLabel}>
                  You
              </Text>
                <Text style={pageStyle.name}>
                  {`(${userData && userData.userName})`}
                </Text>
              </View>
              <View style={[common.flexDirectionRow, { alignItems: 'center', justifyContent: 'center' }]}>
                <View style={common.selfCenter}>
                  <WSIcon
                    fontFamily={ConfiguredStyle.fontFamily.FABold}
                    iconStyle={pageStyle.iconColor}
                    iconCode="&#xf0f3;"
                  />
                </View>
                <Text style={pageStyle.tagStyle}>3 Reminders</Text>
                <Text style={[common.mr10, common.ml10, { color: ConfiguredStyle.colors.grey.lightest }]}>|</Text>
                <View style={[common.selfCenter]}>
                  <WSIcon
                    fontFamily={ConfiguredStyle.fontFamily.FABold}
                    iconStyle={pageStyle.iconColor}
                    iconCode="&#xf500;"
                  />
                </View>
                <Text style={pageStyle.tagStyle}>4 New</Text>
              </View>
            </View>
          </View>
          <Text style={pageStyle.time}>18:41</Text>
        </View>
      </WSTouchable>
    </View>
  )
}

const mapStateToProps = state => ({
  userData: state.user.userData,
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard)