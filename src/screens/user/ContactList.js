import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    BackHandler
} from 'react-native'
import { connect } from 'react-redux'

import ConfiguredStyle from '@constants/Variables'
import WSListLoader from '@components/WSListLoader'
import enums from '@constants/Enum'
import images from '@constants/Image'

import { addRoomList } from '@redux/user/actions'
import { allUser, storeRoomSuccess, storeRoomStart } from '@redux/user/actions'
import { enterInRoom, getCurrentRoomMessages } from '@redux/chat/actions'

import searchFilter from '@helper/filterUtil'

import WSContactList from '@container/WSContactList'

import WSHeader from '@components/WSHeader'
import WSSearchBar from '@components/WSSearchBar'
import WSMenu from '@components/WSMenu'
import WSSnackBar from '@components/WSSnackBar'
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
    contactsLabel: {
        fontSize: ConfiguredStyle.fonts.f18,
        fontFamily: ConfiguredStyle.fontFamily.FAMedium,
        color: ConfiguredStyle.colors.blue.dark,
        paddingBottom: 5
    },
    fabButtonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    }
})
class ContactList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeFab: false,
            startChat: false,
            focusOnSearch: false,
            searchText: '',
            backClickCount: 0,
        };
        this.toastRef = React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { name, image, startChat } = prevState
        const { fromPage, addRoomSuccess, navigation, enterInRoom, getCurrentRoomMessages, storedUser } = nextProps
        if (fromPage !== enums.HOME && fromPage !== enums.NEWCHAT && fromPage !== enums.NEWGROUP && addRoomSuccess && startChat) {
			try {
                getCurrentRoomMessages(storedUser.room);
                enterInRoom({ input: { id: storedUser?.id }, action: 'enter' })
            } catch(e) {
                console.log('=======================', e);
                
            }
            navigation.navigate('UserChat', { userName: name, fromPage: enums.CONTACTLIST, thumbnail: image })
            return { startChat: false }
        }
        return {};
    }

    addRoom = async (item) => {
        if (item?.userName) {
            const { addRoomList, rooms, storeRoomStart, storeRoomSuccess, getCurrentRoomMessages, navigation } = this.props
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
                navigation.navigate('UserChat', { userName: item?.userName, fromPage: enums.CONTACTLIST, thumbnail: item?.media?.small })
            } else {
                console.log("creating room...");
                addRoomList(input);
            }
        } else {
            this.toastRef.current.show('Not an app user', 1000);
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
        const { users } = this.props
        const { searchText } = this.state
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
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    handleBackButtonPressAndroid = () => {
        const { navigation } = this.props
        const { backClickCount } = this.state
        if (!navigation.isFocused()) {
            // The screen is not focused, so don't do anything
            return false;
        }
        if (backClickCount == 0) {
            this.setState({ backClickCount: 1 }, () => {
                this.toastRef.current.show('Press back again to exit', 1000);
                setTimeout(() => {
                    this.setState({ backClickCount: 0 })
                }, 3000);
            });
            return true;
        } else {
            this.setState({ backClickCount: 0 }, () => BackHandler.exitApp());
            return true;
        }
    };

    render() {
        const { isLoading, user, allUser, navigation } = this.props
        const { focusOnSearch } = this.state
        const menus = [
            {
                label: 'New Chat',
                onPress: () => navigation.navigate("NewChat")
            },
            {
                label: 'New Group',
                onPress: () => navigation.navigate("NewGroup")
            },
            {
                label: 'Reminders',
                onPress: () => navigation.navigate("Reminder")
            },
            {
                label: 'Help',
                onPress: () => navigation.navigate("Help")
            },
            {
                label: 'Refresh',
                onPress: () => allUser()
            }
        ];

        return (
            <View style={[common.flex1, common.bgWhite]}>
                <WSHeader
                    name='HosTalky'
                    leftIcon={images.announcementCount}
                    middleIcon={images.search}
                    reference={ref => { this.ref = ref }}
                    onLeftMethod={() => navigation.navigate('Announcement')}
                    renderRightIcon={() => <WSMenu data={menus} rightIcon={images.menu} />}
                />
                <View style={[common.ph20, common.flex1]}>
                    <WSSearchBar
                        placeholderText='Search colleagues, friends'
                        changeText={text => this.onChangeSearchText(text)}
                        onFocusChange={(focusOnSearch) => this.setState({ focusOnSearch })}
                    />
                    <View style={[common.flexDirectionRow, common.alignItemCenter]}>
                        <Text style={pageStyle.contactsLabel}>Contacts</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                        {isLoading ?
                            this.renderLoadingComponent()
                            :
                            <WSContactList usersList={this.getFilteredUsers()} onBtnPress={this.addRoom} showMemberInfo={false} loggedInUser={user && user.id} />
                        }
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
                <WSSnackBar
                    ref={this.toastRef}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.user.rooms,
        users: state.user.allUserData,
        isLoading: state.user.contactLoading,
        addRoomSuccess: state.user.addRoomSuccess,
        storedUser: state.user.storedUser,
        user: state.user.userData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        enterInRoom: (data) => dispatch(enterInRoom(data)),
        addRoomList: (value) => dispatch(addRoomList(value)),
        allUser: () => dispatch(allUser()),
        storeRoomStart: () => dispatch(storeRoomStart()),
        storeRoomSuccess: (value) => dispatch(storeRoomSuccess(value)),
        getCurrentRoomMessages: value => dispatch(getCurrentRoomMessages(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)