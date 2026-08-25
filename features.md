Listed directory Projects
Ran command: `ls -la ../`
Ran command: `ls -la ../Stasis`
Viewed README.md:1-800
Ran command: `cat ../Stasis/README.md`

Based on the analysis of the main `Stasis` repository, here is a comprehensive breakdown of the major, minor, and additional features provided by the Stasis macOS app:

### 🌟 Major Features

These are the core hardware-level battery management and automation features:

1. **Hardware Charge Limit**: Enforces a maximum battery charge level (50–100%) at the hardware level via the SMC. This remains active even when the Mac is asleep or power-cycled.
2. **Sailing Mode**: Prevents micro-charging cycles by letting the battery float naturally within a customizable upper and lower percentage range instead of constantly topping it up.
3. **Automatic / Force Discharge**: Allows the MacBook to run on battery power and safely drain the charge down to your target limit even while physically plugged into power.
4. **Heat Protection**: A thermal safety mechanism that automatically pauses charging when the battery temperature exceeds a user-defined threshold.
5. **Battery Calibration Service**: An automated, guided 3-stage workflow (Discharge to 15% → Recharge to 100% → Rest at 100%) designed to recalibrate the battery gauge and SMC sensors.
6. **Apple Shortcuts & Siri Automation**: Deep system integration providing 13 native App Intents (e.g., Set Charge Limit, Toggle Sailing Mode, Get Battery Status) and universal custom URL scheme (`stasis://`) support for Raycast/Alfred/Terminal.

### ✨ Minor Features

These enhance the user interface, observability, and visual experience:

1. **Dynamic Island Notch HUD**: A sleek hardware notch overlay providing animated status pills for charging state changes and power alerts, capable of rendering above full-screen apps and lock screens using `TopWindowElevator`.
2. **Live Power Dashboard**: A compact menu bar dropdown that displays real-time metrics including voltage, current, wattage, battery temperature, battery health, and cycle count.
3. **Power Flow Diagram**: A dynamic Sankey chart in the UI that visualizes real-time power distribution between the charger, battery, and system.
4. **High-Energy App Detection**: Monitors macOS applications in real-time and displays apps consuming significant energy directly in the menu bar dashboard.
5. **Multi-Port & Accessory Detection**: Identifies connected power sources (MagSafe 3, USB-C PD, USB Hubs, external displays) with custom icons and features a high-precision toggle for two-decimal (0.01W / 0.01A) accuracy.
6. **MagSafe LED Control**: Automatically manages the physical MagSafe charging cable LED, setting it to green when your charge limit is reached and orange while actively charging.

### ⚙️ Other System Features & Under the Hood

1. **Multi-Language Support**: Fully localized in 17 languages (including Spanish, French, German, Chinese, Japanese, etc.) with a seamless in-app language switcher.
2. **Helper Daemon Management**: A lightweight, privileged helper daemon (`com.dinanathdash.stasis.charging-helper`) handles secure communication with the Apple Silicon SMC. Users can inspect, reinstall, or remove it directly from the app's settings.
3. **Liquid Glass Interface**: A modern, macOS Tahoe-inspired translucent settings UI built specifically for macOS 14.8+.
4. **Seamless Auto-Updates**: Secure background updates pulled directly from GitHub Releases, powered by the Sparkle framework.
5. **Apple Silicon Exclusivity**: Highly optimized for M-Series architecture (requires Apple Silicon and cannot be run on Intel Macs).
