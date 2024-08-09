npm install react-native


npx react-native init front


npx react-native run-android

npm i

주의(안드로이드 빌드 전 할 것)
1. react-native-camera-kit 라이브러리에서 
react-native-camera-kit/android/build.gardle
targetSdkVersion 34 으로 변경
kotlin_version을 kotlinVersion 으로 변경

2. front/android/build.gradle

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

apply plugin: "com.facebook.react.rootproject"

3. front/android/app/build.gradle

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




cd android
./gradlew clean
cd ..
npx react-native run-android


npx react-native start --reset-cache

npm cache clean --force





