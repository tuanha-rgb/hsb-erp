# PowerShell script to remove exposed OAuth credentials from git history
# This script uses git filter-repo (requires Python)

Write-Host "=== Removing OAuth Credentials from Git History ===" -ForegroundColor Yellow
Write-Host ""

# Credentials to remove
$CLIENT_ID = "1000.RJQQGXZ5O9YWORFH1JUF4J616S1T4W"
$CLIENT_SECRET = "6b8d93c6733bcfa07327353341b038d70f7d97cdfe"

Write-Host "Step 1: Creating replacements file..." -ForegroundColor Green
$replacements = @"
$CLIENT_ID==>YOUR_ZOHO_CLIENT_ID
$CLIENT_SECRET==>YOUR_ZOHO_CLIENT_SECRET
"@

Set-Content -Path "replacements.txt" -Value $replacements

Write-Host "Step 2: Installing git-filter-repo (if not installed)..." -ForegroundColor Green
Write-Host "Checking Python..." -ForegroundColor Gray

try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Gray

    # Check if git-filter-repo is installed
    $filterRepo = Get-Command git-filter-repo -ErrorAction SilentlyContinue

    if (-not $filterRepo) {
        Write-Host "Installing git-filter-repo..." -ForegroundColor Gray
        pip install git-filter-repo
    } else {
        Write-Host "git-filter-repo already installed" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "Step 3: Filtering git history..." -ForegroundColor Green
    Write-Host "WARNING: This will rewrite ALL commits!" -ForegroundColor Red
    Write-Host "Press Ctrl+C to cancel, or any key to continue..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

    # Run git filter-repo
    git filter-repo --replace-text replacements.txt --force

    Write-Host ""
    Write-Host "Step 4: Force pushing to remote..." -ForegroundColor Green
    git push origin --force --all
    git push origin --force --tags

    Write-Host ""
    Write-Host "✅ Successfully removed credentials from git history!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: You must now:" -ForegroundColor Yellow
    Write-Host "1. Go to https://api-console.zoho.com/" -ForegroundColor White
    Write-Host "2. DELETE the old OAuth client (or regenerate credentials)" -ForegroundColor White
    Write-Host "3. Create a new OAuth client with new credentials" -ForegroundColor White
    Write-Host "4. Update your .env file with new credentials" -ForegroundColor White

} catch {
    Write-Host ""
    Write-Host "❌ Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative Solution:" -ForegroundColor Yellow
    Write-Host "1. Contact GitHub Support to completely remove the repository from their cache" -ForegroundColor White
    Write-Host "2. Or create a new repository and push code there" -ForegroundColor White
    Write-Host ""
    Write-Host "Manual approach:" -ForegroundColor Yellow
    Write-Host "1. Delete the repository on GitHub" -ForegroundColor White
    Write-Host "2. Remove .git folder locally: rm -rf .git" -ForegroundColor White
    Write-Host "3. Initialize new repo: git init" -ForegroundColor White
    Write-Host "4. Create new GitHub repository and push" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "CRITICAL: Regenerate OAuth credentials immediately!" -ForegroundColor Red
Write-Host "The exposed credentials may still be cached by GitHub." -ForegroundColor Red

# Cleanup
Remove-Item "replacements.txt" -ErrorAction SilentlyContinue
