```
npm install react-native
```

```
npx react-native init front
```

```
npx react-native run-android
```

```
npm i
```

주의(안드로이드 빌드 전 할 것)

1. react-native-camera-kit 라이브러리에서 
react-native-camera-kit/android/build.gardle
targetSdkVersion 34 으로 변경
kotlin_version을 kotlinVersion 으로 변경

2. front/android/build.gradle
```
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 24
        compileSdkVersion = 34
        targetSdkVersion = 33
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.22"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.0.2")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}
```

apply plugin: "com.facebook.react.rootproject"

## 3. front/android/app/build.gradle
```
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
apply plugin: "kotlin-android"
apply plugin: 'kotlin-parcelize'

react {
    // 기본 설정입니다.
}

/**
 * Set this to true to Run Proguard on Release builds to minify the Java bytecode.
 */
def enableProguardInReleaseBuilds = false

/**
 * The preferred build flavor of JavaScriptCore (JSC)
 */
def jscFlavor = 'org.webkit:android-jsc:+'

android {
    ndkVersion rootProject.ext.ndkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace "com.front"

    aaptOptions {
        ignoreAssetsPattern "!src_assets_spray.png"
    }

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }

    defaultConfig {
        applicationId "com.front"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        missingDimensionStrategy 'react-native-camera', 'general'
        manifestPlaceholders = [
            'googleMapsApiKey': 'AIzaSyD9c-ic01zBgyq5SscE5bKnbZIgdZ-SOus'
        ]
        signingConfig signingConfigs.release
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
    viewBinding {
        enabled = true
    }
}

dependencies {
    // The version of react-native is set by the React Native Gradle Plugin
    implementation("com.facebook.react:react-android")
    
    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}

apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)

tasks.whenTaskAdded { task ->
    if (task.name == "generateDebugLintReportModel" || task.name == "lintAnalyzeDebug") {
        task.dependsOn "copyReactNativeVectorIconFonts"
    }
}
```

## 4. front/android/app/src/main/AndroidManifest.xml
```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="true"
      android:theme="@style/AppTheme"
      android:usesCleartextTraffic="true">
      <meta-data
      android:name="com.google.android.geo.API_KEY"
      android:value="본인 구글 맵 API"/>
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true"
        android:theme="@style/SplashScreenTheme"> <!-- 여기에 테마 추가 -->
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

## 5. front/android/app/src/main/java/com/front/MainActivity.kt
```
package com.front

import com.facebook.react.ReactActivity
import android.os.Bundle
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "front"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
  
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(null)
  }
}
```

## 6. front/android/app/src/main/java/com/front/MainApplication.kt
```
package com.front

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}
```





## 빌드 후 시작하는 방법

```
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## apk 추출 하는 방법
 - front/android/app 에서 키스토어 파일 생성
```
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

 - front/android/gradle.properties 에 추가
```
MYAPP_RELEASE_STORE_FILE=C:\\Users\\경로\\Desktop\\front\\android\\app\\my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD= 비밀번호
MYAPP_RELEASE_KEY_PASSWORD= 비밀번호

```


```
cd android
./gradlew assembleRelease
```

### 캐시 정리

```
npx react-native start --reset-cache
npm cache clean --force
```




