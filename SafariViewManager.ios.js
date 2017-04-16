// @flow

import React from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  processColor
} from 'react-native';
import shallowEqual from 'fbjs/lib/shallowEqual'

const SafariViewManager = NativeModules.SafariViewManager;
const moduleEventEmitter = new NativeEventEmitter(SafariViewManager);

/**
 * High-level docs for the SafariViewManager iOS API can be written here.
 */

let nrActiveInstances = 0

type Props = {
  initialUrl: string,
  entersReaderIfAvailable?: boolean,
  preferredBarTintColor?: string,
  preferredControlTintColor?: string,
  onCompleteInitialLoad?: (success: bool) => void,
  onFinish?: () => void,
}

export default class SafariView extends React.Component<void, Props, void> {
  static show(url, options={}) {
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
  }

  static dismiss() {
    SafariViewManager.dismiss();
  }

  static addEventListener(event, listener: Function) {
    return moduleEventEmitter.addListener(event, listener);
  }

  static removeEventListener(event, listener: Function) {
    return moduleEventEmitter.removeListener(event, listener);
  }

  noop = false
  dontDismissOnUnmount = false

  disableDismissOnUnmount = () => {
    this.dontDismissOnUnmount = true
  }

  componentWillMount() {
    if (nrActiveInstances++ > 0) {
      this.noop = true
      console.warn(`You can't mount more than on instance of SafariView simultaneously. All instanes other than the first are no-ops.`)
      return
    }

    const {initialUrl, onCompleteInitialLoad, onFinish, ...rest} = this.props

    SafariView.show(initialUrl, rest)
    SafariView.addEventListener('finish', this.disableDismissOnUnmount)

    if (onCompleteInitialLoad) {
      SafariView.addEventListener('completeInitialLoad', onCompleteInitialLoad)
    }

    if (onFinish) {
      SafariView.addEventListener('finish', onFinish)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.noop) {
      return
    }

    if (shallowEqual(nextProps, this.props)) {
      return
    }

    console.warn("SafariView doesn\'t support updating props after initial render.")
  }

  componentWillUnmount() {
    --nrActiveInstances

    if (this.noop || this.dontDismissOnUnmount) {
      return
    }

    SafariView.dismiss()
  }

  render() {
    return null
  }
};
