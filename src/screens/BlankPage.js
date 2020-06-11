import React, { Component } from 'react'
import { View, Text } from 'react-native'

import WSHeader from '@components/WSHeader'

import common from '@styles/common'

class BlankPage extends Component {
  render() {
    const { componentId, navigation } = this.props
    return (
      <View style={[common.flexGrow1, common.bgWhite]}>
        <WSHeader
          name="Privacy Policy"
          enableBack
          onLeftMethod={() => navigation.goBack(componentId)}
        />
        <View style={[common.flex1, common.bgWhite, common.exactCenter]}>
          <Text style={common.f20}>Work In Progress</Text>
        </View>
      </View>
    )
  }
}

export default BlankPage