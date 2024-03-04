import * as React from 'react';

import { View, Button, Modal, StyleSheet, Text } from 'react-native';
import { CrossDeviceRequest } from 'react-native-trusted-device-v2';

type Props = {
  request: CrossDeviceRequest | undefined
  onDecline: () => void
  onAccept: () => void
}

const LoginRequestModal = (props: Props) => {
    return (<Modal
      animationType='fade'
      transparent={true}
      visible={ props.request !== undefined }
      onRequestClose={props.onDecline}>
        <View style={styles.modal}>
          <View style={styles.modalInside}>
            <Text>Device {props.request?.deviceRequest.split(';', 2).join(', ')} is trying to login with your account. Accept?</Text>
            <Button
              title='Accept'
              onPress={props.onAccept}
            />
            <Button
              title='Decline'
              onPress={props.onDecline}
            />
          </View>
        </View>
    </Modal>)
};

const styles = StyleSheet.create({
    modal: {
      backgroundColor: '#3c3c3c60',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalInside: {
      padding: 20,
      borderRadius: 12,
      shadowColor: '#000000',
      elevation: 4,
      backgroundColor: '#555555'
    }
  });  

export default LoginRequestModal;