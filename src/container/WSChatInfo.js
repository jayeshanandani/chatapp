import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from 'native-base'

import ConfiguredStyle from '@constants/Variables'

import WSIcon from '@components/WSIcon'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  bigText: {
    fontSize: ConfiguredStyle.fonts.f18,
    color: ConfiguredStyle.colors.black,
    paddingVertical: ConfiguredStyle.padding.md,
  },
  smallText: {
    fontSize: ConfiguredStyle.fonts.sm,
    color: ConfiguredStyle.colors.grey.light,
  },
  icon: {
    fontSize: ConfiguredStyle.fonts.md,
    color: ConfiguredStyle.colors.primary,
  },
  iconContainer: {
    height: ConfiguredStyle.size.md,
    width: ConfiguredStyle.size.md
  },
  resizeStyle: {
    width: '100%',
    height: '100%'
  }
})

const WSChatInfo = () => (
  <View style={[common.exactCenter, common.flex1]}>
    <View style={[common.flexDirectionRow]}>
      <View style={common.p10}>
        <WSIcon
          iconContainer={pageStyle.iconContainer}
          fontFamily={ConfiguredStyle.fontFamily.FARegular}
          iconStyle={pageStyle.icon}
          resizeStyle={pageStyle.resizeStyle}
          iconCode="&#xf0f3;"
          rippleColor={ConfiguredStyle.colors.rippleColorDark}
          onBtnPress={() => { }}
        />
      </View>
      <View style={common.p10}>
        <WSIcon
          iconContainer={pageStyle.iconContainer}
          fontFamily={ConfiguredStyle.fontFamily.FARegular}
          iconStyle={pageStyle.icon}
          resizeStyle={pageStyle.resizeStyle}
          iconCode="&#xf055;"
          rippleColor={ConfiguredStyle.colors.rippleColorDark}
          onBtnPress={() => { }}
        />
      </View>
      <View style={common.p10}>
        <WSIcon
          iconContainer={pageStyle.iconContainer}
          fontFamily={ConfiguredStyle.fontFamily.FARegular}
          iconStyle={pageStyle.icon}
          resizeStyle={pageStyle.resizeStyle}
          iconCode="&#xf0a1;"
          rippleColor={ConfiguredStyle.colors.rippleColorDark}
          onBtnPress={() => { }}
        />
      </View>
      <View style={common.p10}>
        <WSIcon
          iconContainer={pageStyle.iconContainer}
          rippleColor={ConfiguredStyle.colors.rippleColorDark}
          resizeStyle={pageStyle.resizeStyle}
          renderIcon={() => (
            <Icon type="FontAwesome5" name="microphone-alt" style={pageStyle.icon} />
          )}
          onBtnPress={() => { }}
        />
      </View>
    </View>
    <View style={common.exactCenter}>
      <Text style={pageStyle.bigText}>This is your personal space</Text>
      <Text style={pageStyle.smallText}>Add to dos, reminders, messages &</Text>
      <Text style={pageStyle.smallText}>powerful voice notes</Text>
    </View>
  </View>
)

export default WSChatInfo