# Rampage Trainer ASI Installation Guide

Follow this guide to install the **Rampage.asi** trainer on Windows 11 with PowerShell, make it available inside Grand Theft Auto V, and keep it compatible with FiveM servers that enforce the **3258** game build.

> ⚠️ Always back up your GTA V and FiveM installation folders before adding or replacing files.

## Prerequisites

- Windows 11 with administrator access.
- A working copy of **Grand Theft Auto V** (Rockstar Games Launcher, Epic Games, or Steam).
- **FiveM** client installed (minimum build 3258).
- The latest **ScriptHookV** package (Rampage relies on it in single-player).
- The latest Rampage Trainer release archive (`Rampage.asi` and the `RampageFiles` folder).

## 1. Prepare your folders

1. Start **PowerShell** as an administrator.
2. Configure the base paths that match your installation:

   ```powershell
   # GTA V root directory
   $GtaPath = "C:\\Program Files\\Rockstar Games\\Grand Theft Auto V"
   # ScriptHookV download URL (update if a newer build is available)
   $ScriptHookUrl = "https://www.dev-c.com/files/ScriptHookV.zip"
   # Rampage Trainer download URL from the official release page
   $RampageUrl = "https://github.com/RampageTrainer/Release/releases/latest/download/RampageFiles.zip"
   # Temporary working folder
   $WorkDir = "$env:TEMP\RampageInstall"
   # FiveM application data folder (installed per user)
   $FiveMRoot = Join-Path $env:LOCALAPPDATA "FiveM\FiveM.app"
   # Destination for FiveM ASI plugins
   $FiveMPlugins = Join-Path $FiveMRoot "plugins"
   ```

   > Replace `$GtaPath` if your GTA V files live elsewhere (for example `D:\Games\Grand Theft Auto V`).

## 2. Download ScriptHookV and Rampage with PowerShell

Run the following script block to download both archives, extract the relevant files, and copy them to GTA V and FiveM:

```powershell
# Create folders
New-Item -ItemType Directory -Force -Path $WorkDir, $FiveMPlugins | Out-Null

# Download packages
Invoke-WebRequest -Uri $ScriptHookUrl -OutFile (Join-Path $WorkDir "ScriptHookV.zip")
Invoke-WebRequest -Uri $RampageUrl -OutFile (Join-Path $WorkDir "RampageFiles.zip")

# Extract archives
Expand-Archive -Path (Join-Path $WorkDir "ScriptHookV.zip") -DestinationPath (Join-Path $WorkDir "ScriptHookV") -Force
Expand-Archive -Path (Join-Path $WorkDir "RampageFiles.zip") -DestinationPath (Join-Path $WorkDir "Rampage") -Force

# Copy ScriptHookV core files (dinput8.dll acts as the ASI loader)
Copy-Item (Join-Path $WorkDir "ScriptHookV\bin\dinput8.dll") -Destination $GtaPath -Force
Copy-Item (Join-Path $WorkDir "ScriptHookV\bin\ScriptHookV.dll") -Destination $GtaPath -Force

# Copy Rampage Trainer files to GTA V
Copy-Item (Join-Path $WorkDir "Rampage\Rampage.asi") -Destination $GtaPath -Force
Copy-Item (Join-Path $WorkDir "Rampage\RampageFiles") -Destination $GtaPath -Recurse -Force

# Mirror Rampage Trainer into FiveM's plugins folder for client-side use
Copy-Item (Join-Path $WorkDir "Rampage\Rampage.asi") -Destination $FiveMPlugins -Force
Copy-Item (Join-Path $WorkDir "Rampage\RampageFiles") -Destination $FiveMPlugins -Recurse -Force
```

The Rampage Trainer will now be available in single-player GTA V and ready for FiveM's plugin loader.

## 3. Enable the Rampage plugin in FiveM

1. Open the `FiveM Application Data` folder: `%LOCALAPPDATA%\FiveM\FiveM.app`.
2. Confirm that `plugins\Rampage.asi` and `plugins\RampageFiles` exist (the script creates them).
3. If you run FiveM Singleplayer, launch it and press **F4** to open Rampage once loaded into the game world.

FiveM loads `.asi` plugins from the `plugins` directory automatically. If FiveM starts without loading Rampage, confirm you are on build 3258 or higher (step 4) and that no antivirus software quarantined the ASI or DLL files.

## 4. Enforce game build 3258 in FiveM

FiveM servers dictate the GTA build. To guarantee compatibility with Rampage on build **3258**:

- **Client shortcut**: edit the shortcut that launches FiveM and append `+set sv_enforceGameBuild 3258` to the target, e.g.

  ```text
  "C:\Users\<you>\AppData\Local\FiveM\FiveM.exe" +set sv_enforceGameBuild 3258
  ```

- **Server configuration**: add the following line to your `server.cfg`:

  ```cfg
  sv_enforceGameBuild 3258
  ```

After updating the configuration, restart the FiveM client or server so the new build requirement is applied.

## 5. Cleanup and maintenance

- To clean temporary files created by the PowerShell script:

  ```powershell
  Remove-Item $WorkDir -Recurse -Force
  ```

- When new Rampage or ScriptHookV updates release, rerun the download section with the updated URLs.
- If FiveM updates to a newer enforced build, adjust the value in the shortcut and server configuration accordingly.

## Troubleshooting

| Symptom | Suggested fix |
| ------- | -------------- |
| Rampage does not open with **F4** | Ensure `dinput8.dll` is present in the GTA V root and that ScriptHookV files are not blocked by Windows SmartScreen. Right-click each DLL/ASI, open **Properties**, and click **Unblock** if the button is shown. |
| FiveM crashes on launch | Remove all files from `%LOCALAPPDATA%\FiveM\FiveM.app\plugins` and add them back one by one to identify conflicts. |
| Client loads a different GTA build | Delete `%LOCALAPPDATA%\FiveM\FiveM.app\data\cache` and relaunch FiveM so it downloads assets for build 3258. |
| Controls conflict with other mods | Open `RampageFiles\RampageSettings.ini` and remap keys as needed. |

## Additional resources

- [ScriptHookV official site](https://www.dev-c.com/gtav/scripthookv/)
- [Rampage Trainer release page](https://github.com/RampageTrainer/Release/releases)
- [FiveM documentation on game builds](https://docs.fivem.net/docs/server-manual/server-commands/#sv_enforcegamebuild)

Following the steps above will keep Rampage Trainer working inside GTA V single-player and FiveM environments running build 3258.
