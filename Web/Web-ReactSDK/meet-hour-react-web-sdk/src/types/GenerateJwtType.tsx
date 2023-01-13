export default interface GenerateJwtType {
    meeting_id: string
    contact_id?: number,
    ui_config?: {
      APP_NAME?: string
      DEFAULT_LOGO_URL?: string
      BRAND_WATERMARK_BACKGROUND?: string
      SHOW_MEET_HOUR_WATERMARK?: string
      MEET_HOUR_WATERMARK_LINK?: string
      MOBILE_APP_PROMO?: string
      MOBILE_DOWNLOAD_LINK_ANDROID?: string
      MOBILE_DOWNLOAD_LINK_IOS?: string
      NATIVE_APP_NAME?: string
      PROVIDER_NAME?: string
      ENABLE_MOBILE_BROWSER?: string
      APP_SCHEME?: string
      ANDROID_APP_PACKAGE?: string
      HIDE_DEEP_LINKING_LOGO?: string
      disablePrejoinHeader?: string
      disablePrejoinFooter?: string
      toolbar_buttons?: Array<string>
    },
    config?: {
      resolution?: number,
      videoheightideal?: number,
      videoheightmax?: number,
      videoheightmin?: number,
      videowidthideal?: number,
      videowidthmax?: number,
      videowidthmin?: number,
      startAudioMuted?: number,
      p2penabled?: boolean,
      fileRecordingsEnabled?: boolean,
      liveStreamingEnabled?: boolean,
      dropboxappKey?: string
      dropboxredirectURI?: string
      enableWelcomePage?: string
      enableClosePage?: string
      requireDisplayName?: string
      disableDeepLinking?: string
    }
  }