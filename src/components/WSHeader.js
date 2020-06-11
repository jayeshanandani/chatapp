import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Thumbnail } from 'native-base'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native-gesture-handler'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'
import images from '@constants/Image'

import WSTouchable from '@components/WSTouchable'
import WSImage from '@components/WSImage'

import common from '@styles/common'

const pageStyles = StyleSheet.create({
  headerArea: {
    marginLeft: ConfiguredStyle.size.s5,
    flexDirection: enums.ROW,
    width: ConfiguredStyle.dimensions.fullWidth - 100,
    height: ConfiguredStyle.size.s55,
    alignItems: enums.CENTER,
  },
  headerText: {
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.primaryBold,
    fontWeight: '700',
    color: ConfiguredStyle.colors.primary,
    alignSelf: enums.CENTER,
  },
  rightTextStyle: {
    fontSize: ConfiguredStyle.fonts.xsm,
    fontFamily: ConfiguredStyle.fontFamily.primaryMedium,
    color: ConfiguredStyle.colors.skyBlue,
    alignSelf: enums.CENTER,
    marginRight: 10,
  },
})

const WSHeader = (props) => {
  const {
    name,
    leftIcon,
    middleIcon,
    rightIcon,
    leftColor,
    middleColor,
    rightColor,
    rightText,
    rightTextPress,
    style,
    onLeftMethod,
    onClickSearch,
    onRightMethod,
    onMiddleMethod,
    renderRightIcon,
    reference,
    imageSrc,
    rightImage,
    isThumbnail,
    userName,
    onClickName,
    enableBack,
    removeShadow,
    leftIconStyle,
  } = props

  const pageStyle = StyleSheet.create({
    container: {
      flexDirection: enums.ROW,
      alignItems: enums.CENTER,
      paddingHorizontal: ConfiguredStyle.padding.sm,
      height: 60,
      backgroundColor: ConfiguredStyle.colors.white,
    },
    shadow: {
      elevation: 3,
      shadowColor: ConfiguredStyle.colors.pureBlack,
      shadowOpacity: 0.1,
      shadowOffset: {
        width: 0,
        height: 3,
      }
    },
    left: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row'
    },
    right: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'row'
    },
    text: {
      fontSize: ConfiguredStyle.fonts.sm,
      fontFamily: ConfiguredStyle.fontFamily.primaryBold,
      color: ConfiguredStyle.colors.black,
      flexGrow: ConfiguredStyle.flex.one,
      textAlign: enums.CENTER,
      alignSelf: enums.CENTER,
      fontWeight: '600'
    }
  })

  return (
    <View style={[pageStyle.container, style, !removeShadow && pageStyle.shadow]}>
      <View style={pageStyle.left}>
        <View style={common.selfCenter}>
          {enableBack ? (
            <WSImage
              image={images.back}
              height={ConfiguredStyle.size.s17}
              width={ConfiguredStyle.size.s17}
              resizeMode={'contain'}
              imageStyle={[{ backgroundColor: ConfiguredStyle.colors.white, marginLeft: 10 }, leftIconStyle]}
              onPress={onLeftMethod}
            />
          ) : (
              <WSImage
                image={leftIcon}
                height={ConfiguredStyle.size.s30}
                width={ConfiguredStyle.size.s30}
                resizeMode={'contain'}
                imageStyle={[{ backgroundColor: ConfiguredStyle.colors.white, marginLeft: 10 }, leftIconStyle]}
                onPress={onLeftMethod}
              />
            )
          }
        </View>
        {(isThumbnail)
          && (
            <View style={pageStyles.headerArea}>
              <WSTouchable
                onPress={onLeftMethod}
                rippleColor={ConfiguredStyle.colors.rippleColor}
              >
                <Thumbnail small source={imageSrc} />
              </WSTouchable>
              <WSTouchable
                onPress={onClickName}
                rippleColor={ConfiguredStyle.colors.rippleColor}
              >
                <View style={pageStyles.headerArea}>
                  <Text style={pageStyles.headerText}>{userName}</Text>
                </View>
              </WSTouchable>
            </View>
          )
        }
      </View>
      {name !== '' && <Text style={pageStyle.text}>{name}</Text>}
      {(middleIcon || renderRightIcon || rightIcon || rightImage || rightText) &&
        <View style={pageStyle.right}>
          {middleIcon !== '' && (
            <WSImage
              image={middleIcon}
              height={ConfiguredStyle.size.s20}
              width={ConfiguredStyle.size.s20}
              resizeMode={'contain'}
              imageStyle={{ backgroundColor: ConfiguredStyle.colors.white }}
              onPress={onMiddleMethod}
            />
          )}
          {renderRightIcon && renderRightIcon()}
          {rightIcon !== '' &&
            <WSImage
              image={rightIcon}
              height={ConfiguredStyle.size.s30}
              width={ConfiguredStyle.size.s30}
              resizeMode={'contain'}
              imageStyle={[{ backgroundColor: ConfiguredStyle.colors.white }, rightIconStyle]}
              onPress={onRightMethod}
            />
          }
          {(rightImage) && <Thumbnail style={common.mt5} small source={imageSrc} />}
          {(rightText) && <TouchableOpacity onPress={rightTextPress}>
            <Text style={pageStyles.rightTextStyle}>{rightText}</Text>
          </TouchableOpacity>}
        </View>
      }
    </View>
  )
}

WSHeader.propTypes = {
  name: PropTypes.string,
  // leftIcon: PropTypes.string,
  // middleIcon: PropTypes.string,
  // rightIcon: PropTypes.string,
  leftColor: PropTypes.string,
  middleColor: PropTypes.string,
  rightColor: PropTypes.string,
  style: PropTypes.object,
  onLeftMethod: PropTypes.func,
  onClickSearch: PropTypes.func,
  onRightMethod: PropTypes.func,
  reference: PropTypes.func,
  imageSrc: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
  rightImage: PropTypes.object,
  isThumbnail: PropTypes.bool,
  removeShadow: PropTypes.bool,
  userName: PropTypes.string,
  onClickName: PropTypes.func,
  renderRightIcon: PropTypes.func,
  isButton: PropTypes.bool,
  enableBack: PropTypes.bool,
}

WSHeader.defaultProps = {
  name: '',
  leftIcon: '',
  middleIcon: '',
  rightIcon: '',
  leftColor: ConfiguredStyle.colors.blue.dark,
  middleColor: ConfiguredStyle.colors.blue.dark,
  rightColor: ConfiguredStyle.colors.blue.dark,
  style: {},
  renderRightIcon: () => { },
  imageSrc: images.avatar,
  isThumbnail: false,
  removeShadow: false,
  userName: '',
  isButton: false,
  enableBack: false,
}

export default memo(WSHeader)