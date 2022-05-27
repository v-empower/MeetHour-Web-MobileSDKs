import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    margin: 10,
    height: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textInput: {
    borderRadius: 10,
    padding: 10,
    margin: 5,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007aff',
  },
  buttonText: {
    color: '#fff',
  },
  switch: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-between',
  },
  pressable: {
    width: '80%',
    borderRadius: 15,
    height: 50,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  pressableText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  meetHourViewContainer: {
    flex: 1,
  },
});

export default styles;
