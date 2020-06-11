import React, { memo } from 'react'
import { TouchableRipple } from 'react-native-paper'

const WSTouchable = ({
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
    <TouchableRipple {...rest} style={{ ...styleProps }}>
      {children}
    </TouchableRipple>
  )
}

export default memo(WSTouchable)