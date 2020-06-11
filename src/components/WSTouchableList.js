import React, { memo } from 'react'
import { Platform, TouchableNativeFeedback } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

const Touchable = Platform.OS === 'ios' ? TouchableRipple : TouchableNativeFeedback

const WSTouchableList = ({
  style, children, slopArea, ...rest
}) => {
  let styleProps = {}
  if (Array.isArray(style)) {
    style.forEach((obj) => {
      styleProps = { ...styleProps, ...obj }
    })
  } else {
    styleProps = { ...style }
  }
  return (
    <Touchable {...rest} style={{ ...styleProps }} hitSlop={slopArea}>
      {children}
    </Touchable>
  )
}

export default memo(WSTouchableList);