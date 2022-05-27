---
id: dev-guide-android-sdk
title: Meet Hour Android SDK
---

The Meet Hour Android SDK provides the same user experience as the Meet Hour app,
in a customizable way which you can embed in your apps.

## Build your own, or use a pre-build SDK artifacts/binaries

MeetHour conveniently provides a pre-build SDK artifacts/binaries in its Maven repository. When you do not require any
modification to the SDK itself or any of its dependencies, it's suggested to use the pre-build SDK. This avoids the
complexity of building and installing your own SDK artifacts/binaries.

### Use pre-build SDK artifacts/binaries

In your project, add the Maven repository
`https://repo.meethour.io/maven/releases` and the
dependency `go.meethour.io.react:meet-hour-sdk:3.5.4` into your `build.gradle` files.

The repository typically goes into the `build.gradle` file in the root of your project:

```gradle
allprojects {
    repositories {
        google()
        jcenter()
        maven {
            url "https://repo.meethour.io/maven/releases"
        }
    }
}
```

Dependency definitions belong in the individual module `build.gradle` files:

```gradle
dependencies {
    // (other dependencies)
    implementation ('go.meethour.io.react:meet-hour-sdk:3.5.3') { transitive = true }
}
```
