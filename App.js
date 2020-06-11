import React from "react";
import { View, NetInfo, UIManager, Platform } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import config from "react-native-config";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";

import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from "apollo-cache-inmemory";

import Auth from "@aws-amplify/auth";
import configureStore from "@redux/store";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import BottomTab from "./src/components/BottomTab";
import SwiperScreen from "./src/screens/SwiperScreen";

// import Authentication from './src/screens/authentication/Auth'
import SignUp from "./src/screens/authentication/SignUp";
import Login from "./src/screens/authentication/Login";
import PasswordCreation from "./src/screens/authentication/PasswordCreation";
import Verification from "./src/screens/authentication/Verification";
import ChangePassword from "./src/screens/authentication/ChangePassword";
import ForgotPassword from "./src/screens/authentication/ForgotPassword";
import ResetPassword from "./src/screens/authentication/ResetPassword";

import Profile from "./src/screens/user/Profile";
import PersonalDetails from "./src/screens/user/PersonalDetails";
import UserChat from "./src/screens/chat/UserChat";
import ContactList from "./src/screens/user/ContactList";
import CareIdentifier from "./src/screens/user/CareIdentifier";
import PersonProfile from "./src/screens/user/PersonProfile";

import Home from "./src/screens/home/Home";
import HomeProfile from "./src/screens/home/HomeProfile";
import AuthComponent from "./src/screens/authentication/Auth";
import CreateAnnouncement from "./src/screens/announcement/CreateAnnouncement";
import EditAnnouncement from "./src/screens/announcement/EditAnnouncement";
import Announcement from "./src/screens/announcement/Announcement";
import ArchiveAnnoucement from "@screens/announcement/ArchiveAnnoucement";

import Reminder from "./src/screens/reminder/Reminder";
import CreateReminders from "./src/screens/reminder/CreateReminders";
import EditReminder from "./src/screens/reminder/EditReminder";

import AddPhoneNumber from "./src/screens/settings/AddPhoneNumber";
import AddEmailAddress from "./src/screens/settings/AddEmailAddress";
import Settings from "./src/screens/settings/Settings";
import AddPeople from "./src/screens/settings/AddPeople";

import ShareMedia from "./src/screens/chat/ShareMedia";
import CameraPage from "./src/screens/chat/CameraPage";
import NewGroup from "./src/screens/chat/NewGroup";
import NewChat from "./src/screens/chat/NewChat";
import PhotoGrid from "./src/screens/chat/PhotoGrid";

import Help from "./src/screens/help/Help";
import ContactUs from "./src/screens/help/ContactUs";
import SuccessContactUs from "./src/screens/help/SuccessContactUs";

import CreateSocialContacts from "./src/screens/social/CreateSocialContacts";
import ConfiguredStyle from "./src/constants/Variables";

import BlankPage from "./src/screens/BlankPage";
import ContactTab from "./src/screens/social/ContactTab";
import WordEditor from "@helper/WordEditor";
import Animated, { Easing } from "react-native-reanimated";
import AsyncStorage from "@react-native-community/async-storage";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const { AWS_REGION, GRAPHQL_URL } = config;

Auth.currentSession().then((res) => {
  console.log(res)
})

// create an apollo link instance, a network interface for apollo client
const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `${token}` : ""
    },
  };
});

// create an inmemory cache instance for caching graphql data
const cache = new InMemoryCache();
// instantiate apollo client with apollo link instance and cache instance
export const localClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
});

const store = configureStore();

const TabNavigator = createBottomTabNavigator(
  {
    ContactList: ContactList,
    Home: Home,
    Settings: Settings
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: ({ navigation, screenProps }) => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        let iconSize;
        let activeTab = false;
        if (routeName === "Home") {
          iconName = "ios-chatbubbles";
          iconSize = 30;
          activeTab = true;
        } else if (routeName === "ContactList") {
          iconName = `md-person`;
          iconSize = 30;
          activeTab = true;
        } else if (routeName === "Settings") {
          iconName = `md-settings`;
          iconSize = 30;
          activeTab = true;
        }
        return (
          <IconComponent
            name={iconName}
            size={iconSize}
            color={activeTab ? tintColor : "#dbdaf1"}
          />
        );
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: ConfiguredStyle.colors.primary,
      inactiveTintColor: "#dbdaf1",
      style: { height: Platform.OS == "ios" ? 50 : 50 }
    }
  }
);

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 300,
      useNativeDriver: true
    },
    containerStyle: {
      backgroundColor: "transparent"
    },
    screenInterpolator: sceneProps => {
      const { position, layout, scene } = sceneProps;
      const thisSceneIndex = scene.index;
      const width = layout.initWidth;
      const height = layout.initHeight;

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        outputRange: [width, 0, 0]
      });

      const translateY = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        outputRange: [height, 0, 0]
      });

      const slideInFromBottom = { transform: [{ translateY }] };

      const slideFromRight = { transform: [{ translateX }] };

      if (scene.route.routeName == "LoginStack") {
        return slideInFromBottom;
      } else {
        return slideFromRight;
      }
    }
  };
};

