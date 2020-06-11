import React, { Component } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'
import images from '@constants/Image'

import WSContactList from '@container/WSContactList'

import { addRoomList, storeRoomStart, storeRoomSuccess } from '@redux/user/actions'
import { enterInRoom, getCurrentRoomMessages } from '@redux/chat/actions'

import searchFilter from '@helper/filterUtil'

import WSHeader from '@components/WSHeader'
import WSSearchBar from '@components/WSSearchBar'
import WSListLoader from '@components/WSListLoader'
import WSImage from '@components/WSImage'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
    iconColor: {
        color: ConfiguredStyle.colors.primary,
        fontSize: ConfiguredStyle.fonts.lg,
    },
    resizeStyle: {
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    fabButtonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    chatsLabel: {
		fontSize: ConfiguredStyle.fonts.f18,
		fontFamily: ConfiguredStyle.fontFamily.FAMedium,
		color: ConfiguredStyle.colors.blue.dark,
		paddingBottom: 5
	},
})

class NewChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeFab: false,
            startChat: false,
            focusOnSearch: false,
            searchText: ''
        };
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { name, image, startChat } = prevState
        const { fromPage, addRoomSuccess, navigation, enterInRoom, getCurrentRoomMessages } = nextProps
        if (fromPage !== enums.HOME && fromPage !== enums.CONTACTLIST && fromPage !== enums.NEWGROUP && addRoomSuccess && startChat) {
            getCurrentRoomMessages(nextProps.storedUser?.room);
            enterInRoom({ input: { id: nextProps.storedUser?.id }, action: 'enter' })
            navigation.navigate('UserChat', { userName: name, fromPage: enums.NEWCHAT, thumbnail: image })
            return {startChat: false}
        }
    }

    addRoom = async (item) => {
        const { addRoomList, rooms, storeRoomStart, storeRoomSuccess, getCurrentRoomMessages, navigation, enterInRoom } = this.props
        const input = { roomName: item?.userName, type: enums.PRIVATE, user: item?.id }

        this.setState({
            name: item?.userName,
            image: item?.media?.small,
            startChat: true,
        })
        const isAdded = rooms.filter(element => (element?.members && element.members[0]?.id) === (item?.id))
        if (isAdded.length) {
            console.log("i have already that room");
            
            getCurrentRoomMessages(isAdded[0].room);
            storeRoomStart();
            storeRoomSuccess(isAdded[0]);
            enterInRoom({ input: { id: isAdded[0] && isAdded[0].id }, action: 'enter' })
            navigation.navigate('UserChat', { userName: item && item.userName, fromPage: enums.NEWCHAT, thumbnail: item && item.media && item.media.small})
        } else {
            console.log("creating room...");
            addRoomList(input);
        }
    }

    renderLoadingComponent = () => {
        const loader = []
        for (let i = 0; i < 3; i++) {
            loader.push(<WSListLoader key={`LoadingComponent-${i}`} />)
        }
        return loader;
    }

    onChangeSearchText = (searchText) => {
        this.setState({ searchText })
    }

    getFilteredUsers = () => {
        const { searchText } = this.state
        const { users } = this.props
        if (searchText.length) {
            return searchFilter(users, searchText, 'userName');
        } else {
            return users
        }
    }

    componentWillUnmount() {
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    render() {
        const { isLoading, componentId, navigation } = this.props
        const { focusOnSearch } = this.state
        return (
            <View style={[common.flex1, common.bgWhite]}>
                <WSHeader
                    name='New Chat'
                    enableBack
                    middleIcon={images.search}
                    onLeftMethod={() => navigation.goBack(componentId)}
                />
                <View style={[common.ph20, common.flex1]}>
                    <WSSearchBar
                        placeholderText='Search colleagues, friends'
                        changeText={text => this.onChangeSearchText(text)}
                        onFocusChange={(focusOnSearch) => this.setState({ focusOnSearch })}
                    />
                    <View style={[common.flexDirectionRow, common.alignItemCenter]}>
                        <Text style={pageStyle.chatsLabel}>Select Contacts</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {isLoading && this.renderLoadingComponent()}
                        <WSContactList usersList={this.getFilteredUsers()} onBtnPress={this.addRoom} showMemberInfo={false} />
                    </ScrollView>
                </View>
                {!focusOnSearch && (
                    <View style={pageStyle.fabButtonContainer}>
                        <WSImage
                            image={images.addNewAnnouncement}
                            height={ConfiguredStyle.size.s60}
                            width={ConfiguredStyle.size.s60}
                            resizeMode={'contain'}
                            imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, borderRadius: 30 }}
                            onPress={() => navigation.navigate('ContactTab')}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.user.rooms,
        storedUser: state.user.storedUser,
        users: state.user.allUserInContact,
        isLoading: state.user.contactLoading,
        addRoomSuccess: state.user.addRoomSuccess,
        storedUserSuccess: state.user.storedUserSuccess,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        enterInRoom: (data) => dispatch(enterInRoom(data)),
        addRoomList: (value) => dispatch(addRoomList(value)),
        storeRoomStart: () => dispatch(storeRoomStart()),
        storeRoomSuccess: (value) => dispatch(storeRoomSuccess(value)),
		getCurrentRoomMessages: value => dispatch(getCurrentRoomMessages(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewChat)