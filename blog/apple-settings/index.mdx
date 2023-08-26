# Custom Apple Settings UI with Expo

> Generating an iOS [Settings Bundle][apple-docs] and sharing settings with your app.

As someone who's constantly in the pursuit of making the most native possible user experience, I often find myself working with pretty obscure native APIs. Today, I'll be sharing my experience of adding custom native UI to my Apple app's page in the native Settings app.

Before we begin, I'll be the first to say that unless you're building the [Blackbox app][blackbox], custom Apple Settings UI should probably not be a release-blocking feature for your app. The usefulness is questionable, and the value is fleeting. However, if you over-index on native app quality, then this post is for you.

## The Goal

Many years ago, I built a small video game, Pillar Valley, that I now pump full of whatever native functionality I stumble across. It has haptics, native navigation controllers, full universal linking, quick notes, Apple Handoff, password sharing, custom app icons, runs on iOS, Android and web, and is optimized for start-up by using Hermes (no JavaScript runs on-device on native platforms). All the features you expect when downloading a single-tap video game from the store.

As you can imagine, when I learned I could duplicate the in-app settings page in the native system settings, I leaped at the opportunity.

The goal was to add the following pages to the system settings:

- The app version and build number.
- Some shared interactive setting. I landed on a switch for toggling the in-app audio.
- A custom page with third-party licenses and attribution. Sometimes these show up in the setting search and I thought it'd be cool if I saw some of my friends pop up in there from time to time.
- Finally, I wanted a page with preset fields that would be updated on app-launch. I planned to use this page to display remote config info for the particular launch of the app.

## Implementation

> Why do in an hour what you could do in a day. ~Untitled Software Developer.

Adding the settings is a process that involves using some obscure plists in a particular order, then linking those plists with strings files for localization. Some values are localizable, others aren't. Finally, building the app a bunch of times to validate the "types".

There are three core concepts involved:

