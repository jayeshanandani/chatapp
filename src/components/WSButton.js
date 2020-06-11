import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Button, withTheme } from 'react-native-paper'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'


const pageStyle = StyleSheet.create({
  button: {
    // borderRadius: ConfiguredStyle.size.md,
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: ConfiguredStyle.padding.sm,
  },
  iconStyle: {
    position: 'absolute',
    right: 0,
    zIndex: 1111
  },
  nameStyle: {
    color: ConfiguredStyle.colors.white,
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.primaryMedium,
    letterSpacing: 0
  },
  textContainer: {
    flexGrow: ConfiguredStyle.flex.one,
    justifyContent: enums.CENTER,
    alignItems: enums.CENTER,
  },
  icon: {
    fontSize: ConfiguredStyle.fonts.f18,
    color: ConfiguredStyle.colors.white,
  },
})

const WSButton = (props) => {
  const {
    name,
    width,
    height,
    onBtnPress,
    arrowStyle,
    mode,
    icon,
    dark,
    compact,
    color,
    loading,
    disabled,
    uppercase,
    style,
    contentStyle,
    labelStyle,
    renderIcon
  } = props

  return (
    <Button
      icon={icon}
      mode={mode}
      onPress={onBtnPress}
      dark={dark}
      compact={compact}
      style={[pageStyle.button, style, { width, height }]}
      color={color}
      loading={loading}
      disabled={disabled}
      uppercase={uppercase}
      labelStyle={[pageStyle.nameStyle, labelStyle]}
      contentStyle={[pageStyle.buttonContainer, contentStyle]}
    >
      {renderIcon ? renderIcon() : name}
    </Button>
  )
}


WSButton.propTypes = {
  name: PropTypes.string,
  onBtnPress: PropTypes.func,
  height: PropTypes.number,
  mode: PropTypes.string,
  icon: PropTypes.string,
  dark: PropTypes.bool,
  compact: PropTypes.bool,
  color: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  uppercase: PropTypes.bool,
  style: PropTypes.object,
  contentStyle: PropTypes.object,
}

WSButton.defaultProps = {
  name: '',
  onBtnPress: () => { },
  height: ConfiguredStyle.size.s45,
  mode: 'contained',
  icon: '',
  dark: true,
  compact: false,
  color: ConfiguredStyle.colors.primary,
  loading: false,
  disabled: false,
  uppercase: false,
  style: {},
  contentStyle: {}
}

export default withTheme(memo(WSButton))