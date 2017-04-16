
#import "SafariViewManager.h"
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#import <React/RCTConvert.h>

@implementation SafariViewManager

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

//MARK: External API

RCT_EXPORT_METHOD(show:(NSURL *)url
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    UIColor *controlTintColor = [RCTConvert UIColor:options[@"preferredControlTintColor"]];
    UIColor *barTintColor = [RCTConvert UIColor:options[@"preferredBarTintColor"]];
    BOOL fromBottom = [options[@"fromBottom"] boolValue];
    BOOL entersReader = [options[@"entersReaderIfAvailable"] boolValue];

    // Initialize the Safari View
    self.safariView = [[SFSafariViewController alloc] initWithURL:url entersReaderIfAvailable:entersReader];
    self.safariView.delegate = self;

    // Set tintColor if available
    if (controlTintColor) {
        self.safariView.preferredControlTintColor = controlTintColor;
    }

    // Set barTintColor if available
    if (barTintColor) {
        self.safariView.preferredBarTintColor = barTintColor;
    }

    // Set modal transition style
    if (fromBottom) {
        self.safariView.modalPresentationStyle = UIModalPresentationOverFullScreen;
    }

    UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

    // Cycle through view controllers to get the view closest to the foreground
    while (ctrl.presentedViewController) {
        ctrl = ctrl.presentedViewController;
    }

    // Display the Safari View
    [ctrl presentViewController:self.safariView animated:YES completion:^{
        resolve(nil);
    }];
}

RCT_EXPORT_METHOD(dismiss)
{
    [self.safariView dismissViewControllerAnimated:true completion:nil];
}


//MARK: RCTEventEmitter
-(void)startObserving {
    self.hasListeners = YES;
}

-(void)stopObserving {
    self.hasListeners = NO;
}

-(NSArray<NSString *> *)supportedEvents {
    return @[@"completeInitialLoad",@"finish"];
}


//MARK: SFSafariViewControllerDelegate

- (void)safariViewController:(SFSafariViewController *)controller
      didCompleteInitialLoad:(BOOL)didLoadSuccessfully;
{
    if (self.hasListeners) {
        [self sendEventWithName:@"completeInitialLoad" body:nil];
    }
}

-(void)safariViewControllerDidFinish:(nonnull SFSafariViewController *)controller
{
    if (self.hasListeners) {
        [self sendEventWithName:@"finish" body:nil];
    }
}

@end
