import {View, Text, StyleSheet, Pressable, Alert, Modal} from 'react-native';
import React from 'react';

const ModalView = (props) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.open}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          props.setOpen(!Open);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.setOpen(!props.open)}>
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
            
            <View>
              <View>
                <Text style={{color: "green", fontSize: 20, fontWeight: "700"}}>Your meeting has been created successfully!</Text>
              </View>
              <View>
                <Text selectable={true}>Meeting id: {props?.popupFields?.meeting_id}</Text>
              </View>
              <View>
                <Text selectable={true}>Meeting passcode: {props.popupFields?.passcode}</Text>
              </View>
              <View>
                <Text selectable={true}>Meeting URL: {props.popupFields?.joinURL}</Text>
              </View>
              <View>
              <Pressable onPress={() => props.setSelectedScreen("JoinMeeting")}
              style={[
                { marginTop: 5,
                  backgroundColor: '#F194FF',
                  paddingHorizontal: 25,
                  paddingVertical: 7,
                  borderRadius: 10,
                },
              ]}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Start Meeting
              </Text>
            </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalView;

const styles = StyleSheet.create({
  centeredView: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    position: 'absolute',
    top: 3,
    right: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'white',
  },
  textStyle: {
    color: '#2196F3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
