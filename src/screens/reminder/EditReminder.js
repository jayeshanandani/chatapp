import React, { Component } from 'react'
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    StyleSheet,
    Platform,
    BackHandler,
    Keyboard
} from 'react-native'
import { Right, Switch } from 'native-base'
// import PushNotification from 'react-native-push-notification'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import _ from 'lodash'
import moment from 'moment'

import ConfiguredStyle from '@constants/Variables'

import { updateReminder, getReminder, clearFlags } from '@redux/reminder/actions'

import AddParticipant from '@container/AddParticipant'

import WSHeader from '@components/WSHeader'
import WSStrip from '@components/WSStrip'
import WSTextBox from '@components/WSTextBox'
import WSDateTimePicker from '@components/WSDateTimePicker'
import WSLoader from '@components/WSLoader'
import WSSnackBar from '@components/WSSnackBar'
import WSAlert from '@components/WSAlert'
import WSButton from '@components/WSButton'
import WSTouchable from '@components/WSTouchable'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
    remindText: {
        paddingVertical: ConfiguredStyle.padding.p15,
        borderBottomColor: ConfiguredStyle.colors.grey.light,
        borderBottomWidth: 0.5,
        color: ConfiguredStyle.colors.black,
    },
    button: {
        padding: ConfiguredStyle.padding.md,
    },
    validationErrorText: {
        fontSize: ConfiguredStyle.fonts.xssm,
        color: ConfiguredStyle.colors.social.google,
    },
})

const EditReminderValidation = Yup.object().shape({
    reminderName: Yup.string()
        .required('Please Enter Reminder Name'),
});

