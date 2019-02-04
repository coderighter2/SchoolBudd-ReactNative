import { StyleSheet } from 'react-native'
import Colors from '../Themes/Colors'

export const globalStyles = StyleSheet.create({
  modalContainer: {
    alignItems: 'stretch',
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.lightPurple,
    borderTopWidth: 25,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowColor: Colors.lightPurple,
  },
  modalTitle: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: 'bold',
  },
  defaultTextInput: {
    alignItems: 'center',
    width: '100%',
    minHeight: 40,
    marginBottom: 15,
    padding: 10,
    paddingVertical: 10,
    fontSize: 14,
    textDecorationLine: 'none',
    lineHeight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightPurple,
    backgroundColor: 'white',
    // flex: 1,
    // width: "100%",
    // fontSize: 20,
    // alignContent: "flex-start",
    // justifyContent: "flex-start",
    // textAlignVertical: "top",
    // margin: 12
  },
  btn: {
    alignItems: 'center',
    height: 40,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.lightPurple,
  },
  btnText: {
    color: 'white',
  },
})