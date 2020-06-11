import moment from 'moment'
import { Alert } from 'react-native'
import Permissions from 'react-native-permissions'

export function isEmptyObj(obj) {
    return !obj || Object.keys(obj).length === 0
}

export function groupByWithDate(data) {
    if (data) {
        const groups = data.reduce((groups, message) => {
            const date = moment(message.sentAt).format('YYYY-MM-DD');
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(message)
            return groups
        }, {})
        const groupArrays = Object.keys(groups).map(date => ({
            title: moment(date).format('LL'),
            data: groups[date],
        }))
        return groupArrays
    } else {
        return []
    }

}

export function requestFunction(permissionName) {
    return Permissions.request(permissionName).then(response => response)
}

export function permissionFunction() {
    Permissions.checkMultiple(['camera', 'photo']).then((response) => {
        if (response && response.photo === 'authorized') {
            return true
        } if (response && response.photo === 'denied') {
            Alert.alert(
                'Can we access your photos?',
                'We need access so you can send photo and take photo',
                [
                    {
                        text: 'No way',
                        onPress: () => console.log('Permission denied'),
                        style: 'cancel',
                    },
                    response.photo === 'undetermined'
                        ? { text: 'OK', onPress: this._requestPermission('photo') }
                        : { text: 'Open Settings', onPress: Permissions.openSettings },
                ],
            )
            return false
        }

        if (response && response.camera === 'authorized') {
            return true
        } if (response && response.camera === 'denied') {
            Alert.alert(
                'Can we access your camera?',
                'We need access so you can send photo and take photo',
                [
                    {
                        text: 'No way',
                        onPress: () => console.log('Permission denied'),
                        style: 'cancel',
                    },
                    response.camera === 'undetermined'
                        ? { text: 'OK', onPress: this._requestPermission('camera') }
                        : { text: 'Open Settings', onPress: Permissions.openSettings },
                ],
            )
            return false
        }
    })
}

export function checkPermission() {
    return Permissions.check('microphone').then((response) => {
        if (response === 'authorized') {
            return true
        } if (response === 'denied') {
            Alert.alert(
                'Can we access your microphone?',
                'We need access so you can send audio.',
                [
                    {
                        text: 'No way',
                        onPress: () => console.log('Permission denied'),
                        style: 'cancel',
                    },
                    response === 'undetermined'
                        ? { text: 'OK', onPress: this._requestPermission('microphone') }
                        : { text: 'Open Settings', onPress: Permissions.openSettings },
                ],
            )
            return false
        }
    })
}