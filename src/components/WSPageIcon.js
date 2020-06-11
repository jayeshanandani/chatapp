import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Icon } from 'native-base'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSIcon from '@components/WSIcon'

const WSPageIcon = (props) => {
  const { icon, size, fromPage } = props

  const pageStyle = StyleSheet.create({
    container: {
      height: ConfiguredStyle.size.s70,
      width: ConfiguredStyle.size.s70,
      borderRadius: ConfiguredStyle.size.md,
      justifyContent: enums.CENTER,
      alignItems: enums.CENTER,
      backgroundColor: ConfiguredStyle.colors.tertiary,
    },
    iconContainer: {
      borderRadius: ConfiguredStyle.size.s25,
      height: ConfiguredStyle.size.s52,
      width: ConfiguredStyle.size.s52,
      justifyContent: enums.CENTER,
      alignItems: enums.CENTER,
      backgroundColor: ConfiguredStyle.colors.secondary,
    },
    iconColor: {
      color: ConfiguredStyle.colors.primary,
      fontSize: size,
    },
  })

  return (
    <View style={pageStyle.container}>
      <View style={pageStyle.iconContainer}>
        {(fromPage === 'verification')
          ? <Icon type="FontAwesome5" name="star-of-life" style={{ fontSize: ConfiguredStyle.fonts.lg, color: ConfiguredStyle.colors.primary }} />
          : (
            <WSIcon
              fontFamily={ConfiguredStyle.fontFamily.FABold}
              iconStyle={pageStyle.iconColor}
              iconCode={icon}
            />
          )}
      </View>
    </View>
  )
}

WSPageIcon.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.number,
}

WSPageIcon.defaultProps = {
  icon: '',
  size: ConfiguredStyle.size.s22,
}

export default memo(WSPageIcon)