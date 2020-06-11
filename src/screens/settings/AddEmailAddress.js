import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  BackHandler
} from 'react-native'
import WSHeader from '@components/WSHeader'
import WSSnackBar from '@components/WSSnackBar'
import Auth from '@aws-amplify/auth'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

import {
  checkEmailExist,
  checkEmailExistSuccess,
  checkEmailExistFailure,
  checkEmailExistClear,
  updateUserProfile,
  updateUserProfileClear
} from '@redux/user/actions'

import WithLoader from '@hoc/WithLoader'
import WithAuthenticator from '@hoc/WithAuthenticator'

import WSTextBox from '@components/WSTextBox'
import WSAlert from '@components/WSAlert'
import WSButton from '@components/WSButton'

import styles from '@styles/AppStyle'
import common from '@styles/common'

const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is Required'),
})

const pageStyle = StyleSheet.create({
  alertMessage: {
    padding: ConfiguredStyle.padding.sm,
    textAlign: enums.CENTER,
    color: ConfiguredStyle.colors.black,
  },
  showHideButton: {
    fontWeight: enums.BOLD,
    color: ConfiguredStyle.colors.primary,
    fontSize: ConfiguredStyle.fonts.xsm,
    position: enums.ABSOLUTE,
    bottom: 0,
    right: 0,
    paddingVertical: ConfiguredStyle.size.sm,
    paddingRight: ConfiguredStyle.size.sm,
  },
})

let that;

class AddEmailAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      isLoading: false,
      emailId: '',
    }
  }

  componentDidMount() {
    that = this
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
    const { navigation } = this.props
    return navigation.goBack();
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  resetEmail = async () => {
    const { emailId } = this.state;
    const { updateAttributes, verifyCurrentUserAttribute, updateUserProfile } = this.props
    try {
      const currentUser = await Auth.currentAuthenticatedUser();

      const response = await updateAttributes({
        user: currentUser,
        attributes: {
          email: emailId.toLowerCase(),
        }
      });
      if (response === 'SUCCESS') {
        const verifyResponse = await verifyCurrentUserAttribute('email');

        if (verifyResponse === undefined) {
          updateUserProfile({ email: emailId })
          // this.setModalVisible(true);
          // this.setState({ isLoading: false });
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

  updateEmail = (values) => {
    const { checkEmailExist } = this.props;
    checkEmailExist({ email: values.email })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checkUserExistSuccess && that) {
      nextProps.checkEmailExistClear()
      if (nextProps.userExist) {
        that.refs.toast.show('This email is already exist, please try another.', 2000);
        return { isLoading: false }
      } else {
        that.resetEmail();
        return {}
      }
    }
    if (nextProps.userUpdateSuccess && that) {
      that.refs.toast.show('Email Updated successfully', 1000);
      nextProps.updateUserProfileClear();
      return { isLoading: false }
    }
    return {};
  }

  render() {
    const { user, navigation } = this.props
    const { modalVisible, isLoading } = this.state
    return (
      <WithLoader spinner={isLoading}>
        <View style={[common.flex1, common.bgWhite]}>
          <WSHeader
            name="Email Address"
            enableBack
            onLeftMethod={this.handleBackButtonPressAndroid}
          />
          <WSSnackBar ref="toast" />
          <Formik
            initialValues={{ email: user && user.email ? user.email : '' }}
            validationSchema={emailValidationSchema}
            onSubmit={(values) => {
              Keyboard.dismiss();
              this.setState({ isLoading: true, emailId: values.email })
              this.updateEmail(values);
            }}
          >
            {({
              handleChange, values, errors, touched, handleSubmit
            }) => (
                <View style={common.flex1}>
                  <View style={common.m20}>
                    <WSTextBox
                      style={common.colorBlack}
                      placeholderText="Type new email to change"
                      changeText={handleChange('email')}
                      value={values.email}
                    />
                    <TouchableWithoutFeedback onPress={handleSubmit}>
                      <Text style={pageStyle.showHideButton}>Update</Text>
                    </TouchableWithoutFeedback>
                  </View>
                  {errors.email && touched.email ? (
                    <Text style={[styles.errorMessage, common.ml20]}>{errors.email}</Text>
                  ) : null}
                  <WSAlert
                    title="Verify your new email"
                    visibility={modalVisible}
                    closeAction={() => this.setModalVisible(false)}
                  >
                    <Text style={pageStyle.alertMessage}>
                      {"We have sent a confirmation email to "}
                      <Text style={{ color: ConfiguredStyle.colors.primary }}>{values.email.toLowerCase()}</Text>
                      {". Please verify it by clicking on the link in the email we've sent."}
                    </Text>
                    <WSButton
                      name="Okay"
                      onBtnPress={() => {
                        this.setModalVisible(false);
                        navigation.navigate('Verification', {
                          fromPage: 'AddEmailAddress', updatedEmail: values.email, onDone: status => {
                            if (status && status === 'SUCCESS') {
                              this.refs.toast.show('Email Updated successfully', 2000);
                            }
                          }
                        })
                      }}
                    />
                  </WSAlert>
                </View>
              )}
          </Formik>
        </View>
      </WithLoader>
    )
  }
}

const mapStateToProps = state => (
  {
    user: state.user.userData,
    checkUserExistSuccess: state.user.checkUserExistSuccess,
    userExist: state.user.userExist,
    userUpdateSuccess: state.user.userUpdateSuccess,
  }
)

const mapDispatchToProps = dispatch => {
  return {
    checkEmailExist: (value) => dispatch(checkEmailExist(value)),
    checkEmailExistSuccess: () => dispatch(checkEmailExistSuccess()),
    checkEmailExistFailure: () => dispatch(checkEmailExistFailure()),
    checkEmailExistClear: () => dispatch(checkEmailExistClear()),
    updateUserProfile: (value) => dispatch(updateUserProfile(value)),
    updateUserProfileClear: () => dispatch(updateUserProfileClear()),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(AddEmailAddress))