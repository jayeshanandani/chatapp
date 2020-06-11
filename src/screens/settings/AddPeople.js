import React, { PureComponent } from 'react'
import { Thumbnail } from 'native-base'
import {
	View,
	Text,
	TouchableWithoutFeedback,
	StyleSheet,
	FlatList,
	BackHandler,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import ConfiguredStyle from '@constants/Variables'
import Typography from '@constants/Typography'
import images from '@constants/Image'
import enums from '@constants/Enum'

import WSHeader from '@components/WSHeader'
import WSButton from '@components/WSButton'
import WSTouchable from '@components/WSTouchable'
import WSSnackBar from '@components/WSSnackBar'
import WSImage from '@components/WSImage'
import EmptyState from '@components/EmptyState'

import common from '@styles/common'
import styles from '@styles/AppStyle'

const pageStyle = StyleSheet.create({
	iconStyle: {
		position: enums.ABSOLUTE,
		bottom: 5,
		right: 5,
	},
	icon: {
		color: ConfiguredStyle.colors.white,
		fontSize: ConfiguredStyle.fonts.xsm,
	},
	disableText: {
		fontSize: ConfiguredStyle.fonts.sm,
		fontWeight: enums.BOLD,
		color: ConfiguredStyle.colors.grey.light,
	}
})
class AddPeople extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			users: [],
			isLoading: false,
			selectAll: false,
			selectedUser: [],
		}
		this.toastRef = React.createRef();
	}

	componentDidMount() {
		const { passSelectedData } = this.props.navigation.state.params;
		this.setState({ selectedUser: passSelectedData || [] });
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
	  return this.props.navigation.goBack();
	};

	sendSelectedData = () => {
		const { selectedUser } = this.state
		const { users, navigation, componentId } = this.props
		if (!selectedUser.length) {
			this.toastRef.current.show('At least 1 contact must be selected', 1000);
		} else {
			const selectedUsers = [...selectedUser]
			const unionArray = _.union(selectedUsers)
			navigation.state.params.onPassProp(unionArray);
			navigation.goBack(componentId);
		}
	}

	addUserInGroup = addUser => {
		const { selectedUser } = this.state
		this.setState({
			selectedUser: selectedUser.concat([addUser])
		})
	}

	removeUserFromGroup = user => {
		const { selectedUser } = this.state
		this.setState({
			selectedUser: selectedUser.filter((item) => user && item && (item.id !== user.id))
		})
	}

	renderSelectedUserList = ({ item, index }) => {
		return (
			<TouchableWithoutFeedback onPress={() => this.removeUserFromGroup(item)}>
				<View style={[common.mr5, common.mv20]}>
					<Thumbnail source={item && item.media && item.media.small ? { uri: item.media.small } : images.avatar} style={common.mr10} />
					<View style={[common.exactCenter, pageStyle.iconStyle]}>
						<WSImage
							image={images.cancelGroupUsers}
							height={ConfiguredStyle.size.s15}
							width={ConfiguredStyle.size.s15}
							resizeMode={'contain'}
							imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, borderRadius: 20 }}
							onPress={() => this.removeUserFromGroup(item)}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	disableList = (item) => {
		const { selectedUser } = this.state
		const disableState = _.findIndex(selectedUser, (user) => item && user && (user.id === item.id));
		if (disableState !== -1) {
			return true
		} else {
			return false
		}
	}

	renderUsersList = ({ item }) => {
		return (
			<WSTouchable onPress={() => this.addUserInGroup(item)} disabled={this.disableList(item)} rippleColor={ConfiguredStyle.colors.rippleColorDark} >
				<View style={[common.ph20, common.flex1, common.flexDirectionRow, common.alignItemCenter, common.pv10]}>
					<View style={[common.flex1, common.flexDirectionRow]}>
						<Thumbnail small source={(item && item.media && item.media.small) ? { uri: item.media.small } : images.avatar} style={common.ml10} />
						<View>
							<Text style={[(this.disableList(item)) ? pageStyle.disableText : Typography.PrimaryH1, common.pl10]}>{item && _.upperFirst(item && item.userName)}</Text>
							<Text style={[Typography.h2, common.pl10, common.fBold]}>{item && item.careId}</Text>
						</View>
					</View>
				</View>
			</WSTouchable>
		)
	}

	_renderEmptyState = () => {
		return (
			<EmptyState message='Member not available' image={images.avatar} margin={80} />
		)
	}

	render() {
		const { selectedUser } = this.state
		const { componentId, users } = this.props
		const { navigation } = this.props
		return (
			<View style={[common.flex1, common.bgWhite]}>
				<WSHeader
					name="Add People"
					middleIcon={images.search}
					rightIconSize={{ fontSize: ConfiguredStyle.fonts.f18 }}
					enableBack
					onLeftMethod={() => navigation.goBack(componentId)}
				/>
				{(selectedUser.length !== 0) && (
					<View>
						<FlatList
							showsHorizontalScrollIndicator={false}
							data={selectedUser}
							extraData={this.state}
							keyExtractor={(item, index) => 'selectedUser_' + index}
							horizontal
							contentContainerStyle={[common.ph20, { alignItems: 'center', justifyContent: 'flex-start' }]}
							renderItem={this.renderSelectedUserList}
						/>

						<View style={[styles.borderBottom, common.mh20]} />
					</View>
				)}
				<FlatList
					showsVerticalScrollIndicator={false}
					data={users}
					extraData={this.state}
					keyExtractor={(item, index) => 'addPeople_' + index}
					renderItem={this.renderUsersList}
					ListEmptyComponent={this._renderEmptyState}
				/>
				<WSSnackBar ref={this.toastRef} />
				{users && users.length !== 0 && (
					<View style={[common.pv15, common.ph20]}>
						<WSButton
							onBtnPress={this.sendSelectedData}
							name="Next"
							style={{ borderRadius: 50 }}
						/>
					</View>
				)}
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	users: state.user.allUserData
});

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(AddPeople)