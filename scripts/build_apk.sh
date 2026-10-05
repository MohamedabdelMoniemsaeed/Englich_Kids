#!/bin/bash
set -e

echo "=== Building English Kids Native Offline Android APK ==="

WORK_DIR="$(pwd)"
BUILD_DIR="/tmp/apk_builder"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/englishkids/app"
mkdir -p "$BUILD_DIR/classes"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/values-night"
mkdir -p "$BUILD_DIR/res/mipmap-mdpi"
mkdir -p "$BUILD_DIR/res/mipmap-hdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxxhdpi"
mkdir -p "$BUILD_DIR/assets/www"

# 1. Ensure Vite production build is updated
echo "1. Checking Vite build..."
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    npm run build
fi

# 2. Copy ONLY client-side web files into assets/www (exclude APKs, zips, server scripts)
echo "2. Copying web application to APK assets..."
cp dist/index.html "$BUILD_DIR/assets/www/"
if [ -f "dist/manifest.json" ]; then
    cp dist/manifest.json "$BUILD_DIR/assets/www/"
fi
if [ -d "dist/assets" ]; then
    cp -r dist/assets "$BUILD_DIR/assets/www/"
fi

# 3. Copy launcher icons from project or android directory
echo "3. Setting up app icons and resources..."
ICON_SRC=""
for icon_candidate in android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png /tmp/native_android_build/res/mipmap-xxhdpi/ic_launcher.png src/assets/images/iconHome.png; do
    if [ -f "$icon_candidate" ]; then
        ICON_SRC="$icon_candidate"
        break
    fi
done

if [ -n "$ICON_SRC" ]; then
    cp "$ICON_SRC" "$BUILD_DIR/res/mipmap-mdpi/ic_launcher.png"
    cp "$ICON_SRC" "$BUILD_DIR/res/mipmap-hdpi/ic_launcher.png"
    cp "$ICON_SRC" "$BUILD_DIR/res/mipmap-xhdpi/ic_launcher.png"
    cp "$ICON_SRC" "$BUILD_DIR/res/mipmap-xxhdpi/ic_launcher.png"
    cp "$ICON_SRC" "$BUILD_DIR/res/mipmap-xxxhdpi/ic_launcher.png"
fi

cat << 'EOF' > "$BUILD_DIR/res/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Light.NoTitleBar">
        <item name="android:windowBackground">@android:color/white</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">false</item>
    </style>
</resources>
EOF

cat << 'EOF' > "$BUILD_DIR/res/values-night/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Light.NoTitleBar">
        <item name="android:windowBackground">@android:color/white</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">false</item>
    </style>
</resources>
EOF

# 4. Create AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.englishkids.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <queries>
        <intent>
            <action android:name="android.intent.action.TTS_SERVICE" />
        </intent>
    </queries>

    <application
        android:label="English Kids"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true"
        android:largeHeap="true"
        android:supportsRtl="true">
        <activity
            android:name=".MainActivity"
            android:label="English Kids"
            android:exported="true"
            android:screenOrientation="sensorPortrait"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout|density">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 5. Create MainActivity.java
