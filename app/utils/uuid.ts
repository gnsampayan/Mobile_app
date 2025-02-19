import uuid from 'react-native-uuid';

export const generateUUID = (): string => uuid.v4().toString();

// Add default export for Expo Router
const uuidUtils = {
  generateUUID,
};

export default uuidUtils;