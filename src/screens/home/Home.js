import React, { Component } from 'react'
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	BackHandler,
	AsyncStorage
} from 'react-native'
import Sockette from 'sockette';
import { connect } from 'react-redux'
import config from 'react-native-config';
import _ from 'lodash'

import { localClient } from '../../../App'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'
import images from '@constants/Image'

import {
	sendToken,
	addUser,
	storeRoomSuccess,
	storeRoomStart,
	storeRoomClear,
	getSystemContacts,
	getSystemContactsClear,
	checkForAppContacts,
	getUserInfo,
	allUser,
	socketConnection,
} from '@redux/user/actions'
import {
	enterInRoom,
	getRooms,
	getRoomMessages,
	getCurrentRoomMessages,
	getRoomSuccess
} from '@redux/chat/actions'

import {
	getLatestRoomId,
	searchRoom,
	updateMessageToRealm,
	updateLastMessageInRoom,
	addRoomWiseMessageToRealm,
	addRoomsToRealm,
	updateRoomToRealm,
} from '../../realm/messageHelper';

import { isEmptyObj } from '@helper/GenericFunction'
import { storeContacts, userContacts } from '@graphql/userSchema'

import WSListLoader from '@components/WSListLoader'
import WSSnackBar from '@components/WSSnackBar'
import WSSearchBar from '@components/WSSearchBar'
import WSSwipeList from '@container/WSSwipeList'
import WSMenu from '@components/WSMenu'
import WSHeader from '@components/WSHeader'
import WSIcon from '@components/WSIcon'
import WSImage from '@components/WSImage'

import common from '@styles/common'
import styles from '@styles/AppStyle'

import InfoCard from './InfoCard'
import InviteList from './InviteList'

let ws = null;

