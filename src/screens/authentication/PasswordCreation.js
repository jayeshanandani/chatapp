import React, { Component } from 'react'
import {
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
    BackHandler,
    Platform,
    ScrollView,
    Alert
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { StackActions, NavigationActions } from 'react-navigation'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import {
    createUserPassword,
    createUserPasswordSuccess,
    createUserPasswordFailure,
    createUserPasswordClear,
    addUser,
    signInSuccess,
    signInFailure,
    signInStart,
    signInClear,
    getUserInfo,
    allUser,
} from '@redux/user/actions'

import { getRooms } from '@redux/chat/actions'

import { createErrorMessageSelector } from '@helper/reduxSelector'

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
        color: ConfiguredStyle.colors.grey.light,
        marginVertical: ConfiguredStyle.margin.xsm,
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
        .required('New password is required')
        .min(8, 'Password at least 8 Characters'),
    newConfirmPassword: Yup.string()
        .required('Confirm password is required')
        .min(8, 'Password at least 8 Characters')
        .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.newPassword === value
        }),
})

class PasswordCreation extends Component {
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
        this.refs = React.createRef();
        this.reEnterPass = React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBack
        );
    }

    handleBack = () => {
        const { navigation } = this.props
        return Alert.alert(
            "Do you want to stop creating your account?",
            "If you stop now, you'll lose any progress you've made.",
            [
                {
                    text: 'Stop Creating Account',
                    onPress: () => navigation.navigate('SwiperScreen')
                },
                { text: 'Continue Creating Account', onPress: () => console.log('Ask me later pressed') },
            ],
            { cancelable: false },
        );
        // return navigation.goBack();
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

    onCreatePassword = async (val) => {
        const { signIn, signInStart, signInSuccess, signInFailure, signInClear, signInUserDetails, createUserPassword, createUserPasswordFailure, createUserPasswordSuccess, changePassword, addUser: userToStore, passwordError } = this.props
        const { password } = this.props.navigation.state.params
        const { newPassword, newConfirmPassword } = val;
        Keyboard.dismiss();
        if (newPassword === newConfirmPassword) {
            createUserPassword();
            try {
                const response = await changePassword({ user: signInUserDetails, old_password: password, new_password: newConfirmPassword });
                const input = {
                    userName: signInUserDetails.attributes['custom:full_name'],
                    careId: signInUserDetails.attributes['preferred_username'],
                    media: signInUserDetails.profile_image,
                    email: signInUserDetails.attributes['email'],
                }
                createUserPasswordSuccess(response);
                userToStore(input)
                // await signInClear();
                // signInStart();
                // try {
                //     const response = await signIn({ username: email.toLowerCase(), password });
                //     signInSuccess(response);
                // }
                // catch (e) {
                //     signInFailure(e)
                // }
            }
            catch (e) {
                this.refs.toast.show(passwordError, 1000);
                createUserPasswordFailure(e)
            }
        } else {
            this.refs.toast.show('Password must match', 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { passwordCreated, createUserPasswordClear, errorMessage, addUserSuccess } = nextProps;
        if (addUserSuccess && passwordCreated && !errorMessage) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'HomeStack' })],
            });
            nextProps.navigation.dispatch(resetAction);
            AsyncStorage.setItem('isLoggedIn', 'true');
            createUserPasswordClear();
            this.props.getUserInfo();
            // this.props.getRooms('');
            // this.props.allUser();
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
        const { toggleForConfirmPassword, toggleForPassword, validUpper, validLower, validDigit, validLength, newPassword, secureTextEntry, secureTextEntry1 } = this.state
        const hideShowValue = toggleForPassword ? 'Hide' : 'Show'
        const showShowValue = toggleForConfirmPassword ? 'Hide' : 'Show'
        const { isLoading, errorMessage, createUserPasswordClear, error, loading } = this.props
        if (error && errorMessage) {
            this.refs.toast.show(errorMessage, 1000);
            createUserPasswordClear();
        }
        return (
            <WithLoader spinner={isLoading || loading}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
                    <WSHeader
                        name='Password Creation'
                        enableBack
                        onLeftMethod={this.handleBack}
                    />
                    <WSWaterMark />
                    <Formik
                        initialValues={{ newPassword: '', newConfirmPassword: '' }}
                        validate={values => {
                            this.checkValidation(values.newPassword);
                            return {};
                        }}
                        validationSchema={passwordValidationSchema}
                        onSubmit={(values) => {
                            this.onCreatePassword(values)
                        }}
                    >
                        {({ handleChange, values, errors, touched, handleSubmit }) => (
                            <ScrollView contentContainerStyle={[common.flexGrow1]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                                <View style={[common.flex1, common.centerStart, common.ph20, common.mv35]}>
                                    <WSPageIcon icon='&#xf084;' />
                                    <WSGreyText description="Make sure it's over eight characters password that you can remember later. " />

                                    <View style={{ width: '100%' }}>
                                        <WSTextBox
                                            style={common.colorBlack}
                                            placeholderText='Enter password'
                                            secureTextEntry={secureTextEntry}
                                            changeText={handleChange('newPassword')}
                                            value={values.newPassword}
                                            returnKeyType={'next'}
                                            onSubmitEditing={() => this.reEnterPass.current.focus()}
                                        />
                                        <TouchableWithoutFeedback style={styles.hitSlopArea}>
                                            <Text style={styles.showHideButton} onPress={this.showPassword}>{hideShowValue}</Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <Text style={pageStyle.msgText}>Password must contain <Text style={validUpper ? pageStyle.highlightText : pageStyle.errorText}>one uppercase</Text>, <Text style={validLower ? pageStyle.highlightText : pageStyle.errorText}>one lowercase</Text>, <Text style={validDigit ? pageStyle.highlightText : pageStyle.errorText}>one digit</Text> and <Text style={validLength ? pageStyle.highlightText : pageStyle.errorText}>at least 8 characters</Text> long.</Text>
                                    {/* {errors.newPassword && touched.newPassword ? (
                                        <Text style={styles.errorMessage}>{errors.newPassword}</Text>
                                    ) : null} */}

                                    <View style={{ width: '100%' }}>
                                        <WSTextBox
                                            style={common.colorBlack}
                                            reference={this.reEnterPass}
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
                    <WSSnackBar
                        ref="toast"
                    />
                </KeyboardAvoidingView>
            </WithLoader>
        );
    }
}

const errorSelector = createErrorMessageSelector(['CREATE_USER_PASSWORD_FAILURE']);

const mapStateToProps = (state) => {
    return {
        isLoading: state.user.isLoading,
        isSignInSuccess: state.user.signInSuccess,
        loading: state.user.loading,
        signInUserDetails: state.user.signInUserDetails,
        passwordCreated: state.user.passwordCreated,
        addUserSuccess: state.user.addUserSuccess,
        errorMessage: errorSelector(state),
        error: state.user && state.user.error,
        signUpUserDetails: state.user.signUpUserDetails,
        passwordError: state.user.passwordError,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createUserPassword: () => dispatch(createUserPassword()),
        createUserPasswordSuccess: (value) => dispatch(createUserPasswordSuccess(value)),
        createUserPasswordFailure: (value) => dispatch(createUserPasswordFailure(value)),
        createUserPasswordClear: (value) => dispatch(createUserPasswordClear(value)),
        addUser: (value) => dispatch(addUser(value)),
        signInStart: () => dispatch(signInStart()),
        signInSuccess: (value) => dispatch(signInSuccess(value)),
        signInFailure: (value) => dispatch(signInFailure(value)),
        signInClear: () => dispatch(signInClear()),
        getUserInfo: () => dispatch(getUserInfo()),
        allUser: () => dispatch(allUser()),
        getRooms: (value) => dispatch(getRooms(value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(PasswordCreation))