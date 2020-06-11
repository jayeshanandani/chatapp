import React from 'react'
import Auth from '@aws-amplify/auth'
import Amplify from '@aws-amplify/core'
import AsyncStorage from '@react-native-community/async-storage'
import config from 'react-native-config'

const {
    AWS_REGION,
    AWS_IDENTITY_POOL_ID,
    AWS_USER_POOL_ID,
    AWS_USER_POOL_WEB_CLIENT_ID,
} = config


Amplify.configure({
    Auth: {
        region: AWS_REGION,
        identityPoolId: AWS_IDENTITY_POOL_ID,
        userPoolId: AWS_USER_POOL_ID,
        userPoolWebClientId: AWS_USER_POOL_WEB_CLIENT_ID,
    },
})

export default WithAuthenticator = (WrappedComponent) => {
    class HOC extends React.Component {
        signIn = async (user) => {
            const { username, password } = user;
            return await Auth.signIn(username, password)
                .then(async (loginUser) => {
                    await AsyncStorage.setItem('token', loginUser.signInUserSession.idToken.jwtToken)
                    console.log(await loginUser.signInUserSession.idToken.jwtToken);
                    
                    return {user, loginUser};
                })
                .catch(err => {
                    throw err;
                })
        }

        signOut = async () => {
            return await Auth.signOut().then(res => res)
                .catch(err => {
                    throw err
                })
        }

        signUp = async (user) => {
            return await Auth.signUp(user)
                .then(data => data)
                .catch(err => {
                    throw err
                })
        }

        confirmSignUp = async (user) => {
            const { username, verificationCode } = user;
            return await Auth.confirmSignUp(username, verificationCode, {
                forceAliasCreation: false,
            })
                .then(res => res)
                .catch(err => {
                    throw err
                })
        }

        updateAttributes = async (data) => {
            const { user, attributes } = data;
            let user1 = await Auth.currentAuthenticatedUser(user);
            return await Auth.updateUserAttributes(user1, attributes).then(res => {
                return res;
            })
                .catch(err => {
                    throw err
                })
        }

        changePassword = async (data) => {
            const { user, old_password, new_password } = data;
            let user1 = await Auth.currentAuthenticatedUser(user);
            return Auth.changePassword(user1, old_password, new_password).then(res => res).catch(err => {
                throw err
            })
        }

        forgotPassword = async (data) => {
            const { username } = data;
            return await Auth.forgotPassword(username).then(res => res).catch(err => {
                throw err
            });
        }

        forgotPasswordSubmit = async (data) => {
            const { username, code, password } = data
            return await Auth.forgotPasswordSubmit(username, code, password).then(res => {
                return res
            }).catch(err => {
                throw err
            });
        }

        verifyCurrentUserAttribute = async (attr) => {
            return await Auth.verifyCurrentUserAttribute(attr).then(res => res).catch(err => {
                throw err
            });
        }

        verifyCurrentUserAttributeSubmit = async (data) => {
            const { attr, code } = data;
            return await Auth.verifyCurrentUserAttributeSubmit(attr, code).then(res => {
                return res
            }).catch(err => {
                throw err
            });
        }

        render() {
            return (
                <WrappedComponent
                    signIn={this.signIn}
                    signOut={this.signOut}
                    signUp={this.signUp}
                    confirmSignUp={this.confirmSignUp}
                    updateAttributes={this.updateAttributes}
                    changePassword={this.changePassword}
                    forgotPassword={this.forgotPassword}
                    forgotPasswordSubmit={this.forgotPasswordSubmit}
                    verifyCurrentUserAttribute={this.verifyCurrentUserAttribute}
                    verifyCurrentUserAttributeSubmit={this.verifyCurrentUserAttributeSubmit}
                    {...this.props}
                />
            );
        }
    }

    return HOC;
};
