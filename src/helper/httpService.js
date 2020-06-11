import axios from 'axios'
import config from 'react-native-config'
import AsyncStorage from '@react-native-community/async-storage'
import Auth from '@aws-amplify/auth'
import RNFetchBlob from 'rn-fetch-blob'

export const uploadFile = async (file) => {
    // let con = axios.interceptors.request.use((configuration) => {
    //     return Auth.currentAuthenticatedUser()
    //       .then((session) => {
    //         // User is logged in. Set auth header on all requests
    //         configuration.headers.jwt = `${session.signInUserSession.idToken.jwtToken}`;
    //         console.log('token:>:', configuration);
            
    //         return Promise.resolve(configuration);
    //       })
    //       .catch((err) => {
    //         console.log('token:>:err', err);
    //         // No logged-in user: don't set auth header
    //         return Promise.resolve(configuration);
    //       });
    //   });
    //   console.log('con:>:', con);

    const token = await AsyncStorage.getItem('token');
    let URL = `${config.PRE_SIGNED_URL}?filename=${file.name}&token=${token}&fileType=${file.type}`;
    console.log('URL::', URL.toString());
    
    let res = await new Promise((resolve, reject) => axios.get(URL)
        .then(async (response) => {
            console.log('image upload::', response);
            const signedRequest = response.data.signedRequest;
            console.log('current file:', file);
            
            const options = {
                headers: {
                    "Content-Type": file.type
                }
            };
            console.log('file upload options:', options);
            RNFetchBlob.fetch('PUT', signedRequest, {
                "Content-Type": file.type
            }, RNFetchBlob.wrap(file.uri))
                .then(async (result) => {
                    console.log('image upload::got url', result);
                    resolve(result);
                })
                .catch(error => {
                    console.log('error on upload media', error)
                    reject(error);
                })
        }).catch(error => {
            console.log('error on get pre-signed', error)
            reject(error);
        })
    )
    return res;
}