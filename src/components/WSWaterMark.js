import React, { memo } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'
import images from '@constants/Image'

const pageStyle = StyleSheet.create({
  container: {
    flex: ConfiguredStyle.flex.one,
    position: enums.ABSOLUTE,
    top: ConfiguredStyle.size.none,
    right: ConfiguredStyle.size.none,
  },
})

const WSWaterMark = (props) => {
  const { image } = props
  return (
    <View style={pageStyle.container}>
      <Image source={image} />
    </View>
  )
}

WSWaterMark.propTypes = {
  image: PropTypes.number,
}

WSWaterMark.defaultProps = {
  image: images.waterMark,
}

export default memo(WSWaterMark)