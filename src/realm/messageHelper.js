import Realm from 'realm';
import _ from 'lodash';
import { isEmptyObj } from '@helper/GenericFunction'
import enums from '../constants/Enum'

const SeenMessageSchema = {
  name: 'SeenMessage',
  properties: {
    id: 'string?',
    userId: 'User?',
    seen: 'string?',
    messageId: 'string?',
    delivered: 'string?',
    deleted: 'string?',
    users: 'string?[]',
  },
};

const AnnouncementSchema = {
  name: 'Announcement',
  properties: {
    id: 'string?',
    title: 'string?',
    date: 'date?',
    invites: {
      type: 'list',
      objectType: 'User'
    },
    announcement: 'string?',
    creator: 'User?',
  },
};

const ReminderInviteSchema = {
  name: 'ReminderInvite',
  properties: {
    id: 'string?',
    inviter: 'User?',
    invitee: 'User?',
    accepted: 'int?',
    reminder: 'Reminder?',
    createdAt: 'date?',
    room: 'string?',
    rejected: 'bool?',
  },
};

const ReminderSchema = {
  name: 'Reminder',
  properties: {
    id: 'string?',
    reminderDate: 'date?',
    reminderName: 'string?',
    invites: {
      type: 'list',
      objectType: 'User'
    },
    allDay: 'bool?',
    address: 'string?',
    remind: 'int?',
    createdAt: 'date?',
    creator: 'User?',
  },
};

const MessageSchema = {
  name: 'Message',
  properties: {
    id: 'string?',
    room: 'string?',
    receiver: 'User?',
    sender: 'User?',
    message: 'string?',
    sentAt: 'date?',
    localMessageId: 'string?',
    type: 'int?',
    metaType: 'int?',
    metadata: {
      type: 'list',
      objectType: 'S3Object'
    },
    reminder: 'Reminder?',
    reminderInvitation: 'ReminderInvite?',
    receiverId: 'string?',
    announcement: 'Announcement?',
    seen: 'string?',
    // messageSeen: {
    //   type: 'list',
    //   objectType: 'SeenMessage'
    // },
  },
};

const MediaSchema = {
  name: 'S3Object',
  properties: {
    id: 'string?',
    bucket: 'string?',
    path: 'string?',
    url: 'string?',
    small: 'string?',
    medium: 'string?',
    large: 'string?'
  },
};

const DeviceSchema = {
  name: 'Device',
  properties: {
    id: 'string?',
    status: 'string?',
    deviceType: 'string?',
    uuid: 'string?',
    token: 'string?',
    endPointArn: 'string?',
  },
};

const UserSchema = {
  name: 'User',
  properties: {
    id: 'string?',
    email: 'string?',
    userName: 'string?',
    careId: 'string?',
    media: 'S3Object?',
    phoneNumber: 'string?',
    notification: 'bool?',
    devices: {
      type: 'list',
      objectType: 'Device'
    },
    online: 'bool?',
    lastSeen: 'string?',
    hospitalName: 'string?',
    hospitalAddress: 'string?',
    isDnd: 'bool?',
    dndFrom: 'string?',
    dndTo: 'string?',
    homeNumber: 'string?',
  },
};

const BlockedSchema = {
  name: 'BlockedContact',
  properties: {
    blockedBy: 'string?',
    blocked: 'string?',
  },
};

const RoomWiseMsgSchema = {
  name: 'RoomsWiseMsg',
  primaryKey: 'id',
  properties: {
    id: 'string',
    messages: {
      type: 'list',
      objectType: 'Message'
    },
  },
};

const RoomSchema = {
  name: 'Rooms',
  primaryKey: 'id',
  properties: {
    id: 'string',
    roomName: 'string?',
    blockedContact: {
      type: 'list',
      objectType: 'BlockedContact'
    },
    removedUsers: 'string?[]',
    admin: 'User?',
    type: 'int?',
    icon: 'S3Object?',
    members: {
      type: 'list',
      objectType: 'User'
    },
    message: 'Message?',
    createdAt: 'date?',
    room: 'string?',
    localId: 'string?',
    updatedAt: 'date?',
  },
};

const MyRoomSchema = {
  name: 'MyRoom',
  properties: {
    id: 'string',
    roomName: 'string?',
    blockedContact: {
      type: 'list',
      objectType: 'BlockedContact'
    },
    removedUsers: 'string?[]',
    admin: 'User?',
    type: 'int?',
    icon: 'S3Object?',
    members: {
      type: 'list',
      objectType: 'User'
    },
    message: 'Message?',
    createdAt: 'date?',
    room: 'string?',
    localId: 'string?',
    updatedAt: 'date?',
  },
};

