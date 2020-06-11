import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { TextInput, withTheme } from 'react-native-paper'

import ConfiguredStyle from '@constants/Variables'

const pageStyle = StyleSheet.create({
  textBox: {
    padding: ConfiguredStyle.size.none,
    fontSize: ConfiguredStyle.fonts.sm,
    backgroundColor: ConfiguredStyle.colors.white,
  },
  textBoxView: {
    marginTop: ConfiguredStyle.margin.sm,
  },
})

const WSTextBox = (props) => {
  const {
    changeText,
    placeholderText,
    placeholder,
    keyboardType,
    reference,
    returnKeyType,
    maxLength,
    onSubmitEditing,
    blurOnSubmit,
    style,
    nameText,
    secureTextEntry,
    multiLine,
    textStyle,
    viewStyle,
    value,
    disabled,
    render,
    mode,
    editableText,
    error,
    onFocus,
    onBlur,
    dense,
    ...rest
  } = props
  return (
    <View style={[pageStyle.textBoxView, viewStyle]}>
      <TextInput
        editable={editableText}
        fontStyle={textStyle}
        placeholder={placeholder}
        placeholderTextColor={ConfiguredStyle.colors.grey.medium}
        value={value}
        name={nameText}
        label={placeholderText}
        mode={mode}
        disabled={disabled}
        multiline={multiLine}
        style={[pageStyle.textBox, style]}
        onChangeText={changeText}
        keyboardType={keyboardType}
        ref={reference}
        returnKeyType={returnKeyType}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        secureTextEntry={secureTextEntry}
        render={render}
        error={error}
        onFocus={onFocus}
        onBlur={onBlur}
        dense={dense}
        {...rest}
      />
    </View>
  )
}

WSTextBox.propTypes = {
  changeText: PropTypes.func,
  placeholderText: PropTypes.string,
  placeholder: PropTypes.string,
  mode: PropTypes.string,
  keyboardType: PropTypes.string,
  reference: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  returnKeyType: PropTypes.string,
  maxLength: PropTypes.number,
  onSubmitEditing: PropTypes.func,
  blurOnSubmit: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  nameText: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  multiLine: PropTypes.bool,
  error: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  dense: PropTypes.bool,
}

WSTextBox.defaultProps = {
  placeholderText: '',
  keyboardType: 'default',
  returnKeyType: 'done',
  mode: 'outlined',
  maxLength: ConfiguredStyle.size.md,
  blurOnSubmit: true,
  style: {},
  nameText: '',
  secureTextEntry: false,
  multiLine: false,
  error: false,
  onFocus: () => { },
  onBlur: () => { },
  dense: false
}

export default withTheme(memo(WSTextBox))