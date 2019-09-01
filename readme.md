# react-native-mo-screen

Provides screen-on, proximity and brightness support

## Usage

```ts
import { Screen, ProximityScreenOffLock, ScreenOnLock } from 'react-native-mo-screen';

const lock = Screen.pushScreenOn();
// do something
lock.release();

const lock = Screen.pushProximityScreenOff();
// do something
lock.release();

Screen.setScreenBrightness(0.5);

return (
  <View>
    <ScreenOnLock />
    <ProximityScreenOffLock />
  </View>
)

```
