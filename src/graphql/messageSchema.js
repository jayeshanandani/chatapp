import gql from 'graphql-tag'

export const getUserRoomsSchema = gql`
query($id: String!) {
  getUserRooms(id: $id) {
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

export const getMessagesSchema = gql`
query getUserRoomMessages ($input: RoomInput) {
  getUserRoomMessages(input: $input) {
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
}`

export const addRoomMutation = gql`
mutation($input: RoomInput){
  addRoom(input: $input) {
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
}
`

export const sendMessageMutation = gql`
mutation($input: MessageInput){
  addMessage(input: $input) {
    id
    room
    receiverId
    localMessageId
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
    seen
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
    sentAt
    metaType
    message
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
}
`
export const EnterInRoomMutation = gql`
mutation($input: RoomInput){
  usingRoom(input: $input) {
    id
  }
}
`

export const LeaveRoomMutation = gql`
mutation($input: RoomInput){
  notUsingRoom(input: $input) {
    id
  }
}
`

export const deleteMessageMutation = gql`
mutation($input: MessageInput) {
  removeMessage(input: $input) {
    id
    room
    sender {
      id
      userName
      careId
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
      careId
      media {
        url
        small
        medium
        large
      }
    }
    sentAt
    message
    type
    metaType
    metadata {
      id
      url
      small
      medium
      large
    }
    seen
  }
}
`