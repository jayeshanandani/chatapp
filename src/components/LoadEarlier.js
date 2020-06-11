import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

const StylePropType = PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
]);

const styles = StyleSheet.create({
  container: {
    alignItems: enums.CENTER,
    marginTop: ConfiguredStyle.margin.xsm,
    marginBottom: ConfiguredStyle.margin.sm,
  },
  wrapper: {
    alignItems: enums.CENTER,
    justifyContent: enums.CENTER,
    backgroundColor: ConfiguredStyle.colors.grey.lightColor,
    borderRadius: ConfiguredStyle.size.s15,
    height: ConfiguredStyle.size.s30,
    paddingLeft: ConfiguredStyle.padding.sm,
    paddingRight: ConfiguredStyle.padding.sm,
  },
  text: {
    backgroundColor: ConfiguredStyle.colors.backgroundTransparent,
    color: ConfiguredStyle.colors.white,
    fontSize: ConfiguredStyle.fonts.xsm,
  },
  activityIndicator: {
    marginTop: Platform.select({
      ios: -14,
      android: -16,
      default: -15,
    }),
  },
})

class LoadEarlier extends PureComponent {

  renderLoading() {
    if (this.props.isLoadingEarlier === false) {
      return (
        <Text style={[styles.text, this.props.textStyle]}>
          {this.props.label}
        </Text>
      )
    }
    return (
      <View>
        <Text style={[styles.text, this.props.textStyle, { opacity: 0 }]}>
          {this.props.label}
        </Text>
        <ActivityIndicator
          color={this.props.activityIndicatorColor}
          size={this.props.activityIndicatorSize}
          style={[styles.activityIndicator, this.props.activityIndicatorStyle]}
        />
      </View>
    )
  }
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          if (this.props.onLoadEarlier) {
            this.props.onLoadEarlier()
          }
        }}
        disabled={this.props.isLoadingEarlier === true}
        accessibilityTraits='button'
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          {this.renderLoading()}
        </View>
      </TouchableOpacity>
    )
  }
}

LoadEarlier.propTypes = {
  onLoadEarlier: PropTypes.func,
  isLoadingEarlier: PropTypes.bool,
  label: PropTypes.string,
  containerStyle: StylePropType,
  wrapperStyle: StylePropType,
  textStyle: StylePropType,
  activityIndicatorStyle: StylePropType,
  activityIndicatorColor: PropTypes.string,
  activityIndicatorSize: PropTypes.string,
}

LoadEarlier.defaultProps = {
  onLoadEarlier: () => { },
  isLoadingEarlier: false,
  label: 'Load earlier messages',
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  activityIndicatorStyle: {},
  activityIndicatorColor: ConfiguredStyle.colors.white,
  activityIndicatorSize: 'small',
}

export default LoadEarlier;