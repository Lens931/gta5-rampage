# Rampage Trainer ASI Installation Guide

This document walks through installing the **Rampage.asi** trainer with **PowerShell on Windows 11**, making it available in Grand Theft Auto V single-player, and mirroring the install into **FiveM** while enforcing the **3258** game build. The process is fully automated and safe to repeat when updates release.

> ⚠️ Always back up your GTA V and FiveM installation folders before adding or replacing files.

## At-a-glance checklist

| Requirement | Why it matters |
| ----------- | -------------- |
| Windows 11 with administrator access | Required to copy files into `Program Files` and `%LOCALAPPDATA%`. |
| Grand Theft Auto V installation | Rampage needs the base game files and ScriptHookV loader. |
| FiveM client (build 3258+) | Lets you load Rampage in FiveM via the `plugins` folder. |
| Latest **ScriptHookV** package | Provides `dinput8.dll` (ASI loader) and `ScriptHookV.dll`. |
| Latest **Rampage Trainer** release | Supplies `Rampage.asi` and the `RampageFiles` data folder. |

## 1. Configure installation paths in PowerShell

1. Launch **PowerShell** as an administrator.
2. Paste the block below and adjust `$GtaPath` if GTA V is installed somewhere else:

   ```powershell
   # GTA V root directory
   $GtaPath = "C:\\Program Files\\Rockstar Games\\Grand Theft Auto V"

   # Download sources (update the URLs when new builds release)
   $ScriptHookUrl = "https://www.dev-c.com/files/ScriptHookV.zip"
   $RampageUrl   = "https://github.com/RampageTrainer/Release/releases/latest/download/RampageFiles.zip"

   # Working folders
   $WorkDir       = "$env:TEMP\RampageInstall"
   $FiveMRoot     = Join-Path $env:LOCALAPPDATA "FiveM\FiveM.app"
   $FiveMPlugins  = Join-Path $FiveMRoot "plugins"
   ```

   > Tip: To verify the GTA folder, right-click GTA V in the Rockstar/Epic/Steam launcher and choose **Open Installation Folder**.

## 2. Run the PowerShell install script

Execute the script to download ScriptHookV and Rampage, extract them, and copy the necessary files into GTA V and FiveM. You can safely re-run this script whenever you need to refresh the files.

```powershell
# Ensure the working and FiveM plugin folders exist
New-Item -ItemType Directory -Force -Path $WorkDir, $FiveMPlugins | Out-Null

# Download ScriptHookV and Rampage archives
Invoke-WebRequest -Uri $ScriptHookUrl -OutFile (Join-Path $WorkDir "ScriptHookV.zip")
Invoke-WebRequest -Uri $RampageUrl   -OutFile (Join-Path $WorkDir "RampageFiles.zip")

# Extract the downloads
Expand-Archive -Path (Join-Path $WorkDir "ScriptHookV.zip")   -DestinationPath (Join-Path $WorkDir "ScriptHookV") -Force
Expand-Archive -Path (Join-Path $WorkDir "RampageFiles.zip") -DestinationPath (Join-Path $WorkDir "Rampage")     -Force

# ScriptHookV core files (dinput8.dll is the ASI loader for GTA V)
Copy-Item (Join-Path $WorkDir "ScriptHookV\bin\dinput8.dll")   -Destination $GtaPath -Force
Copy-Item (Join-Path $WorkDir "ScriptHookV\bin\ScriptHookV.dll") -Destination $GtaPath -Force

# Rampage Trainer in GTA V
Copy-Item (Join-Path $WorkDir "Rampage\Rampage.asi")     -Destination $GtaPath -Force
Copy-Item (Join-Path $WorkDir "Rampage\RampageFiles")    -Destination $GtaPath -Recurse -Force

# Rampage Trainer mirrored to FiveM's plugin folder
Copy-Item (Join-Path $WorkDir "Rampage\Rampage.asi")  -Destination $FiveMPlugins -Force
Copy-Item (Join-Path $WorkDir "Rampage\RampageFiles") -Destination $FiveMPlugins -Recurse -Force

# Optional: unblock downloaded binaries so Windows does not quarantine them
Get-ChildItem $GtaPath -Filter "Rampage.*" | Unblock-File
Get-ChildItem $FiveMPlugins -Filter "Rampage.*" | Unblock-File
```

When the script finishes you should have:

- `Rampage.asi` and `RampageFiles` inside the GTA V folder.
- A mirrored copy inside `%LOCALAPPDATA%\FiveM\FiveM.app\plugins`.
- `dinput8.dll` and `ScriptHookV.dll` in the GTA V root so the ASI can load.

## 3. Verify Rampage in FiveM

1. Open `%LOCALAPPDATA%\FiveM\FiveM.app\plugins` in File Explorer.
2. Confirm `Rampage.asi` and `RampageFiles\` are present and not blocked by Windows (right-click → **Properties** → **Unblock** if the button appears).
3. Launch FiveM Singleplayer or connect to a server that allows client ASIs. Once loaded into the world, press **F4** to open Rampage.

FiveM auto-loads `.asi` plugins from the `plugins` directory. If Rampage does not appear, continue to the next section to enforce the correct game build.

## 4. Enforce game build 3258

Rampage is validated against GTA build **3258** for FiveM. Use the following methods to make sure both your client and (optionally) your server run that build:

- **Client shortcut** – Edit your FiveM shortcut target and append `+set sv_enforceGameBuild 3258`, e.g.

  ```text
  "C:\Users\<you>\AppData\Local\FiveM\FiveM.exe" +set sv_enforceGameBuild 3258
  ```

- **Server configuration** – Add the line below to `server.cfg` and restart the server:

  ```cfg
  sv_enforceGameBuild 3258
  ```

- **Manual override inside FiveM** – Open the in-game console (F8) and run `sv_enforceGameBuild 3258` to switch builds without restarting the client (useful for testing).

After enforcing the build, restart FiveM to download any missing assets for the specified version.

## 5. Clean up the installer

The working folder in `%TEMP%` can be deleted after installation:

```powershell
Remove-Item $WorkDir -Recurse -Force
```

Keep the script handy so you can rerun it when ScriptHookV or Rampage release updates. Just update the download URLs in section 1 to match the latest versions.

## Troubleshooting

| Symptom | Suggested fix |
| ------- | -------------- |
| Rampage does not open with **F4** | Ensure `dinput8.dll` is in the GTA V root and that `Rampage.asi` is not blocked. Run `Unblock-File` on the ASI and DLLs if needed. |
| FiveM crashes on launch | Temporarily remove everything from `%LOCALAPPDATA%\FiveM\FiveM.app\plugins` and add mods back one at a time to find conflicts. |
| FiveM launches a different GTA build | Delete `%LOCALAPPDATA%\FiveM\FiveM.app\data\cache` and relaunch so FiveM redownloads assets for build 3258. |
| Controls conflict with other mods | Edit `RampageFiles\RampageSettings.ini` and remap the keybinds, then restart the game. |
| Script complains about execution policy | Run `Set-ExecutionPolicy -Scope Process RemoteSigned` in the admin PowerShell session before executing the script. |

## Additional resources

- [ScriptHookV official site](https://www.dev-c.com/gtav/scripthookv/)
- [Rampage Trainer release page](https://github.com/RampageTrainer/Release/releases)
- [FiveM documentation on game builds](https://docs.fivem.net/docs/server-manual/server-commands/#sv_enforcegamebuild)

Following this PowerShell tutorial ensures Rampage Trainer remains functional in GTA V single-player and in FiveM environments that enforce build 3258.
