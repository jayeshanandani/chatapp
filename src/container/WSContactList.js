import React, { PureComponent } from 'react'
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert
} from 'react-native'
import { Thumbnail } from 'native-base'
import { connect } from 'react-redux'
import _ from 'lodash'
import RNPopoverMenu from 'react-native-popover-menu'

import Typography from '@constants/Typography'
import ConfiguredStyle from '@constants/Variables'
import images from '@constants/Image'
import enums from '@constants/Enum'

import { storeRoomStart, storeRoomSuccess, addRoomList } from '@redux/user/actions'
import { enterInRoom, getCurrentRoomMessages } from '@redux/chat/actions'

import EmptyState from '@components/EmptyState'
import WSTouchable from '@components/WSTouchable'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  item: {
    flexDirection: enums.ROW,
    paddingVertical: ConfiguredStyle.padding.p15,
    alignItems: enums.CENTER,
    borderBottomWidth: ConfiguredStyle.radius.border,
    borderBottomColor: ConfiguredStyle.colors.grey.lightLine,
  },
})

class WSContactList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      page: '',
      image: {},
      messageList: [],
      startChat: false
    }
    this.ref = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { name, page, image, startChat } = prevState
    const { navigation, fromPage, addRoomSuccess, storedUser, getCurrentRoomMessages, enterInRoom } = nextProps;

    if (fromPage !== enums.NEWCHAT && fromPage !== enums.CONTACTLIST && addRoomSuccess && startChat) {
      getCurrentRoomMessages(storedUser?.room);
      enterInRoom({ input: { id: storedUser?.id }, action: 'enter' })
      navigation.navigate('UserChat', { userName: name, fromPage: page, thumbnail: image })
      return { startChat: false };
    }
    return {};
  }

  addRoom = async (item) => {
    const { addRoomList } = this.props
    const input = { roomName: item?.userName, type: enums.PRIVATE, user: item?.id }
    this.setState({
      name: item?.userName,
      page: enums.HOMEPROFILE,
      image: item?.media?.small,
      startChat: true,
    })

    addRoomList(input);
  }

  memberMoreInfo = (member, index) => {
    const { storedUser, removeUserFunc, loggedInUser } = this.props
    const userMenu = [
      {
        menus: [
          { label: 'Message' },
        ],
      },
    ]
    const adminMenu = [
      {
        menus: [
          { label: 'Message' },
        ],
      },
      {
        menus: [
          { label: 'Remove' },
        ],
      },
    ]

    RNPopoverMenu.Show(this.ref.current, {
      title: 'contact action',
      menus: (storedUser?.admin?.id === loggedInUser) ? adminMenu : userMenu,
      textColor: ConfiguredStyle.colors.pureBlack,
      onDone: (selection) => {
        if (selection === 0) {
          const { storeRoomStart, storeRoomSuccess, enterInRoom, rooms, getCurrentRoomMessages, navigation } = this.props
          let temp = rooms.filter(item => {
            return (item.type !== enums.PRIVATEID) && item?.members && item.members[0]?.userName.toLowerCase() === member?.userName.toLowerCase()
          })
          if (temp.length > 0) {
            getCurrentRoomMessages(temp[0].room);
            storeRoomStart();
            storeRoomSuccess(temp[0]);
            // enterInRoom({ input: { id: storedUser?.id }, action: 'leave' })
            enterInRoom({ input: { id: temp[0].id }, action: 'enter' })
            navigation.navigate('UserChat', { fromPage: enums.HOMEPROFILE, userName: temp[0].userName, thumbnail: temp[0].media?.small })
          } else {
            // enterInRoom({ input: { id: storedUser?.id }, action: 'leave' })
            this.addRoom(member)
          }
        }
        if (selection === 1) {
          Alert.alert(
            'Remove Participant',
            'Are you sure? want to remove this participant.',
            [
              {
                text: 'No',
                onPress: () => console.log('Permission denied'),
                style: 'cancel',
              },
              { text: 'Yes', onPress: () => removeUserFunc(member?.id) },
            ],
          )

        }
      },
    })
  }

  _renderEmptyState = () => {
    return (
      <EmptyState message='No Contacts Found' image={images.avatar} margin={80} />
    )
  }

  render() {
    const {
      usersList,
      onBtnPress,
      loggedInUser,
      showMemberInfo
    } = this.props
    return (
      <FlatList
        data={usersList}
        ref={this.ref}
        extraData={this.props}
        keyExtractor={(item, index) => "contactUser_" + index}
        ListEmptyComponent={this._renderEmptyState}
        renderItem={({ item, index }) => (
          <WSTouchable
            rippleColor={ConfiguredStyle.colors.rippleColorDark}
            onPress={() => onBtnPress(item)}
            onLongPress={() => {
              if (showMemberInfo && item?.id !== loggedInUser) {
                this.memberMoreInfo(item, index)
              } else {
                return false
              }
            }}
          >
            <View hitSlop={common.hitSlope10} style={pageStyle.item}>
              {item?.media?.small
                ? <Thumbnail small source={{ uri: item.media.small }} />
                : <Thumbnail small source={images.avatar} />
              }
              <View style={common.pl15}>
                <Text style={[Typography.PrimaryH1, common.fullWidth]}>{(item?.id === loggedInUser) ? 'You' : _.upperFirst(item?.userName || item?.givenName)}</Text>
                {(item?.careId) ? <Text style={[Typography.h2, common.fBold]}>{item?.careId}</Text> : <></>}
              </View>
            </View>
          </WSTouchable>
        )
        }
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    rooms: state.user.rooms,
    storedUser: state.user.storedUser,
    addRoomSuccess: state.user.addRoomSuccess,
  }
};

const mapDispatchToProps = dispatch => (
  {
    addRoomList: (value) => dispatch(addRoomList(value)),
    storeRoomStart: (value) => dispatch(storeRoomStart(value)),
    storeRoomSuccess: (value) => dispatch(storeRoomSuccess(value)),
    enterInRoom: (data) => dispatch(enterInRoom(data)),
    getCurrentRoomMessages: value => dispatch(getCurrentRoomMessages(value)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(WSContactList)