import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	BackHandler,
	ScrollView,
	Alert
} from 'react-native'
import { connect } from 'react-redux'
import CodeInput from 'react-native-confirmation-code-input'
import Auth from '@aws-amplify/auth'

import { createLoadingSelector } from '@helper/reduxSelector'

import {
	checkVerificationCodeSuccess,
	checkVerificationCodeFailure,
	checkVerificationCodeClear,
	signInSuccess,
	signInFailure,
	signInStart,
	checkVerificationCodeStart,
	falseFlagsInUser,
	updateUserProfile,
	updateUserProfileClear,
	resetPasswordClear
} from '@redux/user/actions'

import enums from '@constants/Enum'

import WithLoader from '@hoc/WithLoader'

import WSHeader from '@components/WSHeader'
import WSWaterMark from '@components/WSWaterMark'
import WSPageIcon from '@components/WSPageIcon'
import WSGreyText from '@components/WSGreyText'
import WSButton from '@components/WSButton'
import WSSnackBar from '@components/WSSnackBar'

import ConfiguredStyle from '@constants/Variables'
import Typography from '@constants/Typography'

import common from '@styles/common'
import styles from '@styles/AppStyle'

class Verification extends Component {
	constructor(props) {
		super(props)
		this.state = {
			verificationCode: '',
			loader: false,
		};
		this.toastRef = React.createRef();
		this.count = 0
	}

	componentDidMount() {
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
	}

	handleBackButtonPressAndroid = () => {
		const { fromPage } = this.props.navigation.state.params;
		const { navigation } = this.props
		if (fromPage === 'forgotPassword' || fromPage === 'AddEmailAddress' || fromPage === 'AddPhoneNumber') {
			return navigation.goBack();
		}
		return Alert.alert(
			"Do you want to stop creating your account?",
			"If you stop now, you'll lose any progress you've made.",
			[
				{
					text: 'Stop Creating Account',
					onPress: () => navigation.navigate('SwiperScreen')
				},
				{ text: 'Continue Creating Account', onPress: () => { return true; } },
			],
			{ cancelable: false },
		);
	};

	checkVerificationCode = async () => {
		const { verificationCode } = this.state
		const {
			checkVerificationCodeClear,
			verifyCurrentUserAttributeSubmit,
			updateUserProfile,
			navigation
		} = this.props
		const { fromPage, username, userID, updatedEmail, updatedNumber } = this.props.navigation.state.params;
		if (!verificationCode) {
			return this.toastRef.current.show('Code cannot be empty', 2000);
		}
		if (fromPage === 'forgotPassword') {
			//code for forgot password
			checkVerificationCodeClear();
			navigation.navigate('ResetPassword', { email: username, userID, code: verificationCode });

		} else if (fromPage === 'AddEmailAddress') {
			//code for change email address
			try {
				this.setState({ loader: true })
				const response = await verifyCurrentUserAttributeSubmit({ attr: 'email', code: verificationCode });

				if (response === 'SUCCESS') {
					let data = {}
					if (updatedEmail !== '' || updatedEmail !== null || updatedEmail !== undefined) {
						data.email = updatedEmail.toLowerCase();
					}
					updateUserProfile(data);
				}
			} catch (e) {
				this.setState({ loader: false })
				this.toastRef.current.show(e.message, 2000);
			}

		} else if (fromPage === 'AddPhoneNumber') {
			//code for change phone number
			try {
				this.setState({ loader: true })
				const response = await verifyCurrentUserAttributeSubmit({ attr: 'phone_number', code: verificationCode });
				console.log("update profile from verification screen..............", response);
				
				if(response === 'SUCCESS'){
					let data = {}
					if(updatedNumber !== '' || updatedNumber !== null || updatedNumber !== undefined) {
							data.phoneNumber = updatedNumber.number;
							data.homeNumber = updatedNumber.homeNumber;
					}
					updateUserProfile(data);
				}
			} catch (e) {
				this.setState({ loader: false })
				this.toastRef.current.show(e.message, 2000);
			}
		} else {
			const {
				confirmSignUp,
				checkVerificationCodeStart,
				checkVerificationCodeSuccess,
				checkVerificationCodeFailure,
			} = this.props
			checkVerificationCodeStart();
			try {
				const response = await confirmSignUp({ verificationCode, username });
				checkVerificationCodeSuccess(response);
			}
			catch (e) {
				this.toastRef.current.show(e.message, 2000);
				checkVerificationCodeFailure(e);
			}
		}
	}

