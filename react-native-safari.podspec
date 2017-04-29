
Pod::Spec.new do |s|
  s.name             = "react-native-safari"
  s.version          = "2.1.4"
  s.summary          = "A React Native wrapper for Safari View Controller"
  s.requires_arc = true
  s.author       = { 'Naoufal Kadhom' => 'naoufalkadhom@gmail.com' }
  s.license      = 'MIT'
  s.homepage     = 'https://github.com/nfcampos/react-native-safari'
  s.source       = { :git => "https://github.com/nfcampos/react-native-safari.git" }
  s.platform     = :ios, "10.0"
  s.module_name  = 'SafariViewManager'
  s.dependency 'React'
  s.source_files     = "*.{h,m}"
  s.preserve_paths   = "*.js"
end
