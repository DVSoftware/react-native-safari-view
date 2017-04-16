
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

RCT_EXPORT_METHOD(show:(NSDictionary *)args
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSURL *url = [NSURL URLWithString:args[@"url"]];
    UIColor *tintColorString = args[@"tintColor"];
    UIColor *barTintColorString = args[@"barTintColor"];
    BOOL fromBottom = [args[@"fromBottom"] boolValue];
    BOOL entersReaderIfAvailable = [args[@"readerMode"] boolValue];

    // Error if no url is passed
    if (!args[@"url"]) {
        RCTLogError(@"[SafariView] You must specify a url.");
        return;
    }

    // Initialize the Safari View
    self.safariView = [[SFSafariViewController alloc] initWithURL:url entersReaderIfAvailable:entersReaderIfAvailable];
    self.safariView.delegate = self;

    // Set tintColor if available
    if (tintColorString) {
        UIColor *tintColor = [RCTConvert UIColor:tintColorString];
        if ([self.safariView respondsToSelector:@selector(setPreferredControlTintColor:)]) {
            [self.safariView setPreferredControlTintColor:tintColor];
        } else {
            [self.safariView.view setTintColor:tintColor];
        }
    }

    // Set barTintColor if available
    if (barTintColorString) {
        UIColor *barTintColor = [RCTConvert UIColor:barTintColorString];
        if ([self.safariView respondsToSelector:@selector(setPreferredBarTintColor:)]) {
            [self.safariView setPreferredBarTintColor:barTintColor];
        }
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
        resolve(@true);
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
