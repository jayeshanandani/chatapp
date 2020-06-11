import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'

import common from '@styles/common'

const PageStyle = StyleSheet.create({
  descriptionStyle: {
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.primaryMedium,
    color: ConfiguredStyle.colors.grey.medium,
    lineHeight: ConfiguredStyle.size.sm,
  },
})

const WSGreyText = (props) => {
  const { description, style } = props
  return (
    <View style={common.pt15}>
      <Text style={[PageStyle.descriptionStyle, style]}>
        {description}
      </Text>
    </View>
  )
}

WSGreyText.propTypes = {
  description: PropTypes.string.isRequired,
  style: PropTypes.object,
}

WSGreyText.defaultProps = {
  style: {},
}

export default memo(WSGreyText)