package de.mxs.reactnativemoscreen;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.PowerManager;
import android.view.WindowManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;

public class ReactNativeMoScreen extends ReactContextBaseJavaModule {

    private SensorEventListener proximityListener = new SensorEventListener() {
        @Override
        public void onSensorChanged(SensorEvent sensorEvent) {
            WritableMap args = Arguments.createMap();
            args.putDouble("distance", sensorEvent.values[0]);
            args.putBoolean("proximity", sensorEvent.values[0] < sensorEvent.sensor.getMaximumRange());
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("ReactNativeMoLayoutScreenProximity", args);
        }
        @Override
        public void onAccuracyChanged(Sensor sensor, int i) {
        }
    };

    private PowerManager.WakeLock proximityScreenOffLock;

    ReactNativeMoScreen(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public @Nonnull
    String getName() {
        return "ReactNativeMoScreen";
    }

    @Override
    public void onCatalystInstanceDestroy() {
        enableProximityEvent(false);
        super.onCatalystInstanceDestroy();
    }

    @SuppressWarnings({"WeakerAccess"})
    @ReactMethod
    public void enableProximityEvent(boolean enable) {
        SensorManager sensorManager = (SensorManager)getReactApplicationContext().getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager == null) throw new RuntimeException("sensorManager null");
        sensorManager.unregisterListener(proximityListener);
        if (enable) {
            Sensor proximity = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY);
            sensorManager.registerListener(proximityListener, proximity, SensorManager.SENSOR_DELAY_NORMAL);
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void setProximityScreenOff(boolean value) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            PowerManager powerManager = (PowerManager) getReactApplicationContext().getSystemService(Context.POWER_SERVICE);
            if (powerManager == null) throw new RuntimeException("powerManager null");
            if (value) {
                if (proximityScreenOffLock == null) {
                    proximityScreenOffLock = powerManager.newWakeLock(PowerManager.PROXIMITY_SCREEN_OFF_WAKE_LOCK, "RNMoLayout:proximityScreenOff");
                    if (proximityScreenOffLock != null) {
                        proximityScreenOffLock.acquire(1000 * 60 * 60 * 8);
                    }
                }
            } else {
                if (proximityScreenOffLock != null) {
                    proximityScreenOffLock.release();
                    proximityScreenOffLock = null;
                }
            }
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void setKeepScreenOn(final boolean value) {
        final Activity activity = getCurrentActivity();
        if (activity == null) return;
        activity.runOnUiThread(() -> {
            if (value) {
                activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            } else {
                activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        });
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void setWindowFlags(final int flag, final boolean value) {
        final Activity activity = getCurrentActivity();
        if (activity == null) return;
        activity.runOnUiThread(() -> {
            if (value) {
                activity.getWindow().addFlags(flag);
            } else {
                activity.getWindow().clearFlags(flag);
            }
        });
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void setBrightness(final float value) {
        final Activity activity = getCurrentActivity();
        if (activity == null) return;
        activity.runOnUiThread(() -> {
            WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
            lp.screenBrightness = value;
            activity.getWindow().setAttributes(lp);
        });
    }

}
