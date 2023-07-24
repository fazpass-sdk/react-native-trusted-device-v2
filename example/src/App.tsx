import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Fazpass, { SensitiveData } from 'react-native-trusted-device-v2';

export default function App() {
  const [result, setResult] = React.useState<string | undefined>();

  const publicKeyAssetName = "my_public_key.pub";
  const enableFeatures = [SensitiveData.location, SensitiveData.simOperatorsAndNumbers]

  React.useEffect(() => {
    Fazpass.instance.init(publicKeyAssetName).then((_) => {
      Fazpass.instance.enableSelected(enableFeatures).then((_) => {
        Fazpass.instance.generateMeta().then(setResult)
      })
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
