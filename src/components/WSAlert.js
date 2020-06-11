import React, { memo } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  Text,
} from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

const PageStyle = StyleSheet.create({
  opacityBackground: {
    flex: ConfiguredStyle.flex.one,
    alignItems: enums.CENTER,
    justifyContent: enums.CENTER,
    backgroundColor: ConfiguredStyle.colors.opacity.black_op_40,
  },
  whiteBox: {
    width: ConfiguredStyle.dimensions.fullWidth - 100,
    backgroundColor: ConfiguredStyle.colors.white,
    padding: ConfiguredStyle.padding.md,
    borderRadius: ConfiguredStyle.size.s5,
  },
  title: {
    textAlign: enums.CENTER,
    color: ConfiguredStyle.colors.black,
    fontSize: ConfiguredStyle.fonts.f18,
    fontWeight: enums.BOLD,
  },
})

const WSAlert = props => (
  <Modal
    animationType="fade"
    transparent
    visible={props.visibility}
    onRequestClose={props.closeAction}
  >
    <View style={PageStyle.opacityBackground}>
      <View style={PageStyle.whiteBox}>
        <Text style={PageStyle.title}>{props.title}</Text>
        {props.children}
      </View>
    </View>
  </Modal>
)

export default memo(WSAlert)