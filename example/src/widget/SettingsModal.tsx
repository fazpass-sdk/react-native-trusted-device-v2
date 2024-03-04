import * as React from 'react';

import { View, Button, Modal, StyleSheet, Switch, Text } from 'react-native';
import Fazpass, { FazpassSettings, FazpassSettingsBuilder, SensitiveData } from 'react-native-trusted-device-v2';
import type { LocalSettings } from '../LocalSettings';

type Props = {
    location: boolean
    vpn: boolean
    simInformation: boolean
    highBiometric: boolean
    modalVis: boolean
    onClose: () => void
    onSave: (settings: LocalSettings) => void
}

const TitledSwitch = ({title, onValueChange, value}: 
    {title: string, onValueChange: (value: boolean) => void, value: boolean | undefined}) => (<View style={{
      flexDirection: 'row'
    }}>
      <Switch 
        onValueChange={onValueChange}
        value={value}
      ></Switch>
      <Text style={{ paddingLeft: 8 }}>{title}</Text>
    </View>)

const SettingsModal = (props: Props) => {
    const [location, setLocation] = React.useState<boolean>(props.location)
    const [vpn, setVpn] = React.useState<boolean>(props.vpn)
    const [simInformation, setSimInformation] = React.useState<boolean>(props.simInformation)
    const [highBiometric, setHighBiometric] = React.useState<boolean>(props.highBiometric)

    return (<Modal
      animationType='fade'
      transparent={true}
      visible={props.modalVis}
      onRequestClose={props.onClose}>
        <View style={styles.modal}>
          <View style={styles.modalInside}>
            <TitledSwitch 
              title='Location'
              onValueChange={setLocation}
              value={location}
            />
            <TitledSwitch 
              title='VPN'
              onValueChange={setVpn}
              value={vpn}
            />
            <TitledSwitch 
              title='Sim Information'
              onValueChange={setSimInformation}
              value={simInformation}
            />
            <TitledSwitch 
              title='High-level Biometric'
              onValueChange={setHighBiometric}
              value={highBiometric}
            />
            <Button
              title='Save'
              onPress={ () => {
                const enabled: SensitiveData[] = []
                const disabled: SensitiveData[] = []

                if (location) enabled.push(SensitiveData.location)
                else disabled.push(SensitiveData.location)
                if (vpn) enabled.push(SensitiveData.vpn)
                else disabled.push(SensitiveData.vpn)
                if (simInformation) enabled.push(SensitiveData.simOperatorsAndNumbers)
                else disabled.push(SensitiveData.simOperatorsAndNumbers)

                let builder = new FazpassSettingsBuilder()
                  .enableSelectedSensitiveData(enabled)
                  .disableSelectedSensitiveData(disabled)
                
                if (highBiometric) {
                  builder = builder.setBiometricLevelToHigh()
                  Fazpass.instance.generateNewSecretKey()
                }
                
                Fazpass.instance.setSettings(0, FazpassSettings.fromBuilder(builder)).then((_) => {
                  props.onSave({location: location, vpn: vpn, simInformation: simInformation, highBiometric: highBiometric})
                })
              }}
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

export default SettingsModal;