const pageStyle = StyleSheet.create({
	icon: {
		color: ConfiguredStyle.colors.grey.medium,
		fontSize: ConfiguredStyle.fonts.md
	},
	resizeClose: {
		width: ConfiguredStyle.size.s35,
		height: ConfiguredStyle.size.s35,
		borderRadius: ConfiguredStyle.size.s35,
	},
	chatsLabel: {
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

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			focusOnSearch: false,
			isLoading: false,
			searchText: '',
			searchVisible: false,
			isAppStart: false,
			backClickCount: 0,
			personData: [{ id: 1, name: 'Anthony McDonald' }, { id: 2, name: 'Andrea Lucas' }, { id: 3, name: 'Henry Fisher' }, { id: 4, name: 'Janet Perkins' }, { id: 5, name: 'Mary Johnson' }],
		};
		this.toastRef = React.createRef();
	}

	async componentDidMount() {
		const {
			rooms,
			storeRoomClear,
			storedUser,
			allUserData,
			userData
		} = this.props;

		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);

		if (isEmptyObj(userData)) {
			this.props.getUserInfo();
		}

		let roomId = await getLatestRoomId();
		console.log('roomId:::::', roomId);

		if (roomId) {
			this.setState({ data: rooms })
			this.props.getRooms(roomId);
		} else {
			this.props.getRooms('');
		}

		if (allUserData && allUserData.length === 0) {
			this.props.allUser();
		}

		if (!isEmptyObj(storedUser)) {
			console.log('triggering clera store from Home....');
			storeRoomClear();
		}
		this.handleSocket();
	}

	componentDidUpdate(prevProps, prevState) {
		const { socketStatus } = this.props;
		if (prevProps.socketStatus && !socketStatus) {
			this.handleSocket();
		}
	}

	handleSocket = async () => {
		const { socketStatus } = this.props;

		const token = await AsyncStorage.getItem('token')
		console.log(token)
		let URL = `${config.SOCKET}?token=${token}`;
		console.log('Socket URL:', URL, socketStatus);

		if (!socketStatus) {
			ws = new Sockette(URL, {
				timeout: 5e3,
				maxAttempts: 1,
				onopen: e => {
					console.log('connected:', e);
					this.props.socketConnection(true);
				},
				onmessage: e => {
					this.onMessageReceived(e)
				},
				onreconnect: e => console.log('Reconnecting...', e),
				onmaximum: e => console.log('Stop Attempting!', e),
				onclose: e => {
					console.log('Closed!', e);
					this.props.socketConnection(false);
				},
				onerror: e => console.log('Error:', e),
			});
		}
	}

	onMessageReceived = async (messageData) => {
		const { storedUser } = this.props;
		let socketData = JSON.parse(messageData.data);
		console.log('socket received, data:', socketData);
		let data = socketData.data;

		if (socketData.action === 'addRoom') {
			await addRoomsToRealm(data);
			await addRoomWiseMessageToRealm(data);
			this.props.getRoomSuccess();
		}

		if (socketData.action === 'updateRoom') {
			await updateRoomToRealm(data);
			this.props.getRoomSuccess();
			if (storedUser?.room === data?.room) {
				this.props.storeRoomSuccess(data);
			}
		}

		if (socketData.action === 'addMessage') {
			await updateMessageToRealm(data);
			await updateLastMessageInRoom(data.room, data);
			this.props.getRoomSuccess();

			if (storedUser?.room === data?.room) {
      			this.props.getCurrentRoomMessages(data.room);
			}
		}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.rooms.length && !nextProps.systemContacts.length && nextProps.dataFetched && !nextProps.users.length) {
			return { data: nextProps.rooms, isLoading: false }
		} else if (nextProps.usersListFetched) {
			nextProps.getSystemContacts()
			nextProps.getSystemContactsClear()
			return { data: nextProps.rooms, isLoading: false }
		} else if (nextProps.systemContacts.length && nextProps.dataFetched) {
			Home.storeContactToDB(nextProps)
			nextProps.getSystemContactsClear()
			return {}
		}
		else {
			return { data: nextProps.rooms || [], isLoading: false, isAppStart: nextProps.rooms.length > 0 && isEmptyObj(nextProps.myRoom) ? false : true }
		}
	}

	static storeContactToDB(nextProps) {
		//do stuff and return value
		const { users } = nextProps;
		let input = {};
		input.contacts = users.map((user) => {
			if (user?.id) {
				return { id: user?.id }
			} else {
				return {
					givenName: user.givenName,
					number: user.number,
				}
			}
		})
		
		localClient.mutate({
			mutation: storeContacts,
			variables: {
				input,
			},
		}).then(res => {
			if (res.data.storeContacts?.contacts?.length > 0) {
				Home.getContacts(nextProps);
			}
		}).catch((err) => {
			throw err
		})
	}

	static getContacts(nextProps) {
		return localClient.query({
			query: userContacts,
			variables: { id: nextProps.userData?.id },
			fetchPolicy: 'no-cache',
		}).then(res => {
			if (res.data.userContacts) {
				nextProps.checkForAppContacts(res.data.userContacts?.contacts)
			}
			return res
		})
		.catch((err) => {
			throw err
		})
	}

	onRowClick = async (item) => {
		const { storeRoomStart, storeRoomSuccess, enterInRoom, getCurrentRoomMessages, navigation } = this.props
		if (item) {
			getCurrentRoomMessages(item.room);
			storeRoomStart();
			storeRoomSuccess(item);
		}

		enterInRoom({ input: { id: item?.id }, action: 'enter' })
		navigation.navigate('UserChat', { fromPage: enums.HOME })
	}

	onClickInvite = (invitedIndex) => {
		const { personData } = this.state

		const filterPerson = personData.map((person, index) => {
			return {
				...person,
				invited: index === invitedIndex || person.invited === true
			}
		})

		this.setState({
			personData: filterPerson
		});
	}

	renderLoadingComponent = () => {
		const loader = [];
		for (let i = 0; i < 4; i++) {
			loader.push(<View style={common.ph20} key={i.toString()}><WSListLoader key={`LoadingComponent-${i}`} /></View>)
		}
		return loader;
	}

	onChangeSearchText = (searchText) => {
		this.setState({ searchText })
	}

	getFilteredUsers = () => {
		const { searchText, data } = this.state

		if (searchText.length) {
			let temp = data.filter(item => {
				if (item?.type === enums.PRIVATEID) {
					return item?.members && item.members[0]?.userName.toLowerCase().includes(searchText.toLowerCase())
				} else {
					return item['roomName'] && item['roomName'].toLowerCase().includes(searchText.toLowerCase())
				}
			})
			return temp;
		} else {
			return data || []
		}
	}

	onClickSearch = () => {
		this.setState((prevState) => ({
			searchVisible: !prevState.searchVisible,
			searchText: ''
		}));
	}

	renderSearchUI = () => {
		const { userProfilePic, myRoom } = this.props
		const { searchVisible } = this.state
		if (searchVisible) {
			return <View style={[common.mh20, styles.borderBottom]}>
				<WSSearchBar
					placeholderText='Search colleagues, friends'
					changeText={text => this.onChangeSearchText(text)}
					onFocusChange={(focusOnSearch) => this.setState({ focusOnSearch })}
					renderRightComponent={() => (
						<WSIcon
							fontFamily={ConfiguredStyle.fontFamily.FARegular}
							iconStyle={pageStyle.icon}
							resizeStyle={pageStyle.resizeClose}
							iconCode="&#xf00d;"
							onBtnPress={this.onClickSearch}
							rippleColor={ConfiguredStyle.colors.rippleColorDark}
						/>
					)}
				/>
			</View>
		} else {
			return <InfoCard userProfile={userProfilePic} onPress={() => this.onRowClick(myRoom)} />
		}
	}

	renderList = () => {
		const { data, searchText } = this.state
		const { loginUserId, rooms, myRoom } = this.props
		if (data?.length > 0) {
			return <>
				{this.renderSearchUI()}
				<View style={[common.flex3, common.mt20, common.pb10]}>
					<View style={common.ph20}>
						<Text style={pageStyle.chatsLabel}>Chats</Text>
						<ScrollView showsVerticalScrollIndicator={false}>
							<WSSwipeList usersList={searchText !== '' ? searchRoom(searchText) : rooms} onBtnPress={this.onRowClick} loggedInUser={loginUserId} />
						</ScrollView>
					</View>
				</View>
			</>
		} else if (!isEmptyObj(myRoom)) {
			return (
				<ScrollView style={{ paddingTop: 15 }} showsVerticalScrollIndicator={false}>
					<InviteList {...this.props} />
				</ScrollView>
			);
		} else {
			return this.renderLoadingComponent()
		}
	}

	componentWillUnmount() {
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
		const { navigation } = this.props
		const { data, focusOnSearch, isAppStart } = this.state
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
			}
		];

		return (
			<>
				<View style={[common.flex1, common.bgWhite]}>
					{
						isAppStart
							?
							<WSHeader
								name='HosTalky'
								leftIcon={images.announcementCount}
								middleIcon={images.search}
								onMiddleMethod={this.onClickSearch}
								reference={ref => { this.ref = ref }}
								onLeftMethod={() => navigation.navigate('Announcement')}
								renderRightIcon={() => <WSMenu data={menus} rightIcon={images.menu} />}
							/>
							:
							<WSHeader
								name='HosTalky'
								leftIcon={images.announcementCount}
								middleIcon={images.search}
								reference={ref => { this.ref = ref }}
								onLeftMethod={() => navigation.navigate('Announcement')}
								renderRightIcon={() => <WSMenu data={menus} rightIcon={images.menu} />}
							/>
					}
					{this.renderList()}
				</View>
				{data?.length > 1 && !focusOnSearch &&
					<View style={pageStyle.fabButtonContainer}>
						<WSImage
							image={images.addNewAnnouncement}
							height={ConfiguredStyle.size.s60}
							width={ConfiguredStyle.size.s60}
							resizeMode={'contain'}
							imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, borderRadius: 30 }}
							onPress={() => navigation.navigate('NewChat')}
						/>
					</View>
				}
				<WSSnackBar ref={this.toastRef} />
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		rooms: state.user?.rooms,
		myRoom: state.user?.myRoom,
		users: state.user?.allUserInContact,
		isLoading: state.chat?.loading,
		userData: state.user?.userData,
		loginUserId: state.user?.userData?.id,
		userProfilePic: state.user?.userData?.media?.medium,
		storedUser: state.user?.storedUser,
		systemContacts: state.user?.contacts || [],
		dataFetched: state.user?.dataFetched,
		usersListFetched: state.user?.usersListFetched,
		userFromDb: state.user?.userFromDb,
		userFromDbFetched: state.user?.userFromDbFetched,
		socketStatus: state.user.socketStatus,
		allUserData: state.user.allUserData,
	}
};

const mapDispatchToProps = dispatch => (
	{
		getRooms: (value) => dispatch(getRooms(value)),
		allUser: () => dispatch(allUser()),
		sendToken: value => dispatch(sendToken(value)),
		getUserInfo: () => dispatch(getUserInfo()),
		addUser: (value) => dispatch(addUser(value)),
		storeRoomStart: () => dispatch(storeRoomStart()),
		storeRoomSuccess: (value) => dispatch(storeRoomSuccess(value)),
		storeRoomClear: () => dispatch(storeRoomClear()),
		getSystemContacts: () => dispatch(getSystemContacts()),
		getSystemContactsClear: () => dispatch(getSystemContactsClear()),
		checkForAppContacts: (data) => dispatch(checkForAppContacts(data)),
		enterInRoom: (data) => dispatch(enterInRoom(data)),
		getRoomMessages: value => dispatch(getRoomMessages(value)),
		getCurrentRoomMessages: value => dispatch(getCurrentRoomMessages(value)),
		socketConnection: value => dispatch(socketConnection(value)),
		getRoomSuccess: () => dispatch(getRoomSuccess()),
	}
);

export default connect(mapStateToProps, mapDispatchToProps)(Home)