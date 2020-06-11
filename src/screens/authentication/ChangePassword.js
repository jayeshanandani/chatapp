import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	StyleSheet,
	Keyboard,
	Platform,
	ScrollView,
	BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as yup from 'yup'

import Auth from '@aws-amplify/auth'

import ConfiguredStyle from '@constants/Variables'

import {
	createUserPassword,
	createUserPasswordSuccess,
	createUserPasswordFailure,
	createUserPasswordClear
} from '@redux/user/actions';

import WithAuthenticator from '@hoc/WithAuthenticator'
import WithLoader from '@hoc/WithLoader'

import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '@helper/reduxSelector'

import WSHeader from '@components/WSHeader'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSSnackBar from '@components/WSSnackBar'

import styles from '@styles/AppStyle'
import common from '@styles/common'

const pageStyle = StyleSheet.create({
	button: {
		padding: ConfiguredStyle.padding.md
	},
	msgText: {
		fontSize: ConfiguredStyle.fonts.xsm,
		color: ConfiguredStyle.colors.grey.light
	},
	highlightText: {
		fontWeight: 'bold',
		color: ConfiguredStyle.colors.grey.light
	},
	errorText: {
		fontWeight: 'bold',
		color: ConfiguredStyle.colors.red,
	}
})

const passwordValidationSchema = yup.object().shape({
	newPassword: yup.string()
		.required('required')
		.label('New password')
		.min(8, 'Password at least 8 characters long'),
	currentPassword: yup.string()
		.required('required')
		.label('Current password'),
	confirmPassword: yup.string()
		.required('required')
		.label('Confirm password')
		.min(8, 'Password at least 8 characters long')
		.test('passwords-match', 'Passwords must match', function (value) {
			return this.parent.newPassword === value
		}),
})

class ChangePassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle: false,
			toggleNewPassword: false,
			toggleReNewPassword: false,
			secureTextEntry: true,
			secureTextEntryNew: true,
			secureTextEntryReNew: true,
			validUpper: false,
			validLower: false,
			validDigit: false,
			validLength: false,
			newPassword: '',
		}
		this.refs = React.createRef();
		this.newPass = React.createRef();
		this.reEnterPass = React.createRef();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBack
		);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBack
		);
	}

	handleBack = () => {
		const { navigation } = this.props
		return navigation.goBack();
	};

	showPassword = () => {
		this.setState((prevState) => ({
			...prevState,
			toggle: !prevState.toggle,
			secureTextEntry: !prevState.secureTextEntry,
		}));
	}

	newPassword = () => {
		this.setState((prevState) => ({
			...prevState,
			toggleNewPassword: !prevState.toggleNewPassword,
			secureTextEntryNew: !prevState.secureTextEntryNew,
		}))
	}

	reNewPassword = () => {
		this.setState((prevState) => ({
			...prevState,
			toggleReNewPassword: !prevState.toggleReNewPassword,
			secureTextEntryReNew: !prevState.secureTextEntryReNew,
		}));
	}

	onChangePassword = async (val) => {
		const {
			signInUserDetails,
			createUserPassword,
			createUserPasswordFailure,
			createUserPasswordSuccess,
			changePassword,
			signIn,
		} = this.props
		const { newPassword, confirmPassword, currentPassword } = val;
		Keyboard.dismiss();
		if (newPassword === confirmPassword) {
			createUserPassword();
			try {
				const signInUser = await Auth.currentAuthenticatedUser();
				const response = await changePassword({ user: signInUser, old_password: currentPassword, new_password: confirmPassword });
				createUserPasswordSuccess(response);
				this.handleBack()
			}
			catch (e) {
				createUserPasswordFailure(e)
				if (e.message == "Incorrect username or password.") {
					this.refs.toast.show("Incorrect current password.", 2000);
				} else {
					this.refs.toast.show(e.message, 2000);
				}
			}
		} else {
			this.refs.toast.show('Password Mismatch', 2000);
		}
	}

	checkValidation(password) {
		const upperCasePatten = /(?=.*[A-Z])/;
		const lowerCasePatten = /(?=.*[a-z])/;
		const digitCasePatten = /(?=.*[0-9])/;
		const lengthPatten = /(?=.{8,})/;
		this.setState({ newPassword: password });

		if (upperCasePatten.test(password)) {
			this.setState({ validUpper: true })
		} else {
			this.setState({ validUpper: false })
		}

		if (lowerCasePatten.test(password)) {
			this.setState({ validLower: true })
		} else {
			this.setState({ validLower: false })
		}

		if (digitCasePatten.test(password)) {
			this.setState({ validDigit: true })
		} else {
			this.setState({ validDigit: false })
		}

		if (lengthPatten.test(password)) {
			this.setState({ validLength: true })
		} else {
			this.setState({ validLength: false })
		}
	}

	render() {
		const { toggle, toggleReNewPassword, toggleNewPassword, validUpper, validLower, validDigit, validLength, newPassword, secureTextEntry, secureTextEntryNew, secureTextEntryReNew } = this.state
		const hideShowValueCurrent = toggle ? 'Hide' : 'Show';
		const hideShowValueNew = toggleNewPassword ? 'Hide' : 'Show';
		const hideShowValueReEnter = toggleReNewPassword ? 'Hide' : 'Show';
		const { isLoading, errorMessage, createUserPasswordClear, signInUserDetails } = this.props
		if (errorMessage) {
			this.refs.toast.show(errorMessage, 2000);
			createUserPasswordClear();
		}
		return (
			<WithLoader spinner={isLoading}>
				<KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, common.bgWhite]}>
					<WSHeader
						name='Change Password'
						enableBack
						onLeftMethod={this.handleBack}
					/>
					<Formik
						initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
						onSubmit={(values) => {
							this.onChangePassword(values)
						}}
						// validate={values => {
						// 	values.newPassword = newPassword;
						// 	return {};
						// }}
						validationSchema={passwordValidationSchema}
					>
						{({ handleChange, handleSubmit, values, errors, touched }) => (
							<ScrollView contentContainerStyle={common.flexGrow1} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
								<View style={[common.flex1, common.ph20, common.pt10]}>
									<View style={{ width: '100%' }}>
										<WSTextBox
											style={common.colorBlack}
											placeholderText='Current password'
											returnKeyType={'done'}
											blurOnSubmit={true}
											secureTextEntry={secureTextEntry}
											changeText={handleChange('currentPassword')}
											value={values.currentPassword}
											returnKeyType={'next'}
											onSubmitEditing={() => this.newPass.current.focus()}
										/>
										<TouchableWithoutFeedback onPress={this.showPassword}>
											<Text style={styles.showHideButton}>{hideShowValueCurrent}</Text>
										</TouchableWithoutFeedback>
									</View>
									{errors.currentPassword && touched.currentPassword ? (
										<Text style={styles.errorMessage}>{errors.currentPassword}</Text>
									) : null}
									<View style={{ width: '100%' }}>
										<WSTextBox
											reference={this.newPass}
											style={common.colorBlack}
											placeholderText='New password'
											nameText='password'
											returnKeyType={'done'}
											blurOnSubmit={true}
											secureTextEntry={secureTextEntryNew}
											changeText={handleChange('newPassword')}
											// changeText={(password) =>  this.checkValidation(password)}
											value={values.newPassword}
											returnKeyType={'next'}
											onSubmitEditing={() => this.reEnterPass.current.focus()}
										/>
										<TouchableWithoutFeedback onPress={this.newPassword}>
											<Text style={styles.showHideButton} >{hideShowValueNew}</Text>
										</TouchableWithoutFeedback>
									</View>
									{/* <Text style={pageStyle.msgText}>Password must contain <Text style={validUpper ? pageStyle.highlightText : pageStyle.errorText}>one uppercase</Text>, <Text style={validLower ? pageStyle.highlightText : pageStyle.errorText}>one lowercase</Text>, <Text style={validDigit ? pageStyle.highlightText : pageStyle.errorText}>one digit</Text> and <Text style={validLength ? pageStyle.highlightText : pageStyle.errorText}>at least 8 characters</Text> long.</Text> */}
									{errors.newPassword && touched.newPassword ? (
										<Text style={styles.errorMessage}>{errors.newPassword}</Text>
									) : null}
									<View style={{ width: '100%' }}>
										<WSTextBox
											reference={this.reEnterPass}
											style={common.colorBlack}
											placeholderText='Confirm password'
											nameText='password'
											returnKeyType={'done'}
											blurOnSubmit={true}
											secureTextEntry={secureTextEntryReNew}
											changeText={handleChange('confirmPassword')}
											value={values.confirmPassword}
										/>
										<TouchableWithoutFeedback onPress={this.reNewPassword}>
											<Text style={styles.showHideButton} >{hideShowValueReEnter}</Text>
										</TouchableWithoutFeedback>
									</View>
									{errors.confirmPassword && touched.confirmPassword ? (
										<Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
									) : null}
									<View style={common.height30}></View>
								</View>
								<View style={pageStyle.button}>
									<WSButton
										name="Done"
										onBtnPress={handleSubmit}
										height={ConfiguredStyle.size.s40}
									/>
								</View>
							</ScrollView>
						)}
					</Formik>
				</KeyboardAvoidingView>
				<WSSnackBar
					ref='toast'
				/>
			</WithLoader>
		);
	}
}

const loadingSelector = createLoadingSelector(['CREATE_USER_PASSWORD']);
const errorSelector = createErrorMessageSelector(['CREATE_USER_PASSWORD_FAILURE']);
const successSelector = createSuccessMessageSelector(['CREATE_USER_PASSWORD_SUCCESS']);

const mapStateToProps = (state) => {
	return {
		isLoading: loadingSelector(state),
		signInUserDetails: state.user.userData,
		passwordCreated: successSelector(state),
		errorMessage: errorSelector(state),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		createUserPassword: () => dispatch(createUserPassword()),
		createUserPasswordSuccess: (value) => dispatch(createUserPasswordSuccess(value)),
		createUserPasswordFailure: (value) => dispatch(createUserPasswordFailure(value)),
		createUserPasswordClear: (value) => dispatch(createUserPasswordClear(value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(ChangePassword))