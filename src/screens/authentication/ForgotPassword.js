import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'

import ConfiguredStyle from '@constants/Variables'

import { forgotPasswordStart, forgotPasswordSuccess, forgotPasswordFailure } from '@redux/user/actions'

import WithAuthenticator from '@hoc/WithAuthenticator'

import WSHeader from '@components/WSHeader'
import WSButton from '@components/WSButton'
import WSWaterMark from '@components/WSWaterMark'
import WSTextBox from '@components/WSTextBox'
import WSPageIcon from '@components/WSPageIcon'
import WSGreyText from '@components/WSGreyText'
import WithLoader from '@hoc/WithLoader'
import WSSnackBar from '@components/WSSnackBar'

import styles from '@styles/AppStyle'
import common from '@styles/common'

const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is Required'),
})

const pageStyle = StyleSheet.create({
  button: {
    padding: ConfiguredStyle.padding.md,
  },
})

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userID: '',
      loader: false,
    }
    this.toastRef = React.createRef();
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack
    );
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

  forgotPassword = async (userID) => {
    const { forgotPassword, forgotPasswordStart, forgotPasswordSuccess, forgotPasswordFailure } = this.props
    forgotPasswordStart();
    try {
      this.setState({ userID, loader: false });
      const response = await forgotPassword({ username: userID });
      forgotPasswordSuccess(response);
    }
    catch (e) {
      forgotPasswordFailure(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { navigation } = this.props
    const { isSuccess, flagError, errorMessage } = nextProps
    const { email, userID } = this.state
    if (flagError) {
      this.toastRef.current.show(errorMessage, 1000);
    }
    if (isSuccess) {
      navigation.navigate('Verification', { fromPage: 'forgotPassword', username: email, userID })
    }
  }

  render() {
    const { isLoading } = this.props
    const { loader } = this.state
    return (
      <WithLoader spinner={isLoading || loader}>
        <View style={[common.flex1, common.bgWhite]}>
          <WSHeader
            name="Forgot Password"
            enableBack
            onLeftMethod={this.handleBack}
          />
          <WSWaterMark />
          <Formik
            initialValues={{ email: '' }}
            validationSchema={emailValidationSchema}
            onSubmit={(values) => this.getUserId(values)}
          >
            {({
              handleChange, handleSubmit, values, errors, touched,
            }) => (
                <ScrollView contentContainerStyle={[common.flexGrow1, common.pt20]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                  <View style={[common.ph20, common.flex1, common.centerStart]}>
                    <WSPageIcon icon="&#xf007;" />
                    <WSGreyText description="We will send confirmation code to your entered email address." />

                    <View style={{ width: '100%', paddingTop: ConfiguredStyle.padding.sm }}>
                      <WSTextBox
                        style={common.colorBlack}
                        placeholderText="Enter an email"
                        returnKeyType="done"
                        keyboardType="email-address"
                        changeText={handleChange('email')}
                        value={values.email}
                      />
                    </View>
                    {errors.email && touched.email ? (
                      <Text style={styles.errorMessage}>{errors.email}</Text>
                    ) : null}
                  </View>
                  <View style={pageStyle.button}>
                    <WSButton
                      onBtnPress={handleSubmit}
                      name="Send Email"
                    />
                  </View>
                </ScrollView>
              )}
          </Formik>
        </View>
        <WSSnackBar ref={this.toastRef} />
      </WithLoader>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    flagError: state.user.forgotErrorFlag,
    isLoading: state.user.loading,
    isSuccess: state.user.success,
    errorMessage: state.user && state.user.error && state.user.error.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPasswordStart: () => dispatch(forgotPasswordStart()),
    forgotPasswordSuccess: (value) => dispatch(forgotPasswordSuccess(value)),
    forgotPasswordFailure: (value) => dispatch(forgotPasswordFailure(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(ForgotPassword))