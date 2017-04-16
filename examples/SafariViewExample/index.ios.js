'use strict';

import React, { Component } from 'react'
import {
  AlertIOS,
  AppRegistry,
  processColor,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import SafariView from 'react-native-safari-view';

class SafariViewExample extends Component {
  componentDidMount() {
    this.showSubscription= () => {
      console.log("SafariView onShow")
    };
    this.dismissSubscription = () => {
      console.log("SafariView onDismiss");
    };
    SafariView.addEventListener("completeInitialLoad", this.showSubscription);
    SafariView.addEventListener("finish", this.dismissSubscription);
  }

  componentWillUnmount() {
    SafariView.removeEventListener("completeInitialLoad", this.showSubscription);
    SafariView.removeEventListener("finish", this.dismissSubscription);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          react-native-safari-view
        </Text>
        <Text style={styles.instructions}>
          github.com/naoufal/react-native-safari-view
        </Text>
        <TouchableHighlight
          style={styles.btn}
          onPress={this._clickHandler}
          underlayColor="#0380BE"
          activeOpacity={1}
        >
          <Text style={{
            color: '#fff',
            fontWeight: '600'
          }}>
            Show Safari View
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  _clickHandler() {
    SafariView.show('http://twitter.com/naoufal', {
      entersReaderIfAvailable: true,
      preferredControlTintColor: "green",
      preferredBarTintColor: "orange",
      fromBottom: true,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    margin: 10,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center'
  },
  instructions: {
    marginBottom: 5,
    color: '#333333',
    fontSize: 13,
    textAlign: 'center'
  },
  btn: {
    borderRadius: 3,
    marginTop: 200,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#0391D7'
  }
});

AppRegistry.registerComponent('SafariViewExample', () => SafariViewExample);