var key = new Int8Array(64);
const RealmData = new Realm({
  schema: [RoomWiseMsgSchema, MyRoomSchema, RoomSchema, BlockedSchema, UserSchema, DeviceSchema, MediaSchema, MessageSchema, ReminderSchema, ReminderInviteSchema, AnnouncementSchema, SeenMessageSchema],
  encryptionKey: key,
  schemaVersion: 11,
  migration: (oldRealm, newRealm) => { },
});


// use to create single or multiple room
// pass isNew = true, if calling for first time after login or sign up
export const addRoomsToRealm = (value, isNew = false) => {
  RealmData.write(() => {
    console.log('isNew', isNew, value);
    if (isNew) {
      RealmData.deleteAll();
    }
    if (Array.isArray(value)) {
      value.map((item, index) => {
        if (item.roomName === 'You') {
          RealmData.create('MyRoom', item);
        } else {
          if (item.type === enums.PRIVATEID && item.members?.length > 0) {
            let myRoom = RealmData.objects('MyRoom');
            let myId = myRoom[0].members[0].id;
            let user = item.members.filter(user => user.id !== myId);
            item.roomName = user[0].userName || item.members[0].userName;
            item.members = user || item.members;
          }
          console.log('room to store', item);
          RealmData.create('Rooms', item);
        }
      });
    } else {
      try {
        if (value.type === enums.PRIVATEID && value.members?.length > 0) {
          let myRoom = RealmData.objects('MyRoom');
          let myId = myRoom[0].members[0].id;
          let user = value.members.filter(user => user.id !== myId);
          value.roomName = user[0].userName || value.members[0].userName;
          value.members = user || value.members;
        }
        if(value.type === enums.GROUPID) {
          if (value.message === undefined) {
            value.message = {};
          }
        }
        console.log('room to store', value);
        RealmData.create('Rooms', value);
      } catch (e) {
        console.log(e);
      }
    }
  });
};

export const getDataFromRealm = (schema) => {
  const CurrentData = RealmData.objects(schema);
  console.log('data', JSON.parse(JSON.stringify(CurrentData)));
  if (CurrentData && CurrentData.length > 0) {
    return CurrentData;
  } else {
    return [];
  }
};

// use to create single or multiple room for message
// pass isNew = true, if calling for first time after login or sign up
export const addRoomWiseMessageToRealm = (value) => {
  RealmData.write(() => {
    if (Array.isArray(value)) {
      value.map((item, index) => {
        RealmData.create('RoomsWiseMsg', { id: item.room, messages: [] });
      });
    } else {
      let tempMsg = [];
      if (value.message && !isEmptyObj(value.message)) {
        tempMsg.push(value.message);
      }
      RealmData.create('RoomsWiseMsg', { id: value.room, messages: tempMsg });
    }
  });
};

