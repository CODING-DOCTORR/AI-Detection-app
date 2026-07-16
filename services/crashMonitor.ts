/**
 * Lightweight crash / analytics logging stub.
 *
 * Replace the bodies with Firebase Crashlytics or Sentry calls when
 * you integrate a real crash-reporting service.
 */

const TAG = '[CrashMonitor]';

export function setCrashKey(key: string, value: string): void {
    if (__DEV__) {
        console.log(`${TAG} key  ${key} = ${value}`);
    }
    // e.g. crashlytics().setAttribute(key, value);
}

export function crashLog(message: string): void {
    if (__DEV__) {
        console.log(`${TAG} ${message}`);
    }
    // e.g. crashlytics().log(message);
}