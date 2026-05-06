# ============================================
# SCRIPT DE TEST DES PRÉREQUIS KUBERNETES
# ============================================

Write-Host "TEST DES PREREQUIS POUR LEARNIVO KUBERNETES" -ForegroundColor Magenta
Write-Host "==========================================`n" -ForegroundColor Yellow

# Test Vagrant
Write-Host "Test Vagrant..." -ForegroundColor Cyan
try {
    $vagrantVersion = vagrant --version 2>$null
    Write-Host "OK Vagrant : $vagrantVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR Vagrant non trouve ou erreur" -ForegroundColor Red
    Write-Host "Installez depuis : https://www.vagrantup.com/" -ForegroundColor Yellow
}

# Test VirtualBox
Write-Host "`nTest VirtualBox..." -ForegroundColor Cyan
try {
    $vboxVersion = VBoxManage --version 2>$null
    Write-Host "OK VirtualBox : $vboxVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR VirtualBox non trouve" -ForegroundColor Red
    Write-Host "Installez depuis : https://www.virtualbox.org/" -ForegroundColor Yellow
    Write-Host "Puis ajoutez au PATH : C:\Program Files\Oracle\VirtualBox" -ForegroundColor Yellow
}

# Test Git
Write-Host "`nTest Git..." -ForegroundColor Cyan
try {
    $gitVersion = git --version 2>$null
    Write-Host "OK Git : $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR Git non trouve" -ForegroundColor Red
    Write-Host "Installez depuis : https://git-scm.com/" -ForegroundColor Yellow
}

# Test Docker (optionnel)
Write-Host "`nTest Docker (optionnel)..." -ForegroundColor Cyan
try {
    $dockerVersion = docker --version 2>$null
    Write-Host "OK Docker : $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "INFO Docker non trouve (optionnel pour la demo)" -ForegroundColor Yellow
}

Write-Host "`nRESUME :" -ForegroundColor Cyan
Write-Host "========" -ForegroundColor Cyan

$allGood = $true
$checks = @(
    @{Name="Vagrant"; Status=(Get-Command vagrant -ErrorAction SilentlyContinue) -ne $null},
    @{Name="VirtualBox"; Status=(Get-Command VBoxManage -ErrorAction SilentlyContinue) -ne $null},
    @{Name="Git"; Status=(Get-Command git -ErrorAction SilentlyContinue) -ne $null}
)

foreach ($check in $checks) {
    $status = if ($check.Status) { "OK" } else { "ERREUR"; $allGood = $false }
    Write-Host "   $status $($check.Name)" -ForegroundColor $(if ($check.Status) { "Green" } else { "Red" })
}

Write-Host ""

if ($allGood) {
    Write-Host "SUCCES TOUS LES PREREQUIS SONT OK !" -ForegroundColor Green
    Write-Host "Vous pouvez lancer : .\demo-script.ps1" -ForegroundColor White
} else {
    Write-Host "ATTENTION Certains prerequis sont manquants." -ForegroundColor Yellow
    Write-Host "Installez-les puis relancez ce script." -ForegroundColor White
}

Write-Host "`nProchaines etapes :" -ForegroundColor Cyan
Write-Host "1. Fermer cette fenetre PowerShell" -ForegroundColor White
Write-Host "2. Ouvrir une nouvelle fenetre PowerShell" -ForegroundColor White
Write-Host "3. Naviguer vers le projet Learnivo" -ForegroundColor White
Write-Host "4. Lancer .\test-prerequisites.ps1" -ForegroundColor White
Write-Host "5. Si OK, lancer .\demo-script.ps1" -ForegroundColor White