export const getMessagesFromRealm = (id = null) => {
  if (id) {
    let currentRoom = RealmData.objects('RoomsWiseMsg').filtered(
      `id = '${id}'`
    );

    if (currentRoom && currentRoom.length > 0) {
      let Messages = JSON.parse(JSON.stringify(currentRoom[0].messages));
      console.log('Messages', currentRoom[0].messages.length, Messages);
      let msg = _.values(Messages);
      console.log('msg from lodash', msg);
      return msg;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const appendRoomWiseMessageToRealm = (roomId, value) => {
  RealmData.write(() => {
    if (value === null || value === undefined) {
      value = [];
    }
    if (roomId) {

      // const newMessages = item && item.messages && item.messages.filter((msg) => {
      //   if (msg && msg.sender && msg.sender.id !== loggedInUser) {
      //     if (msg.messageSeen) {
      //       if (msg && msg.messageSeen && msg.messageSeen.length !== 0) {
      //         return msg.messageSeen[0] && !msg.messageSeen[0].seen
      //       }
      //     }
      //     return false
      //   } else {
      //     return false
      //   }
      // }).length
      // item.newMessages = newMessages

      let CurrentRooms = RealmData.objects('RoomsWiseMsg').filtered(
        `id = '${roomId}'`
      );
      if (CurrentRooms.length > 0) {
        console.log('currentRoom', CurrentRooms.length, JSON.parse(JSON.stringify(CurrentRooms)));
        if (Array.isArray(value)) {
          value.map((item, index) => {
            if (item.reminder?.invites === null) {
              item.reminder.invites = [];
            }
            CurrentRooms[0].messages.push(item);
          });
        } else {
          if (value.reminder?.invites === null) {
            value.reminder.invites = [];
          }
          CurrentRooms[0].messages.push(value);
        }
        console.log('appendMessages', JSON.parse(JSON.stringify(CurrentRooms)));
      } else {
        RealmData.create('RoomsWiseMsg', { id: roomId, messages: value });
      }
    }
  });
};

export const sortRoomByDate = () => {
  const filteredData = RealmData.objects('Rooms').sorted('message.sentAt', true);

  let Rooms = JSON.parse(JSON.stringify(filteredData));
  console.log('filteredData', filteredData.length, Rooms);
  let groupArrays = [];

  if (filteredData.length > 0) {
    groupArrays = Object.keys(Rooms).map(user => {
      let temp = [];
      temp.push(Rooms[user].members[0]);
      Rooms[user].members = temp;
      return Rooms[user];
    });
    console.log('groupArrays', groupArrays);
    return groupArrays;
  }
  return [];
};

export const getMyRoom = () => {
  const myRoom = RealmData.objects('MyRoom');
  if (myRoom && myRoom.length > 0) {
    console.log('myRoom', JSON.parse(JSON.stringify(myRoom[0])));
    return myRoom[0];
  } else {
    return [];
  }
};

export const getLatestRoomId = () => {
  const sortedData = RealmData.objects('Rooms').sorted('createdAt', true);
  if (sortedData && sortedData.length > 0) {
    console.log('getLatestRoomId', sortedData[0].id);
    return sortedData[0].id;
  } else {
    return '';
  }
};

export const getLastMessageIdFromRoom = (roomId) => {
  let currentRoom = RealmData.objects('RoomsWiseMsg').filtered(
    `id = '${roomId}'`
  );
  if (currentRoom && currentRoom.length > 0) {
    let messages = currentRoom[0].messages;
    console.log('getLastMessageIdFromRoom', messages);
    if (messages && messages.length > 0) {
      let length = messages.length - 1
      return messages[length].id;
    } else {
      return '';
    }
  } else {
    return '';
  }
};

export const searchRoom = (key) => {
  const search = RealmData.objects('Rooms').filtered(
    `roomName CONTAINS[c] '${key}'`,
  );

  console.log('search', key, JSON.parse(JSON.stringify(search)));
  return search;
};

export const updateRoomToRealm = (value) => {
  RealmData.write(() => {
    const CurrentRoom = RealmData.objects('Rooms').filtered(
      `id = '${value.id}'`,
    );
    if (CurrentRoom && CurrentRoom.length > 0) {
      if (value.type === enums.PRIVATEID && value.members?.length > 0) {
        value.roomName = value.members[0].userName;
      }
      console.log('updateRoom', JSON.parse(JSON.stringify(CurrentRoom)));
      return CurrentRoom[0] = value;
    }
  });
};

export const updateLastMessageInRoom = (room, value) => {
  RealmData.write(() => {
    const CurrentRoom = RealmData.objects('Rooms').filtered(
      `room = '${room}'`,
    );
    if (CurrentRoom && CurrentRoom.length > 0) {
      CurrentRoom[0].message = value;
      console.log('updateRoom', JSON.parse(JSON.stringify(CurrentRoom)));
    }
  });
};

export const updateMessageToRealm = (message) => {
  const msgReceiver = message.receiver || {};
  message.receiver = msgReceiver;
  console.log(message, 'message in updateMessageToRealm')

  RealmData.write(() => {
    let roomId = message.room;
    let msgId = message._id || message.id;
    const CurrentRoom = RealmData.objects('RoomsWiseMsg').filtered(
      `id = '${roomId}'`,
    );
    console.log(CurrentRoom.length, 'CurrentRoom length')
    if (CurrentRoom.length > 0) {
      let msgIndex = CurrentRoom[0].messages.findIndex((item, index) => {
        return (item.id === msgId);
      });
      console.log("msgIndex, ", msgIndex);


      if (msgIndex !== -1) {
        CurrentRoom[0].messages[msgIndex] = message;
      } else {
        try {
          console.log('message to add in realm', message);
          
          CurrentRoom[0].messages.push(message);
          let RoomMsg = RealmData.objects('RoomsWiseMsg');
          console.log('updating room...', JSON.parse(JSON.stringify(RoomMsg)));
        } catch (e) {
          console.log('fail to push data in message', e);
        }
      }
    } else {
      let tempArr = [];
      tempArr.push(message);
      RealmData.create('RoomsWiseMsg', { id: roomId, messages: tempArr });
    }
  });
};

export const filterMediaFromRealm = (roomId) => {
  const CurrentRoom = RealmData.objects('RoomsWiseMsg').filtered(
    `id = '${roomId}'`,
  );
  console.log('filter media from', JSON.parse(JSON.stringify(CurrentRoom)));
  let RoomMedia = [];
  if (CurrentRoom.length > 0) {
    const cRoom = CurrentRoom[0];
    RoomMedia = cRoom.messages.filtered(
      `metaType = 4`,
    );
  }
  let media = JSON.parse(JSON.stringify(RoomMedia));
  console.log('filter media from: RoomMedia', media);
  let msg = _.values(media);
  console.log('RoomMedia...', RoomMedia.length, msg);
  return msg;
};