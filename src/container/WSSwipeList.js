import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native'
import { SwipeRow, Thumbnail, Button } from 'native-base'
import moment from 'moment'
import _ from 'lodash'

import WSIcon from '@components/WSIcon'
import WSTouchableList from '@components/WSTouchableList'

import images from '@constants/Image'
import Typography from '@constants/Typography'
import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

import styles from '@styles/AppStyle'
import common from '@styles/common'

const pageStyle = StyleSheet.create({
  item: {
    flexGrow: ConfiguredStyle.flex.one,
    flexDirection: enums.ROW,
    alignItems: enums.CENTER,
    paddingVertical: ConfiguredStyle.padding.p12,
  },
  swipeList: {
    borderBottomWidth: ConfiguredStyle.size.none,
    paddingBottom: ConfiguredStyle.size.none,
    paddingTop: ConfiguredStyle.size.none,
    paddingRight: 0
  },
  icon: {
    fontSize: ConfiguredStyle.fonts.lg,
    color: ConfiguredStyle.colors.white,
  },
  name: {
    flex: 1,
    fontSize: ConfiguredStyle.fonts.sm,
    fontWeight: enums.BOLD,
    color: ConfiguredStyle.colors.primary,
  },
  message: {
    flex: 1,
    fontSize: ConfiguredStyle.fonts.f13,
    color: ConfiguredStyle.colors.blue.dark,
  }
})

class WSSwipeList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  userImage = (item) => {
    if (item?.type === enums.PRIVATEID && item?.members && item.members[0]?.media?.small) {
      return <Thumbnail small source={{ uri: item.members[0].media.small }} />
    } else if (item?.icon?.small) {
      return <Thumbnail small source={{ uri: item.icon.small }} />
    } else {
      return <Thumbnail small source={images.avatar} />
    }
  }

  getDate(item) {
    const today = moment().startOf('day')
    const yesterday = moment().subtract(1, 'days').startOf('day');

    if (item?.message?.sentAt) {
      let date = item.message.sentAt;

      if (moment(date).isSame(today, 'd')) {
        return moment(date).format('LT');
      } else if (moment(date).isSame(yesterday, 'd')) {
        return 'Yesterday';
      } else {
        return moment(date).format('DD-MM-YYYY');
      }
    }
    return '';
  }

  renderRoomList = ({ item, index }) => {
    const { loggedInUser, onBtnPress } = this.props

    // const newMessages = item && item.messages && item.messages.filter((msg) => {
    //   if (msg && msg.sender && msg.sender.id !== loggedInUser) {
    //     if (msg.messageSeen) {
    //       if (msg && msg.messageSeen && msg.messageSeen.length !== 0) {
    //         return msg.messageSeen[0] && !msg.messageSeen[0].seen
    //       }
    //     }
    //     return false
    //   } else {
    //     return false
    //   }
    // }).length
    // item.newMessages = newMessages
    item.newMessages = null;
    return (
      (item && item.roomName !== 'You') && <SwipeRow
        style={pageStyle.swipeList}
        leftOpenValue={0}
        rightOpenValue={-75}
        key={index.toString()}

        body={(
          <WSTouchableList
            rippleColor={ConfiguredStyle.colors.rippleColorDark}
            onPress={() => onBtnPress(item)}
          >
            <View hitSlop={common.hitSlope10} style={pageStyle.item}>
              {this.userImage(item)}

              <View style={[common.flex1, common.pl15]}>
                <View style={[common.flexDirectionRow, common.spaceBetween]}>
                  <Text style={pageStyle.name}>{(item?.type === enums.PRIVATEID) ? _.upperFirst(item.members[0].userName) : (item?.roomName) ? _.upperFirst(item.roomName) : ''}</Text>
                  <Text style={[common.textEnd, common.f10, { color: item?.newMessages ? ConfiguredStyle.colors.primary : ConfiguredStyle.colors.grey.medium, fontWeight: item?.newMessages ? '700' : '500' }]}>{this.getDate(item)}</Text>
                </View>
                <View style={[common.flexDirectionRow, common.spaceBetween]}>
                  <Text style={[common.flex1, Typography.h2]} ellipsizeMode="tail" numberOfLines={1}>
                    {(item?.message?.sender?.id === loggedInUser) ? <Text style={pageStyle.message}>You : </Text> : (item?.message?.sender?.userName) ? <Text style={pageStyle.message}>{item.message.sender.userName} : </Text> : <Text style={{ color: ConfiguredStyle.colors.grey.light }}>Start new chat here</Text>}
                    {item?.message?.message?.length > 35 ? `${(item.message.message).substring(0, 35)}...` : (item?.message?.message ? <Text style={pageStyle.message}>{item.message.message}</Text> : '')}
                  </Text>
                  {item?.newMessages ? <View style={[styles.badge, common.exactCenter]} >
                    <Text style={{ color: ConfiguredStyle.colors.white }}>{item.newMessages}</Text>
                  </View> : <></>}
                </View>
              </View>
            </View>
          </WSTouchableList>
        )}
        right={(
          <Button style={{ backgroundColor: ConfiguredStyle.colors.primary }}>
            <WSIcon
              iconStyle={pageStyle.icon}
              fontFamily={ConfiguredStyle.fontFamily.FABold}
              iconCode="&#xf2ed;"
            />
          </Button>
        )}
      />
    )
  }

  render() {
    const { usersList } = this.props
    return (
      <>
        {
          usersList.length !== 0 ?
            <FlatList
              data={usersList}
              extraData={this.props}
              contentContainerStyle={common.pv5}
              keyExtractor={(item, index) => "room_" + index}
              renderItem={this.renderRoomList}
            />
            :
            <View />
        }
      </>
    )
  }
}

export default WSSwipeList