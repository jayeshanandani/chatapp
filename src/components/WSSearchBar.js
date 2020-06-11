import React, { PureComponent } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard
} from 'react-native'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSIcon from '@components/WSIcon'

const pageStyle = StyleSheet.create({
  backgroundView: {
    flexDirection: enums.ROW,
    alignItems: enums.CENTER,
    marginVertical: ConfiguredStyle.margin.m15,
    paddingHorizontal: ConfiguredStyle.padding.xsm,
    borderWidth: ConfiguredStyle.radius.border,
    borderColor: ConfiguredStyle.colors.grey.light,
    borderRadius: ConfiguredStyle.size.md,
    ...Platform.select({
      ios: { paddingVertical: ConfiguredStyle.padding.sm },
    }),
  },
  iconColorSize: {
    color: ConfiguredStyle.colors.grey.light,
    fontSize: ConfiguredStyle.fonts.sm,
  },
})

class WSSearchBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    const { onFocusChange } = this.props
    onFocusChange(true);
  }

  _keyboardDidHide = () => {
    const { onFocusChange } = this.props
    onFocusChange(false);
  }

  render() {
    const { placeholderText, nameText, changeText, renderRightComponent } = this.props
    return (
      <View style={pageStyle.backgroundView}>
        <WSIcon
          fontFamily={ConfiguredStyle.fontFamily.FARegular}
          iconStyle={pageStyle.iconColorSize}
          iconCode="&#xf002;"
        />
        <View style={{ flex: 1 }}>
          <TextInput
            name={nameText}
            onChangeText={changeText}
            placeholder={placeholderText}
            placeholderTextColor={ConfiguredStyle.colors.grey.light}
            style={pageStyle.textBox}
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>
        {renderRightComponent && renderRightComponent()}
      </View>
    )
  }
}

WSSearchBar.propTypes = {
  placeholderText: PropTypes.string,
  nameText: PropTypes.string,
  changeText: PropTypes.func,
}

WSSearchBar.defaultProps = {
  placeholderText: '',
  nameText: '',
}

export default WSSearchBar