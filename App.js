import React, {useState, useCallback} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import WebView from 'react-native-webview';
import CookieManager from '@react-native-community/cookies';

const url = 'https://test.com';
const name = 'test';

const App = () => {
  const [nsCookieValues, setNsCookieValues] = useState([]);
  const [wkCookieValues, setWkCookieValues] = useState([]);

  const clearCookie = useCallback(async (useWebKit) => {
    setNsCookieValues([]);
    setWkCookieValues([]);
    CookieManager.clearByName(url, name, useWebKit);
  }, []);

  const setCookie = useCallback(async (useWebKit) => {
    CookieManager.set(
      url,
      {name, value: 'set', expires: '2030-01-01T12:00:00.00Z'},
      useWebKit,
    );
    let i = 0;
    while (i++ < 30) {
      CookieManager.get(url).then((cookies) =>
        setNsCookieValues((prev) => [...prev, cookies[name]?.value]),
      );
      CookieManager.get(url, true).then((cookies) =>
        setWkCookieValues((prev) => [...prev, cookies[name]?.value]),
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{html: '<p style="background: #eee; height: 100%;">Page</p>'}}
          // sharedCookiesEnabled={true} // Same behavior with or without this
        />
      </View>

      <View style={styles.horizontal}>
        <View style={styles.half}>
          <Button title="Clear NS Cookie" onPress={() => clearCookie(false)} />
        </View>
        <View style={styles.half}>
          <Button title="Clear WK Cookie" onPress={() => clearCookie(true)} />
        </View>
      </View>

      <View style={styles.horizontal}>
        <View style={styles.half}>
          <Button title="Set NS Cookie" onPress={() => setCookie(false)} />
        </View>
        <View style={styles.half}>
          <Button title="Set WK Cookie" onPress={() => setCookie(true)} />
        </View>
      </View>

      <View style={styles.horizontal}>
        <View style={styles.half}>
          {nsCookieValues.map((value, i) => (
            <Text key={i}>{value ?? '-'}</Text>
          ))}
        </View>

        <View style={styles.half}>
          {wkCookieValues.map((value, i) => (
            <Text key={i}>{value ?? '-'}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: 200, backgroundColor: '#eeeeee'},
  horizontal: {flexDirection: 'row'},
  half: {width: '50%', alignItems: 'center'},
});

export default App;
