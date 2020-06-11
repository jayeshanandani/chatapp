import gql from 'graphql-tag'

export const createAnnouncementMutation = gql`
mutation($input: AnnouncementInput){
  createAnnouncement(input: $input){
    id
    room
    receiver {
      id
      email
      userName
    }
    sender {
      id
      careId
      userName
    }
    message
    sentAt
    localMessageId
    type
    metaType
    seen
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
        email
        careId
        userName
      }
    }
  }
}`

export const getAnnouncementQuery = gql`
query {
  userAnnouncement {
    id
    title
    date
    invites {
      id
      email
      userName
    }
    announcement
    isArchive
    creator {
      id
      userName
      email
      careId
    }
  }
} `

export const archiveAnnouncementMutation = gql`
mutation($input: AnnouncementInput){
  archiveAnnouncement(input: $input){
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
      email
      careId
      userName
    }
  }
}`

export const updateAnnouncementMutation = gql`
mutation updateAnnouncement ($input: AnnouncementUpdateInput){
  updateAnnouncement (input: $input){
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
      email
      careId
      userName
    }
  }
}`