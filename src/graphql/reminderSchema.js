import gql from 'graphql-tag'

export const createReminderMutation = gql`
mutation($input: ReminderInput){
    addReminder(input: $input) {
        id
        room
        receiver {
            id
            email
            userName
        }
        sender {
            id
            email
            userName
        }
        message
        sentAt
        localMessageId
        type
        seen
        reminderInvitation {
            id
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
            rejected
            createdAt
            room
            reminder {
                id
                reminderDate
                reminderName
                allDay
                address
                remind
                createdAt
                creator {
                    id
                    email
                    careId
                }
            }
        }
        reminder {
            id
            reminderDate
            reminderName
            allDay
            address
            remind
            createdAt
            creator {
                id
                email
                careId
            }
        }
    }
} `

export const getReminderQuery = gql`
query getReminders {
    getUserReminders {
        reminder {
            id
            reminderDate
            reminderName
            allDay
            invites {
                id
                email
                userName
              }
            address
            remind
            createdAt
            creator {
                id
                email
                userName
                careId
            }
        }
    }
} `

export const acceptReminderInvitation = gql`
mutation($input: ReminderInviteInput){
    acceptReminderInvitation(input: $input) {
        id
        room
        receiver {
            id
            email
            userName
        }
        sender {
            id
            email
            userName
        }
        message
        localMessageId
        sentAt
        type
        reminder {
            id
            reminderDate
            reminderName
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
    }
} `

export const deleteReminderMutation = gql`
mutation($input: ReminderInput){
  removeReminder(input: $input){
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
      careId
      userName
    }
  }
}`

export const updateReminderMutation = gql`
mutation($input: ReminderInput){
  updateReminder(input: $input){
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
      careId
      userName
    }
  }
}`