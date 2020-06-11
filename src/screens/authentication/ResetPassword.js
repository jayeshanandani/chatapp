import React, { Component } from 'react'
import {
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
    ScrollView,
    Platform,
    BackHandler
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { StackActions, NavigationActions } from 'react-navigation'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import {
    resetPasswordSuccess,
    resetPasswordFailure,
    resetPassword,
    signInStart,
    signInSuccess,
    signInFailure,
    signInClear,
    getUserInfo,
    allUser,
} from '@redux/user/actions'

import { getRooms } from '@redux/chat/actions'

import WithAuthenticator from '@hoc/WithAuthenticator'
import WithLoader from '@hoc/WithLoader'

import WSPageIcon from '@components/WSPageIcon'
import WSGreyText from '@components/WSGreyText'
import WSHeader from '@components/WSHeader'
import WSWaterMark from '@components/WSWaterMark'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSSnackBar from '@components/WSSnackBar'

import styles from '@styles/AppStyle'
import common from '@styles/common'

const pageStyle = StyleSheet.create({
    button: {
        padding: ConfiguredStyle.padding.md,
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

const passwordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required('Password is required')
        .min(6, 'Password at least 6 Characters'),
    newConfirmPassword: Yup.string()
        .required('Confirm password is required')
        .min(6, 'Password at least 6 Characters')
        .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.newPassword === value
        }),
})

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secureTextEntry: true,
            secureTextEntry1: true,
            toggleForPassword: false,
            toggleForConfirmPassword: false,
            validUpper: false,
            validLower: false,
            validDigit: false,
            validLength: false,
            newPassword: '',
        }
        this.toastRef = React.createRef();
        this.reEnterPass = React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBack
        );
    }

    async componentWillReceiveProps(nextProps) {
        const {
            signInClear,
            isSignInSuccess,
            flagError,
            errorMessage,
        } = nextProps
        if (flagError) {
            this.toastRef.current.show(errorMessage, 2000);
            signInClear();
            setTimeout(() => {
                nextProps.navigation.navigate('LoginStack');
            }, 2000);
        }
        if (isSignInSuccess) {
            // signInClear();
            this.props.getUserInfo();
            this.props.getRooms('');
            this.props.allUser();
            await AsyncStorage.setItem('isLoggedIn', 'true');
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'HomeStack' })],
            });
            nextProps.navigation.dispatch(resetAction);
        }
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

    showPassword = () => {
        this.setState((prevState) => ({
            ...prevState,
            toggleForPassword: !prevState.toggleForPassword,
            secureTextEntry: !prevState.secureTextEntry
        }))
    }

    hidePassword = () => {
        this.setState((prevState) => ({
            ...prevState,
            toggleForConfirmPassword: !prevState.toggleForConfirmPassword,
            secureTextEntry1: !prevState.secureTextEntry1
        }))
    }

    resetPassword = async (val) => {
        const { newPassword, newConfirmPassword } = val;
        const {
            forgotPasswordSubmit,
            resetPassword,
            resetPasswordSuccess,
            resetPasswordFailure,
            signIn,
            signInStart,
            signInSuccess,
            signInFailure
        } = this.props
        const { email, userID, code } = this.props.navigation.state.params;
        const { navigation } = this.props
        Keyboard.dismiss();
        if (newPassword === newConfirmPassword) {
            resetPassword();
            // signInStart();
            try {
                const response = await forgotPasswordSubmit({ username: userID, code, password: newPassword });
                resetPasswordSuccess(response);
                this.toastRef.current.show('Your password has been changed successfully.', 2000);
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 2000);
                // const signInData = await signIn({ username: email.toLowerCase(), password: newPassword });
                // signInSuccess(signInData);
            }
            catch (e) {
                this.toastRef.current.show(e.message, 2000);
                resetPasswordFailure(e);
                navigation.goBack();
                // signInFailure(e);
            }
        } else {
            this.toastRef.current.show('Password must match', 1000);
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
        const {
            toggleForConfirmPassword,
            toggleForPassword,
            validUpper,
            validLower,
            validDigit,
            validLength,
            newPassword,
            secureTextEntry1,
            secureTextEntry
        } = this.state
        const hideShowValue = toggleForPassword ? 'Hide' : 'Show'
        const showShowValue = toggleForConfirmPassword ? 'Hide' : 'Show'
        const { isLoading } = this.props
        return (
            <WithLoader spinner={isLoading}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
                    <WSHeader
                        name='Reset Password'
                        enableBack
                        onLeftMethod={this.handleBack}
                    />
                    <WSWaterMark />
                    <Formik
                        initialValues={{ newPassword: '', newConfirmPassword: '' }}
                        // validate={values => {
                        // 	values.newPassword = newPassword;
                        // 	return {};
                        // }}
                        validationSchema={passwordValidationSchema}
                        onSubmit={(values) => this.resetPassword(values)}
                    >
                        {({ handleChange, values, errors, touched, handleSubmit }) => (
                            <ScrollView contentContainerStyle={[common.flexGrow1, common.pt20]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                                <View style={[common.flex1, common.centerStart, common.ph20]}>
                                    <WSPageIcon icon='&#xf084;' />
                                    <WSGreyText description="Make sure it's over eight characters password that you can remember later. " />
                                    <View style={{ width: '100%' }}>
                                        <WSTextBox
                                            style={common.colorBlack}
                                            placeholderText='Enter password'
                                            secureTextEntry={secureTextEntry}
                                            changeText={handleChange('newPassword')}
                                            // changeText={(password) =>  this.checkValidation(password)}
                                            value={values.newPassword}
                                            returnKeyType={'next'}
                                            onSubmitEditing={() => this.reEnterPass.current.focus()}
                                        />
                                        <TouchableWithoutFeedback style={styles.hitSlopArea}>
                                            <Text style={styles.showHideButton} onPress={this.showPassword}>{hideShowValue}</Text>
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
                                            placeholderText='Re-enter password'
                                            secureTextEntry={secureTextEntry1}
                                            changeText={handleChange('newConfirmPassword')}
                                            value={values.newConfirmPassword}
                                        />
                                        <TouchableWithoutFeedback style={styles.hitSlopArea}>
                                            <Text style={styles.showHideButton} onPress={this.hidePassword}>{showShowValue}</Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    {errors.newConfirmPassword && touched.newConfirmPassword ? (
                                        <Text style={styles.errorMessage}>{errors.newConfirmPassword}</Text>
                                    ) : null}
                                </View>
                                <WSSnackBar ref={this.toastRef} />
                                <View style={pageStyle.button}>
                                    <WSButton
                                        name='Done'
                                        onBtnPress={handleSubmit}
                                        height={ConfiguredStyle.size.s40}
                                    />
                                </View>
                            </ScrollView>
                        )}
                    </Formik>
                </KeyboardAvoidingView>
            </WithLoader>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.user.loading,
        resetPasswordData: state.user.resetPasswordData,
        flagError: state.user.flagError,
        isSignInSuccess: state.user.signInSuccess,
        signInUserDetails: state.user.signInUserDetails,
        errorMessage: state.user && state.user.error && state.user.error.message,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetPassword: () => dispatch(resetPassword()),
        resetPasswordSuccess: (value) => dispatch(resetPasswordSuccess(value)),
        resetPasswordFailure: (value) => dispatch(resetPasswordFailure(value)),
        signInStart: () => dispatch(signInStart()),
        signInSuccess: (value) => dispatch(signInSuccess(value)),
        signInFailure: (value) => dispatch(signInFailure(value)),
        signInClear: () => dispatch(signInClear()),
        getUserInfo: () => dispatch(getUserInfo()),
        allUser: () => dispatch(allUser()),
        getRooms: (value) => dispatch(getRooms(value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(ResetPassword))