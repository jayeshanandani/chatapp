import React, { Component } from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView,
  BackHandler,
  Platform,
  ScrollView,
  Alert,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import uuidv1 from 'uuid/v1'
import { Formik } from 'formik'
import * as Yup from 'yup'

import Typography from '@constants/Typography'
import images from '@constants/Image'
import enums from '@constants/Enum'

import { defaultImageMimetype } from '@helper/keysForBucket'

import {
  checkEmailExist,
  checkEmailExistSuccess,
  checkEmailExistFailure,
  checkEmailExistClear,
} from '@redux/user/actions'

import WithLoader from '@hoc/WithLoader'

import WSPageIcon from '@components/WSPageIcon'
import WSGreyText from '@components/WSGreyText'
import WSWaterMark from '@components/WSWaterMark'
import WSHeader from '@components/WSHeader'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSImagePicker from '@components/WSImagePicker'
import WSSnackBar from '@components/WSSnackBar'

import styles from '@styles/AppStyle'
import common from '@styles/common'
import { uploadFile } from '../../helper/httpService'

const validationSchema = Yup.object().shape({
  full_name: Yup.string()
    .required('Full name is required'),
  emailId: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
});

let that;

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      full_name: '',
      emailId: ''
    }
    this.myRef = React.createRef();
    this.emailRef = React.createRef();
  }

  componentDidMount() {
    that = this;
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

  updateAttributes = (val) => {
    const { checkEmailExist } = this.props
    const { full_name, emailId } = val;
    this.setState({
      full_name,
      emailId
    })
    Keyboard.dismiss();
    checkEmailExist({ email: emailId })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { navigation, signInUserDetails, userExist } = nextProps
    const { password, email, phoneNumber } = navigation.state.params
    const { imageUrl, full_name, emailId } = prevState

    if (nextProps.checkUserExistSuccess) {
      nextProps.checkEmailExistClear()

      let data = signInUserDetails
      let attributes = { 'custom:full_name': full_name, 'email': emailId };
      data.attributes = attributes;
      data.profile_image = {
        bucket: Config.AWS_BUCKET,
        url: imageUrl
      }
      let content = { 'custom:full_name': full_name, 'email': emailId };

      if (full_name && !userExist) {
        navigation.navigate('UserId', { content, data, password, phoneNumber, email, emailId });
      } else {
        that.myRef.current.show('This email is already exist, please try another.', 2000);
      }
    }
    return {};
  }

  getImageDetailsToUpload = (details) => {
		let extension;
		if (details?.type) {
		  const extensionIndex = details.path.lastIndexOf(".");
		  extension = details.path.slice(extensionIndex + 1);
		} else {
		  extension = defaultImageMimetype;
		}
    this.setState(prevState => ({ ...prevState, isLoading: true }), async () => {
			const allowedExtensions = ["jpg", "jpeg", "png"];
			const correspondingMime = ["image/jpeg", "image/jpeg", "image/png"];
      const fileName = `${uuidv1()}.${extension}`;
      const file = {
        uri: details.uri,
        name: fileName, 
				type: correspondingMime[allowedExtensions.indexOf(extension)],
      };
      const res = await uploadFile(file);
      console.log('response from image upload', res);    
      this.setState({ imageUrl: fileName, isLoading: false });
    });
  }

  render() {
    const { isLoading } = this.state
    return (
      <WithLoader spinner={isLoading}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
          <WSHeader
            name="Profile Info"
            enableBack
            onLeftMethod={this.handleBack}
          />
          <WSWaterMark image={images.waterMark} />
          <Formik
            initialValues={{ full_name: '', emailId: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => this.updateAttributes(values)}
          >
            {({
              handleChange, handleSubmit, values, errors, touched,
            }) => (
                <ScrollView contentContainerStyle={[common.flexGrow1, common.pt20]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                  <View style={[common.flex1, common.centerStart, common.ph20, common.mb40]}>
                    <WSPageIcon icon="&#xf007;" />
                    <View style={common.mb15}>
                      <WSGreyText description="A little bit about yourself" />
                    </View>
                    <View style={[common.flexDirectionRow, common.alignItemCenter]}>
                      <WSImagePicker getImageDetailsToUpload={this.getImageDetailsToUpload} />
                      <Text style={[Typography.h3, common.selfCenter, common.ph20]}>
                        Upload Profile Picture
                    </Text>
                    </View>
                    <View style={{ width: '100%' }}>
                      <WSTextBox
                        placeholderText="What's your full name?"
                        changeText={handleChange('full_name')}
                        value={values.full_name}
                        returnKeyType={'next'}
                        onSubmitEditing={() => this.emailRef.current.focus()}
                      />
                    </View>
                    {errors.full_name && touched.full_name ? (
                      <Text style={styles.errorMessage}>{errors.full_name}</Text>
                    ) : null}
                    <View style={{ width: '100%' }}>
                      <WSTextBox
                        reference={this.emailRef}
                        placeholderText="Email Address"
                        returnKeyType={'done'}
                        changeText={handleChange('emailId')}
                        keyboardType="email-address"
                        value={values.emailId}
                      // changeText={text => this.setState(prevState => ({ ...prevState, email_id: text }))}
                      // value={signUpUserDetails && signUpUserDetails.email}
                      />
                      {errors.emailId && touched.emailId ? (
                        <Text style={styles.errorMessage}>{errors.emailId}</Text>
                      ) : null}
                    </View>
                  </View>
                  <WSSnackBar
                    ref={this.myRef}
                  />
                  <View style={styles.bottomButton}>
                    <WSButton onBtnPress={handleSubmit} name="Next" />
                  </View>
                </ScrollView>
              )}
          </Formik>
        </KeyboardAvoidingView>
      </WithLoader>
    );
  }
}

const mapStateToProps = state => {
  return {
    errorMessage: state.user && state.user.data && state.user.data !== 'SUCCESS',
    signInUserDetails: state.user.signInUserDetails,
    signUpUserDetails: state.user.signUpUserDetails,
    userUpdateSuccess: state.user.userUpdateSuccess,
    checkUserExistSuccess: state.user.checkUserExistSuccess,
    userExist: state.user.userExist,
  }
}

const mapDispatchToProps = dispatch => (
  {
    checkEmailExist: (value) => dispatch(checkEmailExist(value)),
    checkEmailExistSuccess: () => dispatch(checkEmailExistSuccess()),
    checkEmailExistFailure: () => dispatch(checkEmailExistFailure()),
    checkEmailExistClear: () => dispatch(checkEmailExistClear()),
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)