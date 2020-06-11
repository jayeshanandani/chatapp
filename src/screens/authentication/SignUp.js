import React, { Component } from 'react'
import {
	View,
	Text,
	Platform,
	KeyboardAvoidingView,
	StyleSheet,
	BackHandler,
	ScrollView,
	TextInput,
	Keyboard
} from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import { CheckBox } from 'native-base'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import { userSignUpStart, signUpSuccess, signUpFailure, signUpClear } from '@redux/user/actions'

import WithAuthenticator from '@hoc/WithAuthenticator'

import { createSuccessMessageSelector } from '@helper/reduxSelector';

import WSHeader from '@components/WSHeader'
import WSWaterMark from '@components/WSWaterMark'
import WSPageIcon from '@components/WSPageIcon'
import WSGreyText from '@components/WSGreyText'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSLoader from '@components/WSLoader'
import WSSnackBar from '@components/WSSnackBar'

import common from '@styles/common'
import styles from '@styles/AppStyle'

const validationSchema = Yup.object().shape({
	phoneNumber: Yup.string()
		.required('A phone number is required')
		.min(10),
});

const pageStyle = StyleSheet.create({
	codeView: {
		marginHorizontal: ConfiguredStyle.margin.sm,
	},
	pickerBorder: {
		paddingBottom: ConfiguredStyle.padding.xsm,
	},
	termsText: {
		fontSize: ConfiguredStyle.fonts.f13,
		fontFamily: ConfiguredStyle.fontFamily.FAMedium,
		color: ConfiguredStyle.colors.black,
	}
})

