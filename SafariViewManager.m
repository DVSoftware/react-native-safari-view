
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

RCT_EXPORT_METHOD(show:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback)
{
    UIColor *tintColorString = args[@"tintColor"];
    UIColor *barTintColorString = args[@"barTintColor"];
    BOOL fromBottom = [args[@"fromBottom"] boolValue];

    // Error if no url is passed
    if (!args[@"url"]) {
        RCTLogError(@"[SafariView] You must specify a url.");
        return;
    }

    // Initialize the Safari View
    self.safariView = [[SFSafariViewController alloc] initWithURL:[NSURL URLWithString:args[@"url"]] entersReaderIfAvailable:args[@"readerMode"]];
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
    [ctrl presentViewController:self.safariView animated:YES completion:nil];
}

RCT_EXPORT_METHOD(isAvailable:(RCTResponseSenderBlock)callback)
{
    if ([SFSafariViewController class]) {
        // SafariView is available
        return callback(@[[NSNull null], @true]);
    } else {
        return callback(@[RCTMakeError(@"[SafariView] SafariView is unavailable.", nil, nil)]);
    }
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
