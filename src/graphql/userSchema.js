import gql from 'graphql-tag'

export const getAllUserQuery = gql`
query users {
   users {
     id
     email
     userName
     phoneNumber
     careId
     media {
       id
       bucket
       url
       path
       small
       medium
       large
     }
   }
}
`

export const getCareIdSuggestions = gql`
query ($careId: String) {
  userNameSuggestions(careId: $careId) {
    userName {
      byEmail
    }
  }
}
`

export const addUserMutation = gql`
mutation addUser($input: UserInput) {
  addUser(input: $input) {
      id
      media {
        url
        small
        medium
        large
      }
      email
      careId
      userName
      phoneNumber
    }
}`

export const checkUserExistsMutation = gql`
mutation checkUserExists($input: UserInput) {
  checkUserExists(input: $input) 
}`

export const updateGroupMutation = gql`
mutation updateRoom($input: RoomInput) {
  updateRoom(input: $input) {
    id
    roomName
    blockedContact {
      blockedBy
      blocked
    }
    removedUsers
    admin {
      id
      userName
    }
    type
    message {
      id
      message
      room
      localMessageId
      sentAt
      type
      announcement {
        id
        title
        date
        invites {
          id
          email
          userName
        }
        announcement
        creator {
          id
          userName
          email
          careId
        }
      }
      reminderInvitation {
        id
        rejected
        reminder{
          id
          reminderDate
          reminderName
        }
        inviter {
          id
          email
          userName
        }
        invitee {
          id
          email
          userName
        }
        accepted
        createdAt
        room
      }
      reminder {
        id
        reminderDate
        reminderName
        invites {
          id
          email
          userName
        }
        allDay
        address
        remind
        createdAt
        creator {
          id
          email
          userName
        }
      }
      seen
      sender {
        id
        userName
        media {
          url
          small
          medium
          large
        }
      }
      receiver {
        id
        userName
        media {
          url
          small
          medium
          large
        }
      }
      metaType
      metadata {
        id
        bucket
        url
        path
        small
        medium
        large
      }
    }
    icon {
      bucket
      path
      url
      small
      medium
      large
    }
    members {
      userName
      careId
      id
      email
      phoneNumber
      media {
        url
        small
        medium
        large
      }
    }
    room
    localId
    updatedAt
    createdAt
  }
}`

export const createDeviceMutation = gql`
mutation ($input: DeviceInput) {
  storeDevice(input: $input) {
    status
    deviceType
    uuid
    token
    endPointArn
  }
}`

export const getUserInfo = gql`
query getLoginUser {
  getLoginUser {
    id
    email
    userName
    careId
    media {
      id
      url
      bucket
      path
      small
      medium
      large
    }
    phoneNumber
    notification
    online
    lastSeen
    hospitalName
    hospitalAddress
    isDnd
    dndFrom
    dndTo
    homeNumber
  }
}`

export const updateUserInfo = gql`
mutation updateUser($input: UserInput) {
  updateUser(input: $input) {
    id
    email
    userName
    careId
    media {
        id
        url
        bucket
        path
        small
        medium
        large
    }
    phoneNumber
    notification
    online
    lastSeen
    hospitalName
    hospitalAddress
    isDnd
    dndFrom
    dndTo
    homeNumber
  }
}`

export const storeContacts = gql`
mutation storeContacts($input: ContactInput) {
  storeContacts(input: $input) {
    contacts {
      givenName
      number
      id  {
        id
        email
        userName
        careId
        media {
          id
          url
          bucket
          path
          small
          medium
          large
        }
        phoneNumber
        notification
        online
        lastSeen
        hospitalName
        hospitalAddress
        isDnd
        dndFrom
        dndTo
        homeNumber
      }
    }
  }
}`

export const userContacts = gql`
query userContacts($id: String) {
  userContacts(id: $id) {
    contacts {
      givenName
      number
      id {
        id
        email
        userName
        careId
        media {
          id
          url
          bucket
          path
          small
          medium
          large
        }
        phoneNumber
        notification
        online
        lastSeen
        hospitalName
        hospitalAddress
        isDnd
        dndFrom
        dndTo
        homeNumber
      }
    }
  }
}`