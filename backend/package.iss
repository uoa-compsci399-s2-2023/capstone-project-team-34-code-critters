#define AppName "CritterSleuth"
#define AppVersion "1.0.0"
#define AppPublisher "Code Critters"
#define AppExeName "CritterSleuth"
#define AppIcon "library\static\favicon.ico"

[Setup]
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={pf}\{#AppPublisher}\{#AppName}
DefaultGroupName={#AppName}
OutputDir=.
OutputBaseFilename=Complete-{#AppExeName}-Setup
Compression=lzma2
SolidCompression=yes
UninstallDisplayIcon={app}\{#AppExeName}.exe

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "Do you want to create desktop icon?"; Flags: checkablealone

[Files]
Source: "dist\{#AppExeName}\library\static\uploads\*"; DestDir: "{userappdata}\{#AppPublisher}\{#AppName}\library\static\uploads"; Flags: recursesubdirs createallsubdirs
Source: "dist\{#AppExeName}\library\static\storage\*"; DestDir: "{userappdata}\{#AppPublisher}\{#AppName}\library\static\storage"; Flags: recursesubdirs createallsubdirs
Source: "dist\{#AppExeName}\*"; DestDir: "{app}"; Flags: recursesubdirs


[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\{#AppExeName}.exe"
Name: "{commondesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Tasks: desktopicon; IconFilename: "{app}\{#AppExeName}.exe"
Name: "{commonprograms}\{#AppName}"; Filename: "{app}\{#AppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\{#AppExeName}.exe"

; [Run]
; Filename: "{app}\{#AppExeName}"; Description: "{cm:LaunchProgram,{#AppName}}"; Flags: nowait postinstall skipifsilent



;[Code]
;const
;  AppName = 'Insect Identification Application';
;  AppVersion = '1.0.0';
;  AppPublisher = 'Code Critters';
;  AppExeName = 'Insect Identification Application.exe';
;  AppIcon = 'library\static\favicon.ico';

;function InitializeSetup(): Boolean;
;begin
;  Result := True;
;end;

;function InitializeWizard(): Boolean;
;begin
;  Result := True;
;end;

;function NextButtonClick(CurPageID: Integer): Boolean;
;begin
;  Result := True;
;end;

;function ShouldSkipPage(PageID: Integer): Boolean;
;begin
;  Result := False;
;end;

;function CurPageChanged(CurPageID: Integer): Boolean;
;begin
;  Result := True;
;end;

;function PrepareToInstall(var NeedsRestart: Boolean): String;
;begin
;  Result := '';
;end;

;function GetCustomSetupExitCode(): Integer;
;begin
;  Result := 0;
;end;

;procedure CurStepChanged(CurStep: TSetupStep);
;begin
;end;

;procedure DeinitializeSetup();
;begin
;end;