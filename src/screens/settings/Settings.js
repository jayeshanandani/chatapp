import React, { Component } from 'react'
import {
	View,
	BackHandler,
	Switch,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	Text,
} from 'react-native'
import { connect } from 'react-redux'

import ConfiguredStyle from '@constants/Variables'
import images from '@constants/Image'
import Typography from '@constants/Typography'

import WSList from '@components/WSList'
import WSHeader from '@components/WSHeader'
import WSMenu from '@components/WSMenu'
import WSSnackBar from '@components/WSSnackBar'
import ImageModal from '@components/ImageModal'

import common from '@styles/common'

const pageStyles = StyleSheet.create({
	avatar: {
		borderRadius: ConfiguredStyle.size.s15,
		width: ConfiguredStyle.dimensions.fullHeight / 8,
		height: ConfiguredStyle.dimensions.fullHeight / 8,
	},
	userPhone: {
		fontSize: ConfiguredStyle.fonts.xsm,
		color: ConfiguredStyle.colors.grey.medium,
	},
});

class Settings extends Component {
	constructor(props) {
		super(props)
		this.state = {
			backClickCount: 0,
			imageModal: false
		};
		this.toastRef = React.createRef();
	}

	componentDidMount() {
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
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

	setImageModalVisible(visible) {
		this.setState({ imageModal: visible });
	}

	nextPage = (e) => {
		const { navigation } = this.props
		if (!e.right) {
			navigation.navigate(e.page)
		}
	}

	onToggleSwitch = () => {
		this.setState((prevState) => ({
			...prevState,
			switchOn: !prevState.switchOn
		}));
	}

	render() {
		const { userProfilePic, userName, user, navigation } = this.props
		const { imageModal, switchOn } = this.state
		const data = [
			{ familyName: 'AntDesign', iconName: 'user', name: 'Personal Details', page: 'PersonalDetails' },
			{ familyName: 'AntDesign', iconName: 'mail', name: 'Email Address', page: 'AddEmailAddress' },
			{ familyName: 'AntDesign', iconName: 'phone', name: 'Phone Number', page: 'AddPhoneNumber' },
			{ familyName: 'SimpleLineIcons', iconName: 'lock', name: 'Change Password', page: 'ChangePassword' },
			{ familyName: 'MaterialCommunityIcons', iconName: 'timer', name: 'Your Reminders', page: 'Reminder' },
			{ familyName: 'MaterialCommunityIcons', iconName: 'timer', name: 'View Archives', page: 'ArchiveAnnoucement' },
			{ familyName: 'SimpleLineIcons', iconName: 'bell', name: 'Notification', right: () => (<Switch value={switchOn} onValueChange={this.onToggleSwitch} trackColor={{ true: ConfiguredStyle.colors.primary, false: ConfiguredStyle.colors.grey.light }} thumbColor={ConfiguredStyle.colors.primary} />) }
		];
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
			<View style={[common.flexGrow1, common.bgWhite]}>
				<WSHeader
					name='HosTalky'
					leftIcon={images.announcementCount}
					reference={ref => { this.ref = ref }}
					onLeftMethod={() => navigation.navigate('Announcement')}
					renderRightIcon={() => <WSMenu data={menus} rightIcon={images.menu} />}
				/>
				<ImageModal closeAction={() => this.setImageModalVisible(false)} visibility={imageModal} image={userProfilePic ? { uri: userProfilePic } : images.avatar} />
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: ConfiguredStyle.size.lg }}
				>
					<View style={[common.mh20, common.mt40, common.mb40, common.flexDirectionRow, { alignItems: 'flex-end', justifyContent: 'flex-start' }]}>
						<TouchableOpacity onPress={() => this.setImageModalVisible(true)}>
							<Image source={userProfilePic ? { uri: userProfilePic } : images.avatar} resizeMode={'cover'} style={pageStyles.avatar} />
						</TouchableOpacity>
						<View style={[common.ml20, common.flex1]}>
							<Text style={Typography.PrimaryH1}>{userName || ''}</Text>
							{user && user.careId !== '' && <Text style={[common.fBold, pageStyles.userPhone]}>{user.careId}</Text>}
						</View>
					</View>
					<WSList
						usersList={data}
						onBtnPress={this.nextPage}
					/>
				</ScrollView>
				<WSSnackBar ref={this.toastRef} />
			</View>
			// <AudioBox />
			// <CareIdentifier />
		);
	}
}

const mapStateToProps = state => (
	{
		user: state.user.userData,
		userProfilePic: state.user?.userData?.media?.medium,
		userName: state.user?.userData?.userName
	}
);

const mapDispatchToProps = dispatch => (
	{
		updateUserProfile: value => dispatch(updateUserProfile(value)),
		updateUserProfileClear: () => dispatch(updateUserProfileClear()),
	}
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings)