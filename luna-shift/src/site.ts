// Single place for links and contact details.
export const site = {
  name: 'Luna Shift',
  contactEmail: 'lunashiftsupport@gmail.com',
  privacyHref: '#privacy',
  /**
   * The App Store line stands in for a download button. The site has to exist before the
   * app can be submitted, so there is no link to point at yet. When the app is live,
   * set `appStoreHref` to its listing and every one of these turns back into a button.
   */
  appStoreNote: 'Live on the App Store',
  appStoreHref: null as string | null,
} as const

/** Product name with a non-breaking space so it never splits across lines. */
export const BRAND = 'Luna Shift'
