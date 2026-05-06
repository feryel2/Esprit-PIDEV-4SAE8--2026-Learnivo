# ============================================
# SCRIPT POUR AJOUTER VIRTUALBOX AU PATH
# ============================================

Write-Host "🔧 AJOUT DE VIRTUALBOX AU PATH POWERSHELL" -ForegroundColor Yellow
Write-Host "=========================================`n" -ForegroundColor Cyan

# Chemin de VirtualBox
$vboxPath = "C:\Program Files\Oracle\VirtualBox"

# Vérifier si VirtualBox existe
if (Test-Path "$vboxPath\VBoxManage.exe") {
    Write-Host "✓ VirtualBox trouvé dans : $vboxPath" -ForegroundColor Green

    # Ajouter au PATH de la session
    if ($env:Path -notlike "*$vboxPath*") {
        $env:Path += ";$vboxPath"
        Write-Host "✓ VirtualBox ajouté au PATH de cette session" -ForegroundColor Green
    } else {
        Write-Host "✓ VirtualBox est déjà dans le PATH" -ForegroundColor Green
    }

    Write-Host "`n🧪 TEST :" -ForegroundColor Cyan
    try {
        $version = VBoxManage --version 2>$null
        Write-Host "✓ VBoxManage fonctionne : $version" -ForegroundColor Green
    } catch {
        Write-Host "✗ VBoxManage ne fonctionne pas" -ForegroundColor Red
    }

} else {
    Write-Host "✗ VirtualBox non trouvé dans $vboxPath" -ForegroundColor Red
    Write-Host "   Vérifiez l'installation de VirtualBox" -ForegroundColor Yellow
}

Write-Host "`n💡 NOTE :" -ForegroundColor Cyan
Write-Host "   Cet ajout est temporaire (valable pour cette session PowerShell)" -ForegroundColor White
Write-Host "   Pour ajout permanent, utilisez les Paramètres Système Windows" -ForegroundColor White