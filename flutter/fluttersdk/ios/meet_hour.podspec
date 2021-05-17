#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint meet_hour.podspec' to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'meet_hour'
  s.version          = '0.0.1'
  s.summary          = 'Meet Hour Flutter Plugin'
  s.description      = <<-DESC
Meet Hour Plugin
                       DESC
  s.homepage         = 'https://meethour.io'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Meet Hour, LLC' => 'management@v-empower.com' }
  s.source           = { :path => '.' }
  s.source_files = 'Classes/**/*'
  s.dependency 'Flutter'
  s.dependency 'MeetHourSDK', '3.5.2'
  s.platform = :ios, '12.0'

  # Flutter.framework does not contain a i386 slice. Only x86_64 simulators are supported.
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'VALID_ARCHS[sdk=iphonesimulator*]' => 'x86_64' }
  s.swift_version = '5.0'
end
