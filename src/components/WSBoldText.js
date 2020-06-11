import React, { memo } from 'react'
import { Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'

const PageStyle = StyleSheet.create({
  text: {
    fontSize: ConfiguredStyle.fonts.f18,
    fontFamily: ConfiguredStyle.fontFamily.FAMedium,
    color: ConfiguredStyle.colors.black,
    lineHeight: ConfiguredStyle.size.s25,
  },
})

const WSBoldText = props => (
  <Text style={PageStyle.text}>{props.description}</Text>
)

WSBoldText.propTypes = {
  description: PropTypes.string.isRequired,
}

export default memo(WSBoldText)