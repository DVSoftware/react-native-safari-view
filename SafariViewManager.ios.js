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
  show(url, options={}) {
    const {
      preferredControlTintColor,
      preferredBarTintColor,
      entersReaderIfAvailable,
      fromBottom,
    } = options

    return SafariViewManager.show(url, {
      preferredControlTintColor: processColor(preferredControlTintColor),
      preferredBarTintColor: processColor(preferredBarTintColor),
      entersReaderIfAvailable,
      fromBottom,
    });
  },

  dismiss() {
    SafariViewManager.dismiss();
  },

  addEventListener(event, listener) {
    return moduleEventEmitter.addListener(event, listener);
  },

  removeEventListener(event, listener) {
    return moduleEventEmitter.removeListener(event, listener);
  }
};