- **Plist** files (xml) in a `Settings.bundle` (special directory). There must be a `Settings.bundle/Root.plist` which defines the content that shows in the main app settings page. `Root.plist` can link to other plist files.
- **Strings** files for localization. You can add a strings file for any of Apple's supported languages (cite needed, not interested in finding), and define a key/value pair for an ID that maps to a display value, e.g. `welcome = Bon Jour!`.
- **NSUserDefaults** for reading and writing data at runtime. This is an API that serves many purposes. It can persist data between runs, share data between apps in an [app group](https://developer.apple.com/documentation/xcode/configuring-app-groups), and apparently read/write native settings.

One unique attribute that all three of these APIs share is that I hate using them. Plist files are just overcomplicated JSON files, strings are just overcomplicated JSON, `NSUserDefaults` is fine but the API does have a lot of weird caveats to support all the various use-cases that it serves, e.g. defaults are inconsistent, caching is complicated and under-documented, etc.

Not to mention, these are all unique to the various other aspects of my app. Ultimately, introducing a bunch of unique systems will make upgrading harder and the project more difficult to maintain. If you contrast this complexity with the user value that it adds and divide that by the amount of attention I want to give the project, it's a **no deal**.

So the challenge here is to reduce the cognitive overhead such that the amount of value users get (near none) is roughly equal to the amount of time it takes for a developer to implement. Additionally, I want a page for third-party licenses that would need to be manually updated/unified every time I update, add, or remove a library––sounds like a nightmare.

This is where Expo Config Plugins really shine.

## Enter Expo

With an Expo Config Plugin, I could generate the plist and strings files with TypeScript. I could also add full autocomplete for every aspect of the feature, this would reduce the time-to-failure drastically by moving the validation from an Xcode build (infinity time) to a TypeScript validation error (milliseconds).

I could also remodel the API to match the native API. Since I'd be working with React Native, I could add models that matched the React Native code. For example, a setting the value in `<Switch />` would be `DefaultValue` in Settings.bundle, and `value` in React Native, we could use Config Plugins to unify these, further reducing the cognitive overhead.

Finally, we could use the `npx expo prebuild` step to generate complex pages at build-time, this would prove useful for the **licenses page** which could potentially have hundreds of values.

### Config Plugin API

Unlike typical Expo Config Plugins, which are often used via JSON, this one would be a TypeScript-first plugin that would use data models that you'd import from the config plugin.

```ts app.config.ts
import withAppleSettings, {
  ChildPane,
  Group,
  Switch,
  Title,
} from '@config-plugins/apple-settings';

module.exports = ({ config }) => {
  return withAppleSettings(config, {
    // The name of the .plist file to generate. Root is the default and must be provided.
    Root: {
      // The page object is required. It will be used to generate the .plist file.
      // The contents will be converted directly to plist.
      page: {
        // The `PreferenceSpecifiers` defines the UI elements to generate.
        PreferenceSpecifiers: [
          // Child panes can be used to create nested pages.
          Switch({
            title: 'Music and Sound ♫',
            // The NSUserDefaults ID.
            key: 'p_inapp_audio',
            value: true,
          }),
        ],
      },
    },
  });
};
```

Each model `Title`, `Switch`, `Slider`, etc. would work like a React view. I considered implementing a custom React reconciler for this but ultimately decided against it since it would introduce a lot of unavailable API like `children`, e.g.

```jsx
// Alternative React API:

export default function Root() {
  return (
    <Page>
      <Switch>
        {/* This wouldn't be allowed, and the error would come much later. Decreasing iteration speed. */}
        <div />
      </Switch>
    </Page>
  );
}
```

Could you imagine if I actually shipped this though, haha.

### Type Safety

Unlike most of Apple's configuration-based feature, Settings.bundle is actually suprisingly really well typed/documented. The first thing I did was create a [JSON schema][apple-settings-json] then I generated TypeScript types based on the JSON schema, this ensured I could extract as much validation as possible out of Xcode and into the "user"-space.

> TypeScript generation command: `npx json2ts -i ./schema.json -o ./src/schema.d.ts --additionalProperties=false --unknownAny=false`

With this, we had perfect autocomplete for every field, and full static validation + standardized errors across the entire system.

### Data Sharing

In React Native, this is pretty straightforward as `NSUserDefaults` is already exposed via the `Settings` module.

```ts
import { Settings } from 'react-native';

// Reads from the Settings.bundle
const switchValue = Boolean(Settings.get('p_inapp_audio'));
```

I paired this with [Zustand][zustand] using `"zustand/middleware"` to sync the in-app toggle with the system settings toggle.

### Licenses page

To generate the licenses page, we generate a JSON file with all the third-party licenses data:

> Licenses generation command: `npx npm-license-crawler --onlyDirectDependencies --dependencies --json src/constants/Licenses.json`

Then I used the the config plugin to create a licenses page with the third-party licenses JSON:

```ts app.config.ts
import withAppleSettings, {
  ChildPane,
  Group,
  Title,
} from '@config-plugins/apple-settings';

module.exports = ({ config }) => {
  return withAppleSettings(config, {
    Root: {
      page: {
        PreferenceSpecifiers: [
          // Add a link to a `Licenses` page.
          ChildPane({
            title: 'Licenses',
            // Link to the `Settings.bundle/Licenses.plist` file.
            file: 'Licenses',
          }),
        ],
      },
    },
    // This will generate a `Settings.bundle/Licenses.plist`.
    Licenses: {
      page: {
        PreferenceSpecifiers: [
          Group({
            // This text shows up on top of the group.
            title: 'Licenses',
            // This text shows at the bottom.
            footerText: 'Welcome to the bottom of the licenses page, silly.',
          }),
          ...Object.entries(
            require('./src/constants/Licenses.json') as Record<string, any>
          ).map(([name, info], index) =>
            // Add an entry for each license.
            Title({
              // Name of library.
              title: name,
              key: 'license_' + index,
              // Type of license.
              value: info.licenses,
            })
          ),
        ],
      },
    },
  });
};
```

## Conclusion

We now have a fully-typed, and script-able system to generate complex native settings pages with ease, entirely with clean-up built-in so I can remove it in the future if I ever come to my senses.

Now my app feels just a little bit more native and I didn't have to compromise on upgradability or maintainability.

Thanks for reading.

[apple-docs]: https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/Preferences/Preferences.html
[apple-settings-json]: https://github.com/EvanBacon/Apple-Settings-Expo-Config-Plugin/blob/4faa2dd820ad7e0f51202baeacce8fc0507d3b78/settings-plugin/schema/SettingsPlist.json#L1
[zustand]: https://github.com/pmndrs/zustand
[blackbox]: https://www.blackboxpuzzles.com/