	async componentWillReceiveProps(nextProps) {
		const {
			error,
			checkVerificationCodeClear,
			codeError,
			codeVerified,
			isSuccessSignIn,
			signInSuccess,
			errorMessage,
			signInFailure,
			signInStart,
			signIn,
			falseFlagsInUser,
			userUpdateSuccess,
			resetPasswordClear
		} = nextProps;
		const { navigation, updateUserProfileClear } = this.props
		const { username, password, email, phoneNumber } = nextProps.navigation.state.params;
		if (codeVerified && !errorMessage && !isSuccessSignIn) {
			if (username && !this.count) {
				signInStart();
				this.count = this.count + 1
				try {
					const response = await signIn({ username, password });
					signInSuccess(response);
					navigation.navigate('Profile', { password, phoneNumber, email });
					checkVerificationCodeClear();
					falseFlagsInUser();
				}
				catch (e) {
					signInFailure(e)
				}
			}
			checkVerificationCodeClear()
		}
		if (userUpdateSuccess) {
			this.setState({ loader: false });
			updateUserProfileClear();
			navigation.state.params.onDone("SUCCESS");
			this.handleBackButtonPressAndroid();
		}
		if (codeError) {
			checkVerificationCodeClear();
		}
		if (error && error.message && error.message === "Invalid verification code provided, please try again.") {
			this.toastRef.current.show(error.message, 2000);
			resetPasswordClear();
		}
	}

	_onFulfill = (code) => {
		this.setState((prevState) => ({ ...prevState, verificationCode: code }))
	}

	resendCode = () => {
		const { navigation } = this.props
		const { username } = navigation.state.params;
		this.setState((prevState) => ({ ...prevState, loader: true }));
		Auth.resendSignUp(username).then(() => {
			this.setState((prevState) => ({ ...prevState, loader: false }));
			this.toastRef.current.show('code resent successfully', 1000);
		}).catch((e) => {
			this.setState((prevState) => ({ ...prevState, loader: false }));
			this.toastRef.current.show(e.message, 1000);
		});
	}

	componentWillUnmount() {
		const { checkVerificationCodeClear } = this.props
		checkVerificationCodeClear();
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
	}

	render() {
		const { loader } = this.state
		const { isLoading, loaderEmail } = this.props
		const { fromPage } = this.props.navigation.state.params
		return (
			<WithLoader spinner={isLoading || loader || loaderEmail}>
				<KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
					<WSHeader
						name='Verification'
						enableBack
						onLeftMethod={this.handleBackButtonPressAndroid}
					/>
					<WSWaterMark />
					<ScrollView contentContainerStyle={[common.flexGrow1, common.pt20]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
						<View style={[common.ph20, common.flex1, common.centerStart]}>
							<WSPageIcon fromPage='verification' />
							<WSGreyText description='Enter the 6-digit code sent to the email entered, for verification process' />
							<Text style={[Typography.h3, common.f12, common.colorPrimary, common.pt10]}>Code</Text>
							<View style={common.flexDirectionRow}>
								<CodeInput
									ref="codeInputRef1"
									keyboardType="numeric"
									className={'border-b'}
									space={5}
									codeLength={6}
									size={36}
									inputPosition='left'
									activeColor={ConfiguredStyle.colors.black}
									inactiveColor={ConfiguredStyle.colors.grey.light}
									onFulfill={(code) => this._onFulfill(code)}
								/>
							</View>
							{(fromPage !== 'forgotPassword' && fromPage !== 'AddEmailAddress') && <TouchableOpacity onPress={this.resendCode}>
								<Text style={[common.fBold, common.colorPrimary, common.f15, common.pv15]}>Resend code</Text>
							</TouchableOpacity>}
						</View>
						<View style={styles.bottomButton}>
							<WSButton
								onBtnPress={this.checkVerificationCode}
								name='Next'
							/>
						</View>
					</ScrollView>
					<WSSnackBar
						ref={this.toastRef}
					/>
				</KeyboardAvoidingView>
			</WithLoader>
		);
	}
}

const loadingSelector = createLoadingSelector(['CHECK_VERIFICATION_CODE', 'SIGN_IN']);

const mapStateToProps = (state) => {
	return {
		user: state.user.userData,
		codeError: state.user.codeError,
		error: state.user && state.user.error,
		isLoading: loadingSelector(state),
		isSuccessSignIn: state.user.signInSuccess,
		codeVerified: state.user && state.user.data === 'SUCCESS',
		errorMessage: state.user.errorMessage,
		userUpdateSuccess: state.user.userUpdateSuccess,
		loaderEmail: state.user.loading,
		error: state.user.flagError,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		checkVerificationCodeStart: () => dispatch(checkVerificationCodeStart()),
		checkVerificationCodeSuccess: (data) => dispatch(checkVerificationCodeSuccess(data)),
		checkVerificationCodeFailure: (e) => dispatch(checkVerificationCodeFailure(e)),
		checkVerificationCodeClear: () => dispatch(checkVerificationCodeClear()),
		signInStart: () => dispatch(signInStart()),
		signInSuccess: (value) => dispatch(signInSuccess(value)),
		signInFailure: (value) => dispatch(signInFailure(value)),
		falseFlagsInUser: () => dispatch(falseFlagsInUser()),
		updateUserProfile: value => dispatch(updateUserProfile(value)),
		updateUserProfileClear: () => dispatch(updateUserProfileClear()),
		resetPasswordClear: () => dispatch(resetPasswordClear()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(Verification))