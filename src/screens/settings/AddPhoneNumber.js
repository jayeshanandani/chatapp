import React, { Component } from 'react'
import {
    View,
    Platform,
    Text,
    StyleSheet,
    Keyboard,
    TextInput,
    BackHandler
} from 'react-native'
import uuid from 'uuid'
import { connect } from 'react-redux'
import CountryPicker from 'react-native-country-picker-modal'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import Auth from '@aws-amplify/auth'
import { Formik } from 'formik'
import * as Yup from 'yup'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import { isEmptyObj } from '@helper/GenericFunction'

import WithLoader from '@hoc/WithLoader'
import WithAuthenticator from '@hoc/WithAuthenticator'

import WSHeader from '@components/WSHeader'
import WSTextBox from '@components/WSTextBox'
import WSAlert from '@components/WSAlert'
import WSSnackBar from '@components/WSSnackBar'
import WSButton from '@components/WSButton'

import common from '@styles/common'

const PageStyle = StyleSheet.create({
    phoneText: {
        borderBottomWidth: ConfiguredStyle.size.s1,
        borderBottomColor: ConfiguredStyle.colors.grey.light,
        marginBottom: ConfiguredStyle.size.s1
    },
    countryPicker: {
        position: enums.ABSOLUTE,
        top: 27,
        left: -ConfiguredStyle.size.s10
    },
    pickerBorder: {
        paddingBottom: ConfiguredStyle.padding.xsm,
    },
    codeView: {
        marginHorizontal: ConfiguredStyle.margin.sm,
    },
    alertMessage: {
        padding: ConfiguredStyle.padding.sm,
        textAlign: enums.CENTER,
        color: ConfiguredStyle.colors.black,
    },
});

const numberValidationSchema = Yup.object().shape({
    number: Yup.number()
        .required('Required'),
    homeNumber: Yup.string().length(10, 'Home Number must be exactly 10 digits')
        .required('Required'),
})


var work = " ", home = " ";
var _phoneNumber = {}, _homeNumber = {};

