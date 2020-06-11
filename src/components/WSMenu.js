import React, { Fragment, PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'

import WSImage from '@components/WSImage'

const pageStyle = StyleSheet.create({
  largeIcon: {
    fontSize: ConfiguredStyle.fonts.xlg,
  },
  colorRight: {
    color: ConfiguredStyle.colors.blue.dark,
  },
})

class WSMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  render() {
    const { visible } = this.state
    const { data, rightIcon, referance, rightIconStyle } = this.props
    return (
      <Menu
        visible={visible}
        ref={referance}
        onDismiss={() => this.setState({ visible: false })}
        anchor={
          <WSImage
            image={rightIcon}
            height={ConfiguredStyle.size.s25}
            width={ConfiguredStyle.size.s25}
            resizeMode={'contain'}
            imageStyle={[{ backgroundColor: ConfiguredStyle.colors.white, marginLeft: 10 }, rightIconStyle]}
            onPress={() => this.setState({ visible: true })}
          />
        }
      >
        {
          data.map((item, index) => (
            <Fragment key={index}>
              <Menu.Item
                title={item && item.label}
                key={index}
                onPress={() => {
                  item.onPress();
                  this.setState({ visible: false });
                }}
              />
              {(data.length > (index + 1)) && <Divider />}
            </Fragment>
          ))
        }
      </Menu>
    )
  }
}

WSMenu.propTypes = {
  rightIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  data: PropTypes.array
}

WSMenu.defaultProps = {
  rightIcon: '',
  data: []
}

export default WSMenu;