const HomeStack = createStackNavigator(
  {
    TabNavigator: { screen: BottomTab },
    CreateReminders: { screen: CreateReminders },
    EditReminder: { screen: EditReminder },
    Home: { screen: Home },
    CreateAnnouncement: { screen: CreateAnnouncement },
    EditAnnouncement: { screen: EditAnnouncement },
    Announcement: { screen: Announcement },
    ArchiveAnnoucement: { screen: ArchiveAnnoucement },
    Reminder: { screen: Reminder },
    ShareMedia: { screen: ShareMedia },
    PersonProfile: { screen: PersonProfile },
    HomeProfile: { screen: HomeProfile },
    Verification: { screen: Verification },
    // Authentication: { screen: Authentication },
    NewGroup: { screen: NewGroup },
    AddPeople: { screen: AddPeople },
    NewChat: { screen: NewChat },
    PhotoGrid: { screen: PhotoGrid },
    Help: { screen: Help },
    ContactUs: { screen: ContactUs },
    PersonalDetails: { screen: PersonalDetails },
    ChangePassword: { screen: ChangePassword },
    AddPhoneNumber: { screen: AddPhoneNumber },
    AddEmailAddress: { screen: AddEmailAddress },
    Settings: { screen: Settings },
    SuccessContactUs: { screen: SuccessContactUs },
    UserChat: { screen: UserChat },
    CameraPage: { screen: CameraPage },
    CreateSocialContacts: { screen: CreateSocialContacts },
    ContactList: { screen: ContactList },
    BlankPage: { screen: BlankPage },
    ContactTab: { screen: ContactTab },
    WordEditor: { screen: WordEditor },
  },
  {
    transparentCard: true,
    headerMode: "none",
    cardStyle: {
      opacity: 1
    },
    transitionConfig: transitionConfig
  }
);

const LoginStack = createStackNavigator(
  {
    Login: { screen: Login },
    ResetPassword: { screen: ResetPassword },
    ForgotPassword: { screen: ForgotPassword },
    Verification: { screen: Verification }
  },
  {
    transparentCard: true,
    transitionConfig: transitionConfig,
    headerMode: "none",
    cardStyle: {
      opacity: 1
    }
  }
);

const SignUpStack = createStackNavigator(
  {
    SignUp: { screen: SignUp },
    UserId: { screen: CareIdentifier },
    PasswordCreation: { screen: PasswordCreation },
    Verification: { screen: Verification },
    Profile: { screen: Profile }
  },
  {
    transparentCard: true,
    transitionConfig: transitionConfig,
    headerMode: "none",
    cardStyle: {
      opacity: 1
    }
  }
);

const AuthStack = createStackNavigator(
  {
    Auth: { screen: AuthComponent },
    SwiperScreen: { screen: SwiperScreen }
  },
  {
    transparentCard: true,
    transitionConfig: transitionConfig,
    headerMode: "none",
    cardStyle: {
      opacity: 1
    }
  }
);

const switchNavigator = createStackNavigator(
  {
    AuthStack: { screen: AuthStack },
    LoginStack: { screen: LoginStack },
    SignUpStack: { screen: SignUpStack },
    HomeStack: { screen: HomeStack }
  },
  {
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(switchNavigator);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: ConfiguredStyle.colors.primary,
    accent: ConfiguredStyle.colors.primary,
    disabled: ConfiguredStyle.colors.grey.lightLine,
    placeholder: ConfiguredStyle.colors.grey.light,
    error: ConfiguredStyle.colors.red
  }
};

export default class App extends React.Component {
  render() {
    return (
      <PaperProvider
        theme={theme}
        settings={{
          icon: props => <FontAwesome5 {...props} />
        }}
      >
        <Provider store={store.store}>
          <ApolloProvider client={localClient}>
            <AppContainer {...this.props} />
          </ApolloProvider>
        </Provider>
      </PaperProvider>
    );
  }
}
