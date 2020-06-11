import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'

import ConfiguredStyle from '@constants/Variables'

import WSTouchable from '@components/WSTouchable'

class WSIcon extends PureComponent {
  render() {
    const {
      fontFamily,
      iconCode,
      onBtnPress,
      reference,
      iconStyle,
      iconContainer,
      rippleColor,
      resizeStyle,
      renderIcon,
    } = this.props

    return (
      <View style={[{ borderRadius: 25, overflow: 'hidden' }, iconContainer]}>
        <WSTouchable
          ref={reference}
          onPress={onBtnPress}
          rippleColor={rippleColor ? rippleColor : ConfiguredStyle.colors.rippleColor}
        >
          <View style={[{ paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }, resizeStyle]}>
            {renderIcon ? renderIcon() :
              <Text style={[{ fontFamily }, iconStyle]}>
                {iconCode}
              </Text>
            }
          </View>
        </WSTouchable>
      </View>
    )
  }
}

export default WSIcon