class AddPhoneNumber extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cca2: 'CA',
            callingCode: '1',
            cca2Home: 'CA',
            callingCodeHome: '1',
            phoneNumber: '',
            username: uuid(),
            modalVisible: false,
            isLoading: false,
        }
        this.homeNumber = React.createRef();
    }

    componentDidMount() {
        const { user } = this.props
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );

        if (user && user.phoneNumber && user.phoneNumber !== '') {
            let newNumber = user.phoneNumber.replace("+1", "+001")
            _phoneNumber = parsePhoneNumberFromString(newNumber)

            if (!isEmptyObj(_phoneNumber)) {
                this.setState({ cca2: _phoneNumber.country, callingCode: _phoneNumber.countryCallingCode })
            }
        }
        if (user && user.homeNumber && user.homeNumber !== '') {
            let newHomeNumber = user.homeNumber.replace("+1", "+001")
            _homeNumber = parsePhoneNumberFromString(newHomeNumber)
            if (!isEmptyObj(_homeNumber)) {
                this.setState({ cca2Home: _homeNumber.country, callingCodeHome: _homeNumber.countryCallingCode })
            }
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
        return navigation.goBack();
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
    }

    resetNumber = async (val) => {
        const { callingCode, callingCodeHome } = this.state
        const { number, homeNumber } = val;
        const { updateAttributes, verifyCurrentUserAttribute } = this.props
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            let data = {
                user: currentUser,
                attributes: {}
            };
            if (number !== undefined || number !== null || number.trim() !== '') {
                data.attributes.phone_number = `+${callingCode}${number.trim()}`;
            }
            // if (homeNumber !== undefined || homeNumber !== null || homeNumber.trim() !== '') {
            //     data.attributes.home_number = `+${callingCodeHome}${homeNumber.trim()}`;
            // }
            const response = await updateAttributes(data);
            if (response === 'SUCCESS') {
                const verifyResponse = await verifyCurrentUserAttribute('phone_number');

                if (verifyResponse === undefined) {
                    this.setModalVisible(true);
                    this.setState({ isLoading: false });
                } else {
                    this.setState({ isLoading: false });
                }
            } else {
                this.setState({ isLoading: false });
            }
        }
        catch (e) {
            this.setState({ isLoading: false });
            this.refs.toast.show(e.message, 2000);
        }
    }

    render() {
        const { user, navigation } = this.props
        const {
            cca2,
            callingCode,
            cca2Home,
            callingCodeHome,
            modalVisible,
            isLoading
        } = this.state
        if (user && user.phoneNumber && user.phoneNumber !== '') {
            _phoneNumber = parsePhoneNumberFromString(user.phoneNumber)
            if (!isEmptyObj(_phoneNumber)) {
                work = _phoneNumber.nationalNumber
            }
        }
        if (user && user.homeNumber && user.homeNumber !== '') {
            _homeNumber = parsePhoneNumberFromString(user.homeNumber)
            if (!isEmptyObj(_homeNumber)) {
                home = _homeNumber.nationalNumber
            }
        }
        return (
            <WithLoader spinner={isLoading}>
                <View style={[common.flexGrow1, common.bgWhite]}>
                    <WSHeader
                        name='Phone number'
                        enableBack
                        onLeftMethod={this.handleBackButtonPressAndroid}
                    />
                    <Formik
                        initialValues={{
                            number: work,
                            homeNumber: home,
                        }}
                        validationSchema={numberValidationSchema}
                        onSubmit={(values) => {
                            Keyboard.dismiss();
                            this.setState({ isLoading: true })
                            this.resetNumber(values);
                        }}
                    >
                        {({
                            handleChange, handleSubmit, values, errors, touched,
                        }) => (
                                <>
                                    <View style={[common.mb40, common.ph20, common.pt10, common.flex1]}>
                                        <WSTextBox
                                            placeholderText='Work number'
                                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                                            maxLength={10}
                                            changeText={handleChange('number')}
                                            value={values.number}
                                            returnKeyType={'next'}
                                            disabled
                                            render={(props) => (
                                                <View style={[common.exactCenter, common.flexDirectionRow, common.ph10]}>
                                                    <View style={[common.exactCenter, common.flexDirectionRow, PageStyle.pickerBorder]}>
                                                        <CountryPicker
                                                            modalProps={{ visible: false }}
                                                            onSelect={value => {
                                                                if (value.callingCode[0]) {
                                                                    this.setState((prevState) => ({ phoneNumber: values.number.replace(`+${callingCode}`, '') }), () => {
                                                                        this.setState({ cca2: value.cca2, callingCode: value.callingCode[0] })
                                                                    })
                                                                } else {
                                                                    this.refs.toast.show('Calling code not available for this Country!', 2000);
                                                                }
                                                            }}
                                                            countryCode={cca2}
                                                            translation={'common'}
                                                            withAlphaFilter
                                                            withFilter
                                                            withEmoji
                                                            closeButtonImageStyle={{ height: ConfiguredStyle.fonts.f18, width: ConfiguredStyle.fonts.f18 }}
                                                        />

                                                        <Text style={[common.ph10, common.selfCenter, common.mt3, PageStyle.codeView]}>{callingCode !== '' ? `+${callingCode}` : 'none'}</Text>
                                                    </View>
                                                    <View style={common.flexGrow1}>
                                                        <TextInput
                                                            {...props}
                                                        />
                                                    </View>
                                                </View>
                                            )}
                                            onSubmitEditing={() => this.homeNumber.current.focus()}
                                        />
                                        {errors.number && touched.number ? (
                                            <Text style={{ color: 'red', }}>{errors.number}</Text>
                                        ) : null}
                                        <WSTextBox
                                            reference={this.homeNumber}
                                            placeholderText='Home number'
                                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                                            maxLength={11}
                                            changeText={handleChange('homeNumber')}
                                            value={values.homeNumber}
                                            render={(props) => (
                                                <View style={[common.exactCenter, common.flexDirectionRow, common.ph10]}>
                                                    <View style={[common.exactCenter, common.flexDirectionRow, PageStyle.pickerBorder]}>
                                                        <CountryPicker
                                                            onSelect={value => {
                                                                if (value.callingCode[0]) {
                                                                    this.setState((prevState) => ({ phoneNumber: values.number.replace(`+${callingCodeHome}`, '') }), () => {
                                                                        this.setState({ cca2Home: value.cca2, callingCodeHome: value.callingCode[0] })
                                                                    })
                                                                } else {
                                                                    this.refs.toast.show('Calling code not available for this Country!', 2000);
                                                                }
                                                            }}
                                                            countryCode={cca2Home}
                                                            translation={'common'}
                                                            withAlphaFilter
                                                            withFilter
                                                            withEmoji
                                                            closeButtonImageStyle={{ height: ConfiguredStyle.fonts.f18, width: ConfiguredStyle.fonts.f18 }}
                                                        />
                                                        <Text style={[common.ph10, common.selfCenter, common.mt3, PageStyle.codeView]}>{callingCodeHome !== '' ? `+${callingCodeHome}` : 'none'}</Text>
                                                    </View>
                                                    <View style={common.flexGrow1}>
                                                        <TextInput
                                                            {...props}
                                                        />
                                                    </View>
                                                </View>
                                            )}
                                            onSubmitEditing={() => this.homeNumber.current.focus()}
                                        />
                                        {errors.homeNumber && touched.homeNumber ? (
                                            <Text style={{ color: 'red', }}>{errors.homeNumber}</Text>
                                        ) : null}
                                        <WSAlert
                                            title="Verify your phone number"
                                            visibility={modalVisible}
                                            closeAction={() => this.setModalVisible(false)}
                                        >
                                            <Text style={PageStyle.alertMessage}>
                                                {"We have sent a confirmation code to "}
                                                <Text style={{ color: ConfiguredStyle.colors.primary }}>{callingCode} {values.number}</Text>
                                                {". Please verify it by clicking on the link in the message we've sent."}
                                            </Text>
                                            <WSButton
                                                name="Okay"
                                                onBtnPress={() => {
                                                    this.setModalVisible(false);
                                                    navigation.navigate('Verification', {
                                                        fromPage: 'AddPhoneNumber', updatedNumber: {
                                                            number: `+${callingCode}${values.number.trim()}`,
                                                            homeNumber: `+${callingCodeHome}${values.homeNumber.trim()}`,
                                                        }, onDone: status => {
                                                            if (status && status === 'SUCCESS') {
                                                                this.refs.toast.show('Phone number Updated successfully', 2000);
                                                            }
                                                        }
                                                    })
                                                }}
                                            />
                                        </WSAlert>
                                    </View>
                                    <View style={common.p20}>
                                        <WSButton
                                            onBtnPress={handleSubmit}
                                            name="Submit"
                                        />
                                    </View>
                                </>
                            )}
                    </Formik>
                    <WSSnackBar ref="toast" />
                </View>
            </WithLoader>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.userData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(AddPhoneNumber))