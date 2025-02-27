// Copyright 2015-present 650 Industries. All rights reserved.

#import <ABI44_0_0EXFont/ABI44_0_0EXFontManager.h>

@interface ABI44_0_0EXFontManager ()

@property (nonatomic, strong, readonly) NSMutableDictionary *registry;

@end

@implementation ABI44_0_0EXFontManager

- (instancetype)init
{
  if (self = [super init]) {
    _registry = [NSMutableDictionary dictionary];
  }
  return self;
}

- (ABI44_0_0EXFont *)fontForName:(NSString *)name
{
  return _registry[name];
}

- (void)setFont:(ABI44_0_0EXFont *)font forName:(NSString *)name
{
  _registry[name] = font;
}

@end
