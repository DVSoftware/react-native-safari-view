// @flow

import React from "react";
import { NativeModules, NativeEventEmitter, processColor } from "react-native";
import shallowEqual from "fbjs/lib/shallowEqual";

const SafariViewManager = NativeModules.SafariViewManager;
const moduleEventEmitter = new NativeEventEmitter(SafariViewManager);

/**
 * High-level docs for the SafariViewManager iOS API can be written here.
 */

let nrActiveInstances = 0;

type Props = {
  initialUrl: string,
  entersReaderIfAvailable?: boolean,
  preferredBarTintColor?: string,
  preferredControlTintColor?: string,
  onCompleteInitialLoad?: (success: boolean) => void,
  onFinish?: () => void
};

type EventType = "completeInitialLoad" | "finish";

export default class SafariView extends React.Component<void, Props, void> {
  static show(url, options = {}) {
    const {
      preferredControlTintColor,
      preferredBarTintColor,
      entersReaderIfAvailable,
      fromBottom
    } = options;

    return SafariViewManager.show(url, {
      preferredControlTintColor: processColor(preferredControlTintColor),
      preferredBarTintColor: processColor(preferredBarTintColor),
      entersReaderIfAvailable,
      fromBottom
    });
  }

  static dismiss() {
    SafariViewManager.dismiss();
  }

  static addEventListener(event: EventType, listener: Function) {
    return moduleEventEmitter.addListener(event, listener);
  }

  static removeEventListener(event: EventType, listener: Function) {
    return moduleEventEmitter.removeListener(event, listener);
  }

  noop = false;
  dontDismissOnUnmount = false;

  disableDismissOnUnmount = () => {
    this.dontDismissOnUnmount = true;
  };

  unsubscribe: () => void;

  subscribeToEvents(onCompleteInitialLoad?: Function, onFinish?: Function) {
    SafariView.addEventListener("finish", this.disableDismissOnUnmount);

    if (onCompleteInitialLoad) {
      SafariView.addEventListener("completeInitialLoad", onCompleteInitialLoad);
    }

    if (onFinish) {
      SafariView.addEventListener("finish", onFinish);
    }

    return () => {
      SafariView.removeEventListener("finish", this.disableDismissOnUnmount);

      if (onCompleteInitialLoad) {
        SafariView.removeEventListener(
          "completeInitialLoad",
          onCompleteInitialLoad
        );
      }

      if (onFinish) {
        SafariView.removeEventListener("finish", onFinish);
      }
    };
  }

  componentWillMount() {
    if (nrActiveInstances++ > 0) {
      this.noop = true;
      console.warn(
        `You can't mount more than on instance of SafariView simultaneously. All instanes other than the first are no-ops.`
      );
      return;
    }

    const { initialUrl, onCompleteInitialLoad, onFinish, ...rest } = this.props;

    SafariView.show(initialUrl, rest);
    this.unsubscribe = this.subscribeToEvents(onCompleteInitialLoad, onFinish);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.noop) {
      return;
    }

    if (shallowEqual(nextProps, this.props)) {
      return;
    }

    console.warn(
      "SafariView doesn't support updating props after initial render."
    );
  }

  componentWillUnmount() {
    --nrActiveInstances;

    if (this.noop) {
      return;
    }

    this.unsubscribe();

    if (!this.dontDismissOnUnmount) {
      SafariView.dismiss();
    }
  }

  render() {
    return null;
  }
}
