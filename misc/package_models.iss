; DO NOT CHANGE AppName or AppPublisher.
;These are used to find the CritterSleuth install directory.
#define AppName "CritterSleuth"
#define AppPublisher "Code Critters"
; Feel free to change AppVersion, AppIcon, and ModelName.
#define AppVersion "1.0.0"
#define AppIcon "library\static\favicon.ico"
#define ModelName "MODELNAMEHERE"

[Setup]
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={pf}\{#AppPublisher}\{#AppName}
DefaultGroupName={#AppName}
OutputDir=.
OutputBaseFilename={#ModelName}-ModelExpansion
Compression=none
SolidCompression=yes

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "Do you want to create desktop icon?"; Flags: checkablealone

[Files]
Source: ".\models\*"; DestDir: "{app}\library\models"; Flags: ignoreversion recursesubdirs createallsubdirs

[Code]
function IsCritterSleuthInstalled: boolean;
begin
  result := RegKeyExists(HKEY_LOCAL_MACHINE,
    'SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\CritterSleuth.exe');
end;

function InitializeSetup: boolean;
begin
  result := IsCritterSleuthInstalled;
  if not result then
    MsgBox('You need to CritterSleuth before you install this model pack. Install CritterSleuth and then run this installer again.', mbError, MB_OK);
end;