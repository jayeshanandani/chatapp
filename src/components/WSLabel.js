import React, { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  textBox: {
    borderBottomColor: ConfiguredStyle.colors.grey.light,
    borderBottomWidth: ConfiguredStyle.radius.border,
    height: ConfiguredStyle.size.s30,
    padding: ConfiguredStyle.size.none,
  },
  textBoxView: {
    marginTop: ConfiguredStyle.margin.md,
  },
})

const WSLabel = (props) => {
  const { name, placeholder } = props
  return (
    <View style={common.mt10}>
      <Text style={[common.f10, common.colorPrimary]}>{placeholder}</Text>
      <View
        style={pageStyle.textBox}
      >
        <Text style={[common.mt5, common.colorBlack]}>{name}</Text>
      </View>
    </View>
  )
}

WSLabel.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
}

export default memo(WSLabel)