class EditReminder extends Component {
    constructor(props) {
        super(props);
        const reminderData = props.navigation.state.params.reminderData
        this.remindTimeDistance = [5, 10, 15, 20, 25, 30]
        this.state = {
            isDateTimePickerVisible: false,
            switchOn: reminderData.allDay || false,
            modalVisible: false,
            remindValue: reminderData.remind || null,
            addedUser: reminderData.invites || [],
            // addedUser: [],
            getUserID: []
        };
        this.toastRef = React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillReceiveProps(nextProps) {
        const { getReminder, updateReminderSuccess, clearFlags } = nextProps
        if (updateReminderSuccess) {
            clearFlags()
            getReminder()
            this.toastRef.current.show('Reminder successfully updated', 1000);
            this.handleBackButtonClick();
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        const { navigation, componentId } = this.props
        return navigation.goBack(componentId);
    }

    onToggleSwitch = () => {
        this.setState((prevState) => ({
            ...prevState,
            switchOn: !prevState.switchOn
        }));
    }

    setModalVisible(visible) {
        this.setState(prevState => ({ ...prevState, modalVisible: visible }))
    }

    notificationFunc = () => {
        const { reminderTitle } = this.state
        // PushNotification.localNotification({
        // 	id: '123',
        // 	title: reminderTitle,
        // 	message: 'Reminder create successful',
        // });
        this.handleBackButtonClick();
    }

    onClickSave = (values) => {
        const { updateReminder, navigation } = this.props
        const { switchOn, remindValue, getUserID } = this.state
        const { reminderName, location } = values;
        const reminderData = navigation.state.params.reminderData
        const unionArray = _.union(getUserID)
        const input = {
            id: reminderData.id,
            reminderDate: moment().format(),
            reminderName: reminderName,
            invites: unionArray,
            remind: remindValue,
            address: location,
            type: 'AddReminder'
        }
        if (switchOn) {
            input.allDay = true
        }
        if (getUserID.length) {
            updateReminder(input)
        } else {
            this.toastRef.current.show('At least one contact must be invited', 1000);
        }
    }

    onPassProp = (data) => {
        if (data) {
            this.setState({
                passDate: data,
            });
        }
    }

    onClickRemind = (data) => {
        this.setState({
            remindValue: data
        }, () => this.setModalVisible(false))
    }

    addedPeople = (data) => {
        if (data.length) {
            const getUserID = data.map((item) => {
                return item && item.id
            })
            this.setState({
                getUserID,
                addedUser: data
            })
        }
    }

    addRecipient = () => {
        const { navigation } = this.props
        navigation.navigate('AddPeople', { onPassProp: this.addedPeople });
    }

    removeUser = (id) => {
        const { addedUser } = this.state
        const removedElement = _.remove(addedUser, function (item) {
            return item && item.id !== id
        })
        this.setState({
            addedUser: removedElement
        })
    }

    render() {
        const { switchOn, modalVisible, remindValue, addedUser } = this.state
        const { loader, navigation } = this.props
        const reminderData = navigation.state.params.reminderData
        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
                <WSHeader
                    name='Edit Reminder'
                    enableBack
                    onLeftMethod={this.handleBackButtonClick}
                />
                <Formik
                    initialValues={{
                        reminderName: reminderData.reminderName || '',
                        date: '',
                        time: '',
                        remindTime: '',
                        location: reminderData.address || 'Ahd'
                    }}
                    validationSchema={EditReminderValidation}
                    onSubmit={values => {
                        Keyboard.dismiss();
                        this.onClickSave(values)
                    }}>
                    {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <ScrollView contentContainerStyle={common.flexGrow1} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                            <View style={common.flex1}>
                                <WSAlert
                                    title='Remind me after'
                                    visibility={modalVisible}
                                    closeAction={() => { this.setModalVisible(!modalVisible) }}>
                                    {this.remindTimeDistance.map((val, index) => (
                                        <WSTouchable
                                            key={index}
                                            onPress={() => this.onClickRemind(val)}
                                            rippleColor={ConfiguredStyle.colors.rippleColorDark}
                                        >
                                            <Text style={pageStyle.remindText}>{val} minutes</Text>
                                        </WSTouchable>
                                    ))}
                                </WSAlert>

                                <View>
                                    <View style={[common.mh20]}>
                                        <WSTextBox
                                            placeholderText='Reminder Name'
                                            code='&#xf573;'
                                            changeText={handleChange('reminderName')}
                                            value={values.reminderName}
                                        />
                                        {(errors.reminderName && touched.reminderName) && (
                                            <Text style={pageStyle.validationErrorText}>{errors.reminderName}</Text>
                                        )}
                                    </View>

                                    <View style={[common.flexDirectionRow, common.mt20]}>
                                        <WSStrip
                                            name='All Day'
                                            icon='&#xf017;'
                                        />
                                        <Right>
                                            <Switch value={switchOn} style={common.mr10} onValueChange={this.onToggleSwitch} />
                                        </Right>
                                    </View>

                                    <View style={[common.mh20, { marginBottom: 10 }]}>
                                        <WSDateTimePicker pickerMode='date' code='&#xf073;' getDate={this.onPassProp} oldDate={reminderData.reminderDate} />
                                    </View>

                                    <View style={[common.mh20, { marginTop: 10 }]}>
                                        <WSDateTimePicker pickerMode='time' code='&#xf017;' getDate={this.onPassProp} oldDate={reminderData.reminderDate} />
                                    </View>

                                    <View style={[common.mh20, common.mb5, { marginTop: 10 }]}>
                                        <WSTextBox
                                            placeholderText='Location'
                                            code='&#xf601;'
                                            changeText={handleChange('location')}
                                            value={values.location}
                                        />
                                    </View>

                                    <WSTouchable
                                        onPress={() => this.setModalVisible(true)}
                                        rippleColor={ConfiguredStyle.colors.rippleColorDark}
                                        style={[common.mh20, pageStyle.remindText, common.pb5]}
                                    >
                                        <Text style={common.colorMediumGrey}>{remindValue ? <Text style={common.colorBlack}>{remindValue} minutes</Text> : 'Remind'}</Text>
                                    </WSTouchable>

                                    <View style={[common.mh20]}>
                                        <AddParticipant addedUserList={addedUser} onAddPeople={this.addRecipient} removeUser={this.removeUser} />
                                    </View>

                                </View>
                            </View>
                            <View style={pageStyle.button}>
                                <WSButton
                                    onBtnPress={handleSubmit}
                                    name='Update Reminder'
                                />
                            </View>
                        </ScrollView>
                    )}
                </Formik>
                <WSSnackBar
                    ref={this.toastRef}
                />
                {loader && <WSLoader />}
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        updateReminderSuccess: state.reminder && state.reminder.updateReminderSuccess,
        loginUserId: state.user && state.user.userData && state.user.userData.id,
        loader: state.user && state.reminder.createLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateReminder: (value) => dispatch(updateReminder(value)),
        getReminder: () => dispatch(getReminder()),
        clearFlags: () => dispatch(clearFlags()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditReminder)