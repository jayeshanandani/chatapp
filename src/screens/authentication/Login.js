import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    BackHandler,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import AsyncStorage from '@react-native-community/async-storage'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'
import images from '@constants/Image'

import {
    getRooms
} from '@redux/chat/actions'

import {
    signInClear,
    signInStart,
    signInSuccess,
    signInFailure,
    getUserInfo,
    allUser,
} from '@redux/user/actions'

import WithLoader from '@hoc/WithLoader'
import WithAuthenticator from '@hoc/WithAuthenticator'

import { createSuccessMessageSelector } from '@helper/reduxSelector'

import WSHeader from '@components/WSHeader'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSSnackBar from '@components/WSSnackBar'

import styles from '@styles/AppStyle'
import common from '@styles/common'

let ws = null;

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Email is Required'),
    password: Yup.string()
        .required('Password is required'),
});

const pageStyle = StyleSheet.create({
    button: {
        padding: ConfiguredStyle.padding.md,
    },
    signUpText: {
        fontSize: ConfiguredStyle.fonts.f13,
        fontFamily: ConfiguredStyle.fontFamily.FAMedium,
        color: ConfiguredStyle.colors.black,
    }
})

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secureTextEntry: true,
            toggle: false,
            fromSignOut: 'false',
        }
        this.toastRef = React.createRef();
    }

    showPassword = () => {
        this.setState((prevState) => ({
            ...prevState,
            toggle: !prevState.toggle,
            secureTextEntry: !prevState.secureTextEntry,
        }));
    }

    login = async (val) => {
        const {
            signIn,
            signInStart,
            signInSuccess,
            signInFailure
        } = this.props
        const { username, password } = val;
        Keyboard.dismiss();
        signInStart();
        try {
            const response = await signIn({ username: username.toLowerCase(), password });

            signInSuccess(response);
            const token = await AsyncStorage.getItem('token');
            if (token) {
                this.props.getUserInfo();
                // this.props.getRooms('');
                this.props.allUser();
            }
        }
        catch (e) {
            signInFailure(e);
        }
    }

    componentDidMount() {
        const { signInClear, navigation } = this.props
        // signInClear();
        this.WillFocusListener = navigation.addListener('willFocus', this.handleStates);
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    async componentWillReceiveProps(nextProps) {
        const { isSignInSuccess, flagError, errorMessage, page, loginUserId } = nextProps;
        const { signInClear } = this.props
        if (flagError) {
            this.toastRef.current.show(errorMessage, 1000);
            signInClear();
        }
        if (isSignInSuccess && page && loginUserId) {
            // signInClear();
            await AsyncStorage.setItem('isLoggedIn', 'true');
            nextProps.navigation.navigate('TabNavigator')
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
        const { fromSignOut } = this.state
        if (fromSignOut == 'false') {
            return navigation.goBack();
        }
        return true;
    };

    handleStates = async () => {
        const fromSignOut = await AsyncStorage.getItem('fromSignOut');
        this.setState({ fromSignOut })
    }

    handleNavigation = (screen) => {
        const { navigation } = this.props
        navigation.navigate(screen)
    }

    render() {
        const { toggle, fromSignOut, secureTextEntry } = this.state
        const hideShowValue = toggle ? "Hide" : "Show";
        const { isLoading, navigation } = this.props
        return (
            <WithLoader spinner={isLoading}>
                <View style={[common.flex1, { backgroundColor: 'white' }]}>
                    {fromSignOut == 'true' ? (<WSHeader
                        name='Login'
                    />) : (<WSHeader
                        name='Login'
                        enableBack
                        onLeftMethod={() => navigation.pop()}
                    />)}
                    {/* <WSWaterMark /> */}
                    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={common.flex1}>
                        <Formik
                            initialValues={{ username: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => this.login(values)}
                        >
                            {({
                                handleChange, handleSubmit, values, errors, touched,
                            }) => (
                                    <ScrollView contentContainerStyle={[common.flexGrow1, common.pt20]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                                        <Image
                                            source={images.logo_splash}
                                            resizeMode={'contain'}
                                            style={{
                                                height: 150,
                                                width: 150,
                                                tintColor: ConfiguredStyle.colors.primary
                                            }}
                                        />
                                        <View style={[common.ph20, common.flex1]}>
                                            <View style={{ width: '100%' }}>
                                                <WSTextBox
                                                    style={[common.colorBlack, { width: '100%' }]}
                                                    textStyle={values.username ? 'normal' : 'normal'}
                                                    placeholderText='Email, phone or CareID'
                                                    nameText='emailAddress'
                                                    returnKeyType={'next'}
                                                    onSubmitEditing={() => { this.password.focus(); }}
                                                    changeText={handleChange('username')}
                                                    value={values.username}
                                                />
                                            </View>
                                            {errors.username && touched.username ? (
                                                <Text style={styles.errorMessage}>{errors.username}</Text>
                                            ) : null}
                                            <View style={{ width: '100%' }}>
                                                <WSTextBox
                                                    style={common.colorBlack}
                                                    textStyle={values.password ? 'normal' : 'normal'}
                                                    placeholderText='Password'
                                                    nameText='password'
                                                    returnKeyType={'done'}
                                                    reference={(input) => { this.password = input; }}
                                                    blurOnSubmit
                                                    secureTextEntry={secureTextEntry}
                                                    changeText={handleChange('password')}
                                                    value={values.password}
                                                />
                                                <TouchableWithoutFeedback style={styles.hitSlopArea} style={{ alignSelf: 'flex-end' }}>
                                                    <Text style={styles.showHideButton} onPress={this.showPassword}>{hideShowValue}</Text>
                                                </TouchableWithoutFeedback>
                                            </View>
                                            {errors.password && touched.password ? (
                                                <Text style={styles.errorMessage}>{errors.password}</Text>
                                            ) : null}
                                            <TouchableWithoutFeedback hitSlop={styles.hitSlopArea} onPress={() => this.handleNavigation('ForgotPassword')}>
                                                <Text style={[common.colorPrimary, common.f12, common.fBold, common.pt10]}>Forget Password ? </Text>
                                            </TouchableWithoutFeedback>
                                        </View>
                                        <View style={pageStyle.button}>
                                            <WSButton
                                                onBtnPress={handleSubmit}
                                                name='Login'
                                            />
                                        </View>
                                        {
                                            fromSignOut == 'true' &&
                                            <View style={[common.exactCenter, common.mb15]}>
                                                <Text style={[common.lineHeight25, pageStyle.signUpText]}>Don't have an account? <Text style={[common.colorPrimary, common.fBold]} onPress={() => this.handleNavigation('SignUp')}>Sign Up</Text></Text>
                                            </View>
                                        }
                                    </ScrollView>
                                )}
                        </Formik>
                    </KeyboardAvoidingView>
                    <WSSnackBar ref={this.toastRef} />
                </View>
            </WithLoader>
        );
    }
}

const successSelector = createSuccessMessageSelector(['SIGN_IN']);

const mapStateToProps = (state) => {
    return {
        flagError: state.user.flagError,
        isLoading: state.user.loading,
        isSignInSuccess: successSelector(state),
        loginUserId: state.user && state.user.userData && state.user.userData.id,
        errorMessage: state.user && state.user.error && state.user.error.message,
        page: state.user.page,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signInClear: () => dispatch(signInClear()),
        signInStart: () => dispatch(signInStart()),
        signInSuccess: (value) => dispatch(signInSuccess(value, 'login')),
        signInFailure: (value) => dispatch(signInFailure(value)),
        getUserInfo: () => dispatch(getUserInfo()),
        allUser: () => dispatch(allUser()),
        getRooms: (value) => dispatch(getRooms(value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(Login))