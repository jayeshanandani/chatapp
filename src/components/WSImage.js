import React, { memo, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import FastImage from 'react-native-fast-image'
import { ActivityIndicator } from 'react-native-paper'

import ConfiguredStyle from '@constants/Variables'

import common from '@styles/common'

const WSImage = (props) => {
  const {
    image,
    width,
    height,
    imageStyle,
    enableLoad,
    resizeMode,
    onPress
  } = props

  const [isLoading, setLoader] = useState('false');
  return (
    <TouchableOpacity onPress={onPress}>
      {(isLoading && enableLoad) ? (<View style={[common.exactCenter, imageStyle, {
        width,
        height,
        backgroundColor: ConfiguredStyle.colors.primaryTransparent,
        opacity: 0.3
      }]}>
        <ActivityIndicator animating={true} color={ConfiguredStyle.colors.primary} size={ConfiguredStyle.size.sm} />
      </View>) : (<FastImage
        source={image}
        onLoadStart={() => {
          setLoader(true);
        }}
        onLoadEnd={() => {
          setLoader(false);
        }}
        style={[{ width, height, backgroundColor: ConfiguredStyle.colors.grey.lightest }, imageStyle]}
        resizeMode={resizeMode}
      />)}
    </TouchableOpacity>
  )
}

WSImage.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  image: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
  mode: PropTypes.string,
}

WSImage.defaultProps = {
  mode: '',
}

export default memo(WSImage)