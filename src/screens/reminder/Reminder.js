import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Share,
	BackHandler
} from 'react-native'
import { SwipeRow } from 'native-base'
import moment from 'moment'
import { connect } from 'react-redux'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'
import Typography from '@constants/Typography'
import images from '@constants/Image'

import { getReminder, deleteReminder, clearFlags } from '@redux/reminder/actions'

import WSHeader from '@components/WSHeader'
import WSIcon from '@components/WSIcon'
import WSLoader from '@components/WSLoader'
import WSImage from '@components/WSImage'
import WSSnackBar from '@components/WSSnackBar'
import EmptyState from '@components/EmptyState'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
	timePosition: {
		position: enums.ABSOLUTE,
		right: ConfiguredStyle.size.s11,
		top: ConfiguredStyle.size.xsm,
	},
	boldText: {
		fontSize: ConfiguredStyle.fonts.f18,
		fontWeight: enums.BOLD,
		color: ConfiguredStyle.colors.black,
	},
	greyText: {
		fontSize: ConfiguredStyle.fonts.xsm,
		color: ConfiguredStyle.colors.grey.light,
	},
	border: {
		width: '100%',
		borderWidth: ConfiguredStyle.radius.border,
		paddingHorizontal: ConfiguredStyle.padding.md,
		paddingTop: ConfiguredStyle.size.xsm,
		borderColor: ConfiguredStyle.colors.grey.light,
		borderRadius: 12
	},
	iconColor: {
		color: ConfiguredStyle.colors.primary,
		fontSize: ConfiguredStyle.fonts.lg,
	},
	resizeStyle: {
		paddingHorizontal: 0,
		paddingVertical: 0
	},
	icon: {
		color: ConfiguredStyle.colors.primary,
		fontSize: ConfiguredStyle.size.s25
	},
	bigIcon: {
		color: ConfiguredStyle.colors.primary,
		fontSize: ConfiguredStyle.size.s35
	},
	fabButtonContainer: {
		position: 'absolute',
		bottom: 10,
		right: 10
	}
})

let that;

class Reminder extends Component {
	constructor(props) {
		super(props)
		this.state = {
			active: false,
		}
		this.toastRef = React.createRef();
	}

	toggleFab() {
		this.setState((prevState) => ({ ...prevState, active: !prevState.active }))
	}

	componentDidMount() {
		const { getReminder } = this.props
		that = this;
		getReminder();
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { deleteReminderSuccess, getReminder, clearFlags } = nextProps
		if (deleteReminderSuccess) {
			clearFlags()
			getReminder()
			that.toastRef.current.show('Reminder successfully deleted', 1000);
			return {};
		}
		return {};
	}

	handleBackButtonClick = () => {
		const { navigation } = this.props
		return navigation.goBack();
	}

	shareReminder = (item) => {
		Share.share({
			message: `Reminder Title: ${item && item.reminder && item.reminder.reminderName}, Created by ${item && item.reminder && item.reminder.creator && item.reminder.creator.userName}`,
		});
	}

	deleteReminderAPI = (item) => {
		const { deleteReminder } = this.props
		const input = {
			id: item.id,
		}
		deleteReminder(input)
	}

