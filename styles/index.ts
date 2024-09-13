import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    backgroundColor: COLORS.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textColor,
  },
  input: {
    height: 40,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: COLORS.textColor,
    backgroundColor: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nestedInput: {
    flex: 1,
    height: 40,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    paddingHorizontal: 8,
    color: COLORS.textColor,
  },
  listItem: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  listItemText: {
    color: COLORS.listItemTextColor,
    fontWeight: 'normal',
    fontSize: 16,
  },
  listObject: {
    backgroundColor: 'inherit',
  },
  listObjectText: { 
    color: COLORS.listObjectTextColor,
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  nestedListItemText: {
    color: COLORS.nestedListItemTextColor,
    fontSize: 14,
  },
  dropdown: {
    padding: 8,
    backgroundColor: COLORS.headerBackgroundColor,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderColor,
  },
  nestedListItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  deleteButton: {
    backgroundColor: COLORS.deleteButtonBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: COLORS.deleteButtonTextColor,
    fontWeight: 'bold',
  },
  addIcon: {
    marginLeft: 30,
    marginRight: 20,
  },
  editButton: {
    padding: 10,
    backgroundColor: COLORS.editButtonBackgroundColor,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  leftAction: {
    backgroundColor: 'red', // Example color
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  normalText: {
    fontWeight: 'normal',
    color: 'white',
  },
});

export default styles;
