import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'

import common from '@styles/common'

const WSListLoader = (props) => {
  const pageStyle = StyleSheet.create({
    round: {
      height: props.height,
      width: props.width,
      borderRadius: props.radius,
      backgroundColor: ConfiguredStyle.colors.grey.lightest,
    },
    upperLine: {
      borderWidth: ConfiguredStyle.size.s5,
      borderColor: ConfiguredStyle.colors.grey.lightest,
      borderRadius: props.radius,
      width: ConfiguredStyle.dimensions.fullWidth / 2,
      marginBottom: ConfiguredStyle.size.s5,
    },
    bottomLine: {
      borderWidth: ConfiguredStyle.size.s5,
      borderColor: ConfiguredStyle.colors.grey.lightest,
      borderRadius: props.radius,
      width: ConfiguredStyle.dimensions.fullWidth / 3,
    },
  })

  return (
    <View style={[common.flexDirectionRow, common.alignItemCenter, common.mv10]}>
      <View style={pageStyle.round} />
      <View style={common.mh5}>
        <View style={pageStyle.upperLine} />
        <View style={pageStyle.bottomLine} />
      </View>
    </View>
  )
}

WSListLoader.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  radius: PropTypes.number,
}

WSListLoader.defaultProps = {
  height: ConfiguredStyle.size.s45,
  width: ConfiguredStyle.size.s45,
  radius: ConfiguredStyle.size.md,
}

export default memo(WSListLoader)