	renderItem = ({ item }) => {
		const { loginUserId, navigation } = this.props
		const { reminder } = item || {}
		const isOwnReminder = String(loginUserId) === String(item && item.reminder && item.reminder.creator && item.reminder.creator.id)
		return (
			<View style={[common.ph20]}>
				<SwipeRow
					style={[common.bottomWidth0, common.pb0, { paddingRight: 0 }]}
					leftOpenValue={50}
					rightOpenValue={-90}
					body={(
						<View style={pageStyle.border}>
							<View style={pageStyle.timePosition}>
								<Text style={[Typography.h10, common.greyColor]}>{moment(reminder && reminder.reminderDate).format('dddd, MMM DD YYYY')}</Text>
							</View>
							<View style={[common.flexDirectionRow, common.alignItemCenter, common.mv10]}>
								<WSIcon
									fontFamily={ConfiguredStyle.fontFamily.FAMedium}
									iconStyle={pageStyle.bigIcon}
									iconCode="&#xf2f2;"
								/>
								<View style={[common.ml20, common.flex1]}>
									<View style={[common.flexDirectionRow]}>
										<Text style={[Typography.buttonText, common.fBold]}>{reminder && reminder.reminderName}</Text>
									</View>
									<View style={[common.alignCenter, common.mt5]}>
										<Text style={pageStyle.greyText}>{(loginUserId === reminder && reminder.creator && reminder.creator.id) ? 'You' : reminder && reminder.creator && reminder.creator.userName} (CareID : {reminder && reminder.creator && reminder.creator.careId}) | {moment(reminder && reminder.reminderDate).format('LT')}</Text>
									</View>
								</View>
							</View>
						</View>
					)}
					right={(isOwnReminder &&
						<View
							style={[
								common.mt30,
								common.flexDirectionRow,
							]}
						>
							<WSIcon
								fontFamily={ConfiguredStyle.fontFamily.FABold}
								iconStyle={pageStyle.icon}
								iconCode="&#xf14b;"
								rippleColor={ConfiguredStyle.colors.rippleColorDark}
								onBtnPress={() => navigation.navigate('EditReminder', { reminderData: item.reminder })}
							/>
							<WSIcon
								fontFamily={ConfiguredStyle.fontFamily.FABold}
								iconStyle={[pageStyle.icon, common.colorMediumGrey]}
								iconCode="&#xf2ed;"
								rippleColor={ConfiguredStyle.colors.rippleColorDark}
								onBtnPress={() => this.deleteReminderAPI(item.reminder)}
							/>
						</View>
					)}
					left={(
						<View
							style={[
								common.mt30,
								common.flexDirectionRow,
							]}
						>
							<WSIcon
								fontFamily={ConfiguredStyle.fontFamily.FABold}
								iconStyle={pageStyle.icon}
								iconCode='&#xf1e1;'
								onBtnPress={() => this.shareReminder(item)}
								rippleColor={ConfiguredStyle.colors.rippleColorDark}
							/>
						</View>
					)}
				/>
			</View>
		)
	}

	_renderEmptyState = () => {
		return (
			<EmptyState message='No Reminder Found' image={images.avatar} margin={200} />
		)
	}


	render() {
		const { reminderData, loader, navigation } = this.props
		const { active } = this.state
		return (
			<View style={[common.flex1, { backgroundColor: 'white' }]}>
				<WSHeader
					name="Reminders"
					enableBack
					onLeftMethod={this.handleBackButtonClick}
				/>
				<FlatList
					data={reminderData}
					renderItem={this.renderItem}
					extraData={this.props}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item, index) => 'reminders_' + index}
					ListEmptyComponent={this._renderEmptyState}
				/>
				<View style={pageStyle.fabButtonContainer}>
					<WSImage
						image={images.addNewAnnouncement}
						height={ConfiguredStyle.size.s70}
						width={ConfiguredStyle.size.s70}
						resizeMode={'contain'}
						imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, borderRadius: 30 }}
						onPress={() => navigation.navigate('CreateReminders')}
					/>
				</View>
				<WSSnackBar
					ref={this.toastRef}
				/>
				{loader && <WSLoader />}
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		reminderData: state.reminder && state.reminder.reminderData,
		deleteReminderSuccess: state.reminder && state.reminder.deleteReminderSuccess,
		loader: state.reminder && state.reminder.getLoading,
		loginUserId: state.user && state.user.userData && state.user.userData.id,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getReminder: () => dispatch(getReminder()),
		deleteReminder: (value) => dispatch(deleteReminder(value)),
		clearFlags: () => dispatch(clearFlags()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Reminder)