import React from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native'
import { Thumbnail } from 'native-base'

import images from '@constants/Image'
import Typography from '@constants/Typography'

import EmptyState from '@components/EmptyState'

import common from '@styles/common'

const WSInviteList = (props) => {
  const { usersList, onClickText } = props
  return (
    <FlatList
      data={usersList}
      extraData={this.props}
      keyExtractor={(item, index) => 'inviteUser_' + index}
      ListEmptyComponent={() => (
        <EmptyState message='No Contacts Found' image={images.avatar} margin={80} />
      )}
      renderItem={({ item, index }) => (
        <View style={[common.flexDirectionRow, common.mb15]} key={index.toString()}>
          <Thumbnail small source={images.avatar} />
          <View style={[common.flexGrow1, common.selfCenter, common.pl20]}>
            <Text style={Typography.PrimaryH1}>{item && item.name}</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => onClickText(index)}>
            <View style={common.selfCenter}>
              <Text style={(item && item.invited) ? common.greyColor : common.colorPrimary}>{item && item.invited ? 'Invited' : '+Invite'}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    />
  )
}

export default React.memo(WSInviteList)