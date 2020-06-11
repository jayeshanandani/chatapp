import evilIcon from 'react-native-vector-icons/EvilIcons'
import antDesign from 'react-native-vector-icons/AntDesign'
import matIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import entypo from 'react-native-vector-icons/Entypo'
import fa from 'react-native-vector-icons/FontAwesome'
import follow from 'react-native-vector-icons/SimpleLineIcons'

export const libIcons = {}

export const loadIcons = Promise.all([
    antDesign.getImageSource('user', 30),
    evilIcon.getImageSource('comment', 30),
    matIcon.getImageSource('arrow-left', 30),
    evilIcon.getImageSource('redo', 30),
    // matIcon.getImageSource('dots-vertical', 30),
    // matIcon.getImageSource('share-outline', 30),
    // entypo.getImageSource('plus', 30),
    evilIcon.getImageSource('gear', 30),
    // follow.getImageSource('user-follow', 20),
    // fa.getImageSource('sliders', 30),
    // fa.getImageSource('calendar-plus-o', 20),
]).then((sources) => {
    [
        libIcons.userIcon,
        libIcons.commentsIcon,
        libIcons.backIcon,
        libIcons.resetIcon,
        libIcons.settingsIcon,
    ] = sources // do whatever necessary thing you need
    return true
}).catch(error => error)