class SignUp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cca2: 'CA',
			callingCode: '1',
			agreeChecked: false,
			phoneNumber: '',
			username: '',
			loader: false,
		}
		this.emailRef = React.createRef();
	}

	componentDidMount() {
		BackHandler.addEventListener(
			'hardwareBackPress',
			this.handleBackButtonPressAndroid
		);
	}

	componentWillReceiveProps(nextProps) {
		const { navigation } = this.props
		const { phoneNumber, callingCode } = this.state
		const {
			isSuccess,
			signUpClear,
			errorMessage,
			flagError
		} = nextProps;
		if (isSuccess && !errorMessage) {
			navigation.navigate('Verification', {
				username: `${callingCode}${phoneNumber.trim()}`,
				password: `Hostalky@${phoneNumber.trim()}`,
				email: '',
				phoneNumber: `+${callingCode}${phoneNumber.trim()}`,
			})
			signUpClear();
		}
		if (flagError) {
			signUpClear();
			this.refs.toast.show(errorMessage, 1500);
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
		return navigation.pop();
	};

	toggleChecked = async () => {
		this.setState((prevState) => ({
			...prevState,
			agreeChecked: !prevState.agreeChecked
		}))
	}

	onSignUp = async (val) => {
		const { callingCode, agreeChecked } = this.state
		const { phoneNumber, email } = val;
		const { signUp, userSignUpStart, signUpSuccess, signUpFailure } = this.props
		if (!agreeChecked) {
			this.setState({ loader: false });
			this.refs.toast.show('Please accept Terms and Conditions', 1500);
			return false;
		}
		if (phoneNumber && agreeChecked) {
			const userSignUpData = {
				username: `${callingCode}${phoneNumber.trim()}`,
				password: `Hostalky@${phoneNumber.trim()}`,
				attributes: {
					phone_number: `+${callingCode}${phoneNumber.trim()}`,
				},
			}
			this.setState({
				phoneNumber
			})

			userSignUpStart();
			try {
				const response = await signUp(userSignUpData);
				response.email = email
				this.setState({ loader: false });
				signUpSuccess(response);
			}
			catch (e) {
				signUpFailure(e);
				this.setState({ loader: false });
			}
		}
	}

	render() {
		const { cca2, callingCode, agreeChecked, loader } = this.state
		const { isLoading } = this.props
		return (
			<KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
				<WSHeader
					name='Sign Up'
					enableBack
					onLeftMethod={this.handleBackButtonPressAndroid}
				/>
				<WSWaterMark />
				<Formik
					initialValues={{ phoneNumber: ' ', email: '' }}
					validationSchema={validationSchema}
					onSubmit={(values) => {
						Keyboard.dismiss();
						this.setState({ loader: true });
						this.onSignUp(values);
					}}
				>
					{({
						handleChange, handleSubmit, values, errors, touched,
					}) => (
							<ScrollView contentContainerStyle={[common.flexGrow1, common.pt20]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
								<View style={[common.ph20, common.flex1, common.centerStart]}>
									<WSPageIcon icon='&#xf095;' size={ConfiguredStyle.fonts.lg} />
									<WSGreyText description='We will send a 6-digit code to the number entered, for verification process' />
									<View style={[common.alignEnd, common.flexDirectionRow, common.pt10]}>
										<View style={common.flexGrow1}>
											<WSTextBox
												placeholderText='Phone number'
												keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
												maxLength={11}
												changeText={handleChange('phoneNumber')}
												value={values.phoneNumber}
												returnKeyType={'next'}
												render={(props) => (
													<View style={[common.exactCenter, common.flexDirectionRow, common.ph10]}>
														<View style={[common.exactCenter, common.flexDirectionRow, pageStyle.pickerBorder]}>
															<CountryPicker
																onSelect={value => {
																	if (value.callingCode[0]) {
																		this.setState((prevState) => ({ ...prevState, phoneNumber: values.phoneNumber.replace(`+${callingCode}`, '') }), () => {
																			this.setState((prevState) => ({ ...prevState, cca2: value.cca2, callingCode: value.callingCode[0] }))
																		})
																	} else {
																		this.refs.toast.show('Calling code not available for this Country!', 2000);
																	}
																}}
																countryCode={cca2}
																translation={'common'}
																// translation={'ita'}
																withAlphaFilter
																withFilter
																withEmoji
																closeButtonImageStyle={{ height: ConfiguredStyle.fonts.f18, width: ConfiguredStyle.fonts.f18 }}
															/>
															<Text style={[common.ph10, common.selfCenter, common.mt3, pageStyle.codeView]}>{callingCode !== '' ? `+${callingCode}` : 'none'}</Text>
														</View>
														<View style={common.flexGrow1}>
															<TextInput
																{...props}
															/>
														</View>
													</View>
												)}
												onSubmitEditing={() => this.emailRef.current.focus()}
											/>
										</View>
									</View>
									{errors.phoneNumber && touched.phoneNumber ? (
										<Text style={styles.errorMessage}>{errors.phoneNumber}</Text>
									) : null}
									{/* <View style={{ width: '100%' }}>
										<WSTextBox
											reference={this.emailRef}
											placeholderText='Email Address'
											nameText='emailAddress'
											returnKeyType={'done'}
											keyboardType={'email-address'}
											blurOnSubmit={true} inlineImageLeft='search_icon'
											changeText={handleChange('email')}
											text={values.email}
										/>
									</View>
									{errors.email && touched.email ? (
										<Text style={styles.errorMessage}>{errors.email}</Text>
									) : null} */}
									<View style={[common.flexDirectionRow, common.pv15, common.pb30, common.alignItemCenter]}>
										<CheckBox checked={agreeChecked} color={ConfiguredStyle.colors.primary} style={styles.checkBox} onPress={this.toggleChecked} />
										<Text style={[common.pl10, pageStyle.termsText, common.lineHeight25,]}>I agree to <Text style={common.colorPrimary}>Terms of Services</Text> & <Text style={common.colorPrimary}>Privacy Policy</Text></Text>
									</View>
								</View>
								{(isLoading || loader) && <WSLoader />}
								<View style={styles.bottomButton}>
									<WSButton
										onBtnPress={handleSubmit}
										name='Verify'
									/>
								</View>
							</ScrollView>
						)}
				</Formik>
				<WSSnackBar
					ref="toast"
				/>
			</KeyboardAvoidingView>
		);
	}
}

const successSelector = createSuccessMessageSelector(['SIGN_UP']);

const mapStateToProps = (state) => {
	return {
		flagError: state.user.flagError,
		isSuccess: successSelector(state),
		isLoading: state.user.signUploading,
		errorMessage: state.user.errorMessage,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		userSignUpStart: () => dispatch(userSignUpStart()),
		signUpSuccess: (value) => dispatch(signUpSuccess(value)),
		signUpFailure: (value) => dispatch(signUpFailure(value)),
		signUpClear: () => dispatch(signUpClear()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(SignUp))