cat << 'EOF' > "$BUILD_DIR/src/com/englishkids/app/MainActivity.java"
package com.englishkids.app;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private WebView mWebView;
    private long mLastBackPressTime = 0;
    private static final String APP_HOST = "appassets.local";
    private static final String START_URL = "https://" + APP_HOST + "/index.html";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep status bar visible with branded theme color
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            getWindow().setStatusBarColor(Color.parseColor("#3B82F6"));
            getWindow().setNavigationBarColor(Color.parseColor("#FFFBEB"));
        }

        FrameLayout layout = new FrameLayout(this);
        layout.setBackgroundColor(Color.parseColor("#FFFBEB"));

        mWebView = new WebView(this);
        mWebView.setBackgroundColor(Color.parseColor("#FFFBEB"));
        layout.addView(mWebView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        setContentView(layout);
        setupWebView();
        mWebView.loadUrl(START_URL);
    }

    private void setupWebView() {
        WebSettings s = mWebView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                return true;
            }
        });

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null && url.startsWith("https://" + APP_HOST)) {
                    view.loadUrl(url);
                    return true;
                }
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    return handleLocalRequest(request.getUrl());
                }
                return super.shouldInterceptRequest(view, request);
            }

            @SuppressWarnings("deprecation")
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                if (url != null && url.contains(APP_HOST)) {
                    try {
                        return handleLocalRequest(Uri.parse(url));
                    } catch (Exception ignored) {}
                }
                return super.shouldInterceptRequest(view, url);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed();
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                if (failingUrl != null && failingUrl.startsWith("https://" + APP_HOST)) {
                    view.loadUrl(START_URL);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request != null && request.isForMainFrame()) {
                    view.loadUrl(START_URL);
                }
            }
        });
    }

    private WebResourceResponse handleLocalRequest(Uri uri) {
        if (uri == null) return null;
        String host = uri.getHost();
        if (host == null || !host.equalsIgnoreCase(APP_HOST)) {
            return null;
        }

        String path = uri.getPath();
        if (path == null || path.isEmpty() || path.equals("/")) {
            path = "/index.html";
        }

        // Offline friendly AI tutor conversational assistant endpoint
        if (path.contains("/api/chat")) {
            String jsonReply = "{\"response\": \"Hello little superstar! You are doing amazing learning English today! Keep exploring and having fun! [IMAGE: star]\"}";
            InputStream stream = new ByteArrayInputStream(jsonReply.getBytes(StandardCharsets.UTF_8));
            Map<String, String> headers = new HashMap<>();
            headers.put("Access-Control-Allow-Origin", "*");
            headers.put("Content-Type", "application/json");
            WebResourceResponse res = new WebResourceResponse("application/json", "UTF-8", stream);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                res.setResponseHeaders(headers);
            }
            return res;
        }

        // Normalize path
        String cleanPath = path.startsWith("/") ? path.substring(1) : path;
        String assetPath = "www/" + cleanPath;

        try {
            InputStream is = getAssets().open(assetPath);
            String mime = getMimeType(assetPath);
            // Textual formats use UTF-8, binary formats (images, audio) use null encoding
            String encoding = (mime.startsWith("text/") || mime.equals("application/javascript") || mime.equals("application/json") || mime.equals("image/svg+xml") || mime.equals("application/manifest+json")) ? "UTF-8" : null;

            WebResourceResponse response = new WebResourceResponse(mime, encoding, is);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                Map<String, String> headers = new HashMap<>();
                headers.put("Access-Control-Allow-Origin", "*");
                headers.put("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                headers.put("Access-Control-Allow-Headers", "*");
                headers.put("Cache-Control", "no-cache");
                response.setResponseHeaders(headers);
            }
            return response;
        } catch (Exception e) {
            // SPA fallback: Only fallback to index.html for navigation routes without a file extension
            if (!cleanPath.contains(".") || cleanPath.endsWith(".html")) {
                try {
                    InputStream is = getAssets().open("www/index.html");
                    WebResourceResponse response = new WebResourceResponse("text/html", "UTF-8", is);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        Map<String, String> headers = new HashMap<>();
                        headers.put("Access-Control-Allow-Origin", "*");
                        response.setResponseHeaders(headers);
                    }
                    return response;
                } catch (Exception ignored) {}
            }
            return null;
        }
    }

    private String getMimeType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".json") || lower.endsWith(".map")) return "application/json";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".ico")) return "image/x-icon";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".woff")) return "font/woff";
        if (lower.endsWith(".ttf")) return "font/ttf";
        if (lower.endsWith(".otf")) return "font/otf";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".wav")) return "audio/wav";
        if (lower.endsWith(".ogg")) return "audio/ogg";
        if (lower.endsWith(".webmanifest")) return "application/manifest+json";
        return "application/octet-stream";
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (mWebView != null && mWebView.canGoBack()) {
                mWebView.goBack();
                return true;
            }
            if (System.currentTimeMillis() - mLastBackPressTime < 2000) {
                finish();
            } else {
                Toast.makeText(this, "اضغط مرة أخرى للخروج / Press back again to exit", Toast.LENGTH_SHORT).show();
                mLastBackPressTime = System.currentTimeMillis();
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
EOF

# 6. Compile Java code
echo "4. Compiling Java sources..."
javac -encoding UTF-8 -cp /opt/android-tools/android.jar -d "$BUILD_DIR/classes" "$BUILD_DIR/src/com/englishkids/app/MainActivity.java"

# 7. Compile DEX bytecodes with D8
echo "5. Converting bytecode with D8..."
java -cp /opt/android-tools/r8.jar com.android.tools.r8.D8 \
    --min-api 21 \
    --lib /opt/android-tools/android.jar \
    --output "$BUILD_DIR/" \
    "$BUILD_DIR/classes/com/englishkids/app/"*.class

# 8. Package APK resources and assets with AAPT
echo "6. Packaging APK with AAPT..."
aapt package -f \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -A "$BUILD_DIR/assets" \
    -I /opt/android-tools/android.jar \
    -F "$BUILD_DIR/unaligned.apk"

# 9. Add classes.dex to APK
echo "7. Adding classes.dex to APK..."
(cd "$BUILD_DIR" && aapt add unaligned.apk classes.dex)

# 10. Align APK to 4-byte boundaries with zipalign
echo "8. Aligning APK with zipalign..."
zipalign -f 4 "$BUILD_DIR/unaligned.apk" "$BUILD_DIR/aligned.apk"

# 11. Create keystore if needed
KEYSTORE="$BUILD_DIR/release.keystore"
if [ ! -f "$KEYSTORE" ]; then
    keytool -genkeypair -v \
        -keystore "$KEYSTORE" \
        -alias englishkids \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass englishkids123 \
        -keypass englishkids123 \
        -dname "CN=EnglishKids, OU=Education, O=Kids, L=Global, S=Global, C=US"
fi

# 12. Sign APK with apksigner (v1, v2, v3 schemes)
echo "9. Signing APK with apksigner..."
apksigner sign \
    --ks "$KEYSTORE" \
    --ks-pass pass:englishkids123 \
    --ks-key-alias englishkids \
    --key-pass pass:englishkids123 \
    --out "$WORK_DIR/English_Kids.apk" \
    "$BUILD_DIR/aligned.apk"

# 13. Verify signature
echo "10. Verifying APK signature..."
apksigner verify "$WORK_DIR/English_Kids.apk"

# 14. Copy to dist so static web serving also has it immediately
mkdir -p "$WORK_DIR/dist"
cp "$WORK_DIR/English_Kids.apk" "$WORK_DIR/dist/English_Kids.apk"
cp "$WORK_DIR/English_Kids.apk" "$WORK_DIR/dist/app-release.apk"

APK_SIZE=$(ls -lh "$WORK_DIR/English_Kids.apk" | awk '{print $5}')
echo "SUCCESS! Native Android APK created at English_Kids.apk (Size: $APK_SIZE)"
