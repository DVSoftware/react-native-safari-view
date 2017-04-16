import {
  NativeModules,
  NativeEventEmitter,
  processColor
} from 'react-native';

const SafariViewManager = NativeModules.SafariViewManager;
const moduleEventEmitter = new NativeEventEmitter(SafariViewManager);

/**
 * High-level docs for the SafariViewManager iOS API can be written here.
 */

export default {
  show(options) {
    if (options && options.tintColor) {
      options.tintColor = processColor(options.tintColor);
    }
    if (options && options.barTintColor) {
      options.barTintColor = processColor(options.barTintColor);
    }

    return SafariViewManager.show(options);
  },

  dismiss() {
    SafariViewManager.dismiss();
  },

  isAvailable() {
    return new Promise((resolve, reject) => {
      SafariViewManager.isAvailable((error) => {
        if (error) {
          return reject(error);
        }

        resolve(true);
      });
    });
  },

  addEventListener(event, listener) {
    return moduleEventEmitter.addListener(event, listener);
  },

  removeEventListener(event, listener) {
    return moduleEventEmitter.removeListener(event, listener);
  }
};
