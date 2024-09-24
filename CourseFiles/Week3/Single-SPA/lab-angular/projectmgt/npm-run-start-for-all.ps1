Get-ChildItem -Directory | ForEach-Object {
    $folderPath = $_.FullName
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $folderPath; npm run start"
}
