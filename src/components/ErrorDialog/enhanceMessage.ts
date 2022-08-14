// This function is used to provide error messages to the user that are
// different than the error messages provided by the SDK.
export default function enhanceMessage(message = '', code?: number) {
  switch (code) {
    case 20101: // Invalid token error
      return message + '. Please make sure you are using the correct credentials.';
    case 20104: // Invalid token error
      return 'Room is expired 房間已過期';
    case 53105: // Invalid token error
      return 'Room contains too many Participants 房間人數已達到上限';
    default:
      return message;
  }
}
