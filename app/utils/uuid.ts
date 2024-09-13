import uuid from 'react-native-uuid';

export const generateUUID = (): string => uuid.v4().toString();
