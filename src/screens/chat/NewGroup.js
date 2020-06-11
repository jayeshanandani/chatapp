import React, { PureComponent } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Keyboard,
  BackHandler
} from 'react-native'
import { Thumbnail, Icon } from 'native-base'
import { Divider } from 'react-native-paper'
import { connect } from 'react-redux'
import uuidv1 from 'uuid/v1'
import Config from 'react-native-config'
import _ from 'lodash'

import images from '@constants/Image'
import enums from '@constants/Enum'
import Typography from '@constants/Typography'
import ConfiguredStyle from '@constants/Variables'

import { addRoomList, clearAddRoom } from '@redux/user/actions'
import { enterInRoom, getCurrentRoomMessages } from '@redux/chat/actions'

import { defaultImageMimetype } from '@helper/keysForBucket'

import WSHeader from '@components/WSHeader'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSImage from '@components/WSImage'
import WSSnackBar from '@components/WSSnackBar'
import WSLoader from '@components/WSLoader'
import WSImagePicker from '@components/WSImagePicker'

import styles from '@styles/AppStyle'
import common from '@styles/common'
import { uploadFile } from '../../helper/httpService'

const pageStyle = StyleSheet.create({
  iconStyle: {
    flexDirection: enums.ROW,
    paddingHorizontal: ConfiguredStyle.padding.md,
    paddingVertical: ConfiguredStyle.padding.p15,
    alignItems: enums.CENTER
  },
  IconStyle: {
    position: enums.ABSOLUTE,
    bottom: 5,
    right: 0,
  },
  icon: {
    color: ConfiguredStyle.colors.white,
    fontSize: ConfiguredStyle.fonts.xsm,
  }
})

class NewGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      groupMembers: [],
      roomName: '',
      startChat: false,
    }
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  handleBack = () => {
    const { navigation } = this.props
    return navigation.goBack();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { startChat } = prevState
    const { fromPage, addRoomSuccess, navigation, enterInRoom, getCurrentRoomMessages, clearAddRoom } = nextProps
    console.log('new group', fromPage !== enums.HOME, fromPage !== enums.NEWCHAT, fromPage !== enums.CONTACTLIST, addRoomSuccess, startChat);
    
    if (fromPage !== enums.HOME && fromPage !== enums.NEWCHAT && fromPage !== enums.CONTACTLIST && addRoomSuccess && startChat) {
      getCurrentRoomMessages(nextProps.storedUser.room);
      enterInRoom({ input: { id: nextProps.storedUser?.id }, action: 'enter' })
      clearAddRoom();
      navigation.navigate('UserChat', { userName: nextProps.storedUser?.roomName, fromPage: enums.NEWGROUP })
      return { isLoading: false, startChat: false }
    }
  }

  onPassProp = (data) => {
    if (data) {
      this.setState({
        groupMembers: data,
      });
    }
  }

  addRoom = async () => {
    Keyboard.dismiss();
    const { addRoomList } = this.props
    const { groupMembers, roomName, imageUrl } = this.state
    const userIds = groupMembers.map((user) => user && user.id)
    this.setState({
      isLoading: true,
      startChat: true,
    })
    const input = {
      roomName: roomName,
      type: enums.GROUP,
      members: userIds,
      icon: {
        bucket: Config.AWS_BUCKET,
        url: imageUrl,
      }
    }

    if (!roomName.length) {
      this.setState({
        isLoading: false
      })
      this.refs.toast.show('Provide a group name', 1000);
    } else if (!groupMembers.length) {
      this.setState({
        isLoading: false
      })
      this.refs.toast.show('At least one contact must be selected', 1000);
    } else {
      addRoomList(input);
    }
  }

  getImageDetailsToUpload = (details) => {
    let extension;
    if (details?.type) {
      const extensionIndex = details.path.lastIndexOf(".");
      extension = details.path.slice(extensionIndex + 1);
    } else {
      extension = defaultImageMimetype;
    }
    this.setState(prevState => ({ ...prevState, isLoading: true }), async () => {
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const correspondingMime = ["image/jpeg", "image/jpeg", "image/png"];
      const fileName = `${uuidv1()}.${extension}`;
      const file = {
        uri: details.uri,
        name: fileName,
        type: correspondingMime[allowedExtensions.indexOf(extension)],
      };
      const res = await uploadFile(file);
      console.log('response from image upload', res);  
      this.setState({ imageUrl: fileName, isLoading: false });
    });
  }

  removeUser = (id) => {
    const { groupMembers } = this.state
    const removedElement = _.remove(groupMembers, function (item) {
      return item && item.id !== id
    })
    this.setState({
      groupMembers: removedElement
    })
  }

  renderAddedUserList = ({ item }) => {
    return (
      //   <View style={[common.flexGrow1, common.selfCenter, common.pl10]}>
      //     <Text style={Typography.PrimaryH1}>
      //       {item && item.userName}
      //     </Text>
      //   </View>
      <View style={[common.mr10]}>
        <Thumbnail source={(item && item.media && item.media.small) ? { uri: item && item.media && item.media.small } : images && images.avatar} />
        <View style={[common.exactCenter, pageStyle.IconStyle]}>
          <WSImage
            image={images.cancelGroupUsers}
            height={ConfiguredStyle.size.s15}
            width={ConfiguredStyle.size.s15}
            resizeMode={'contain'}
            imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, borderRadius: 20 }}
            onPress={() => this.removeUser(item && item.id)}
          />
        </View>
      </View>
    )
  }

  changeName = (text) => {
    this.setState((prevState) => ({ ...prevState, roomName: text }))
  }

  render() {
    const { groupMembers, isLoading } = this.state
    const { navigation } = this.props
    const { roomName } = this.state
    return (
      <View style={[common.flexGrow1, common.bgWhite]}>
        <WSHeader
          name="New Group"
          enableBack
          onLeftMethod={this.handleBack}
        />
        <View style={[common.ph20, common.mt20, common.flexDirectionRow, common.alignItemCenter]}>
          <WSImagePicker getImageDetailsToUpload={this.getImageDetailsToUpload} />
          <Text style={[styles.primaryColorText, common.ml20]}>Upload group icon</Text>
        </View>
        <View style={[common.ph20]}>
          {groupMembers.length ? <Text style={[Typography.h3, common.pv15, { color: ConfiguredStyle.colors.grey.medium }]}>Participants</Text> : <></>}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={groupMembers}
            extraData={this.props}
            keyExtractor={(item, index) => 'groupMembers_' + index}
            renderItem={this.renderAddedUserList}
          />
          {groupMembers.length ? <Divider style={{ backgroundColor: ConfiguredStyle.colors.grey.medium, marginTop: 25 }} /> : <></>}
        </View>
        <View style={[common.ph20]}>
          <WSTextBox
            mode="Flat"
            placeholderText="Group Name"
            value={roomName}
            changeText={(value) => this.changeName(value)}
            style={{ paddingTop: 0 }}
          />
        </View>
        <View style={[pageStyle.iconStyle]}>
          <Icon type='AntDesign' name='addusergroup' style={{ color: ConfiguredStyle.colors.black, fontSize: ConfiguredStyle.fonts.f18 }} />
          <Text style={[Typography.PrimaryH1, common.pl20]} onPress={() => navigation.navigate('AddPeople', { onPassProp: this.onPassProp, passSelectedData: groupMembers })}>
            Add People
          </Text>
        </View>
        <View style={[common.pv15, common.ph20]}>
          <WSButton
            onBtnPress={this.addRoom}
            name="Done"
            style={{ borderRadius: 50 }}
          />
        </View>
        {isLoading && <WSLoader />}
        <WSSnackBar
          ref="toast"
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rooms: state.user.rooms,
    storedUser: state.user.storedUser,
    addRoomSuccess: state.user.addRoomSuccess,
    storedUserSuccess: state.user.storedUserSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enterInRoom: (data) => dispatch(enterInRoom(data)),
    addRoomList: (value) => dispatch(addRoomList(value)),
    clearAddRoom: () => dispatch(clearAddRoom()),
    getCurrentRoomMessages: value => dispatch(getCurrentRoomMessages(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGroup)