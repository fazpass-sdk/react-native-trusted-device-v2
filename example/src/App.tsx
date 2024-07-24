import * as React from 'react';

import { StyleSheet, View, Text, FlatList, Button, Dimensions } from 'react-native';
import Fazpass, { CrossDeviceData, SensitiveData } from 'react-native-trusted-device-v2';
import { Data } from './Data';
import type { LocalSettings } from './LocalSettings';
import SettingsModal from './widget/SettingsModal';
import HttpRequest, { type CheckParams, Url, type EnrollParams, type ValidateParams, type RemoveParams } from './HttpRequest';
import LoginRequestModal from './widget/LoginRequestModal';

export default function App() {

  const [data, setData] = React.useState<Data[]>([]);
  const [settingsModalVis, setSettingsModalVis] = React.useState<boolean>(false);
  const [crossDeviceRequest, setCrossDeviceRequest] = React.useState<CrossDeviceData>();
  const [settings, setSettings] = React.useState<LocalSettings>({
    location: false,
    vpn: false,
    simInformation: false,
    highBiometric: false
  });

  const publicKeyAssetName = 'tdv2_showcase_public.pub';
  const iosFcmAppId = 'a';
  const phone = '082213681285';

  const meta = React.useRef('')
  const challenge = React.useRef('')
  const fazpassId = React.useRef('')

  const crossDeviceStream = React.useRef(Fazpass.instance.getCrossDeviceDataStreamInstance())
  const setLoggedIn = (loggedIn: boolean) => {
    if (loggedIn) {
      Fazpass.instance.getCrossDeviceDataFromNotification().then((request) => {
        if (request) {
          setCrossDeviceRequest(request)
        }
      })
      crossDeviceStream.current.listen((request) => {
        setCrossDeviceRequest(request)
      })
    } else {
      crossDeviceStream.current.close()
    }
  }

  React.useEffect(() => {
    Fazpass.instance.init(publicKeyAssetName, publicKeyAssetName, iosFcmAppId).then((_) =>
      Fazpass.instance.getSettings(0).then((s) => setSettings({
        location: s?.sensitiveData.includes(SensitiveData.location) ?? false, 
        vpn: s?.sensitiveData.includes(SensitiveData.vpn) ?? false, 
        simInformation: s?.sensitiveData.includes(SensitiveData.simOperatorsAndNumbers) ?? false, 
        highBiometric: s?.isBiometricLevelHigh ?? false, 
      }))
    );
  }, []);

  const contentRenderItem = ({item}: {item: Data}) => (
    <View style={styles.item}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 8}}>
        <Text style={{
          fontSize: 24,
          color: 'black'
        }}>{item.title}</Text>
        <Text style={{
          fontSize: 12,
          color: 'black'
        }}>{item.id.toString()}</Text>
      </View>
      <Text style={{
        fontSize: 16,
        color: 'black'
      }}>{item.content}</Text>
      { item.actions.map((action) => <View style={{marginTop: 8}}><Button 
      title={action.name}
      onPress={ () => {
        switch (action.url) {
          case Url.Check:
            new HttpRequest<CheckParams>(action.url).fetch({
              phone: phone,
              meta: meta.current
            }).then(
              (response) => {
                challenge.current = response.data.challenge
                fazpassId.current = response.data.fazpass_id

                if (response.data.status === true) {
                  setLoggedIn(true)
                }

                setData([
                  ...data, 
                  new Data('Check Response', JSON.stringify(response), [
                    {name: 'Enroll', url: Url.Enroll},
                    {name: 'Validate', url: Url.Validate},
                    {name: 'Remove', url: Url.Remove}
                  ])
                ])
              },
              (e) => {
                setData([
                  ...data,
                  new Data('Check Failed', e.toString(), [])
                ])
              }
            )
            break
          case Url.Enroll:
            new HttpRequest<EnrollParams>(action.url).fetch({
              phone: phone,
              meta: meta.current,
              challenge: challenge.current
            }).then(
              (response) => {
                fazpassId.current = response.data.fazpass_id

                setLoggedIn(true)

                setData([
                  ...data, 
                  new Data('Enroll Response', JSON.stringify(response), [])
                ])
              },
              (e) => {
                setData([
                  ...data,
                  new Data('Enroll Failed', e.toString(), [])
                ])
              }
            )
            break
          case Url.Validate:
            new HttpRequest<ValidateParams>(action.url).fetch({
              phone: phone,
              meta: meta.current,
              fazpass_id: fazpassId.current,
              challenge: challenge.current
            }).then(
              (response) => {
                setData([
                  ...data, 
                  new Data('Validate Response', JSON.stringify(response), [])
                ])
              },
              (e) => {
                setData([
                  ...data,
                  new Data('Validate Failed', e.toString(), [])
                ])
              }
            )
            break
          case Url.Remove:
            new HttpRequest<RemoveParams>(action.url).fetch({
              phone: phone,
              meta: meta.current,
              fazpass_id: fazpassId.current,
              challenge: challenge.current
            }).then(
              (response) => {
                setLoggedIn(false)

                setData([
                  ...data, 
                  new Data('Remove Response', JSON.stringify(response), [])
                ])
              },
              (e) => {
                setData([
                  ...data,
                  new Data('Remove Failed', e.toString(), [])
                ])
              }
            )
            break
        }
      }}
      /></View>) }
    </View>
  )

  return (
    <View style={styles.container}>
      <SettingsModal 
        location={settings.location} 
        vpn={settings.vpn} 
        simInformation={settings.simInformation} 
        highBiometric={settings.highBiometric} 
        modalVis={settingsModalVis} 
        onClose={ () => setSettingsModalVis(false) } 
        onSave={ (settings) => {
          setSettings(settings)
          setSettingsModalVis(false)
        }}
      />
      <LoginRequestModal 
        request={crossDeviceRequest}
        onAccept={() => {console.log('Request Accepted')}}
        onDecline={() => {console.log('Request Declined')}}
      />
      <FlatList 
        data={data}
        renderItem={contentRenderItem}
        keyExtractor={item => item.id.toString()}
        extraData={data}
        style={styles.content}
      />
      <View style={styles.action}>
        <Button
          title='Generate Meta'
          onPress={ () => 
            Fazpass.instance.generateMeta(0).then(
              (m) => {
                meta.current = m
                setData([
                  new Data('Generated Meta', m, [
                    {name: 'Check', url: Url.Check}
                  ])
              ])
              },
              (e) => {
                setData([new Data('Error Generating Meta', e.toString(), [])])
              }
            )
          }
        />
        <Button
          title='Settings'
          onPress={ () => {
            setSettingsModalVis(true)
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    flexDirection: 'column'
  },
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
  },
  item: {
    width: Dimensions.get('window').width - 16 - 16,
    height: 'auto',
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowColor: '#000000',
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16
  }
});
