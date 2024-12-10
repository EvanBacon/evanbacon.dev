/** @type {import('@bacons/apple-targets').ConfigFunction} */
module.exports = config => ({
  type: 'widget',
  deploymentTarget: '17.0',
  images: {
    logo: '../../assets/widget-icon.png',
  },
  entitlements: {
    'com.apple.security.application-groups':
      config.ios.entitlements['com.apple.security.application-groups'],
  },
});
