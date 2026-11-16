# Локальный сервер для прототипа Шаңырақ AI: http://localhost:8080
# Отключаем QuickEdit, чтобы клик по окну не «замораживал» сервер
Add-Type -Namespace W -Name C -MemberDefinition '[DllImport("kernel32.dll")] public static extern System.IntPtr GetStdHandle(int h);[DllImport("kernel32.dll")] public static extern bool GetConsoleMode(System.IntPtr h,out uint m);[DllImport("kernel32.dll")] public static extern bool SetConsoleMode(System.IntPtr h,uint m);'
try{$h=[W.C]::GetStdHandle(-10);$m=0;[void][W.C]::GetConsoleMode($h,[ref]$m);[void][W.C]::SetConsoleMode($h,(($m -bor 0x80) -band (-bnot 0x40)))}catch{}
$port=8080;$root=Join-Path (Split-Path $PSScriptRoot -Parent) 'dist'
$l=New-Object System.Net.HttpListener;$l.Prefixes.Add("http://localhost:$port/")
try{$l.Start()}catch{Write-Host "Порт $port занят: сервер уже запущен в другом окне. Закрой старое окно и запусти снова.";Read-Host;exit}
$Host.UI.RawUI.WindowTitle="Shanyraq AI server :$port"
Write-Host "Shanyraq AI: http://localhost:$port  (не закрывай это окно)"
Start-Process "http://localhost:$port/"
$types=@{'.html'='text/html; charset=utf-8';'.js'='text/javascript';'.css'='text/css';'.txt'='text/plain; charset=utf-8';'.png'='image/png';'.svg'='image/svg+xml';'.json'='application/json'}
while($l.IsListening){try{$c=$l.GetContext();$p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'));if(!$p){$p='index.html'}
 $f=Join-Path $root $p;$r=$c.Response;$r.AddHeader('Cache-Control','no-store')
 if((Test-Path $f -PathType Leaf) -and ([IO.Path]::GetFullPath($f).StartsWith($root))){$fi=Get-Item $f;$t=$types[$fi.Extension];if(!$t){$t='application/octet-stream'};$r.ContentType=$t
  $b=[IO.File]::ReadAllBytes($f);$r.ContentLength64=$b.Length;if($c.Request.HttpMethod -ne 'HEAD'){$r.OutputStream.Write($b,0,$b.Length)}}
 else{$r.StatusCode=404};$r.Close()}catch{Write-Host "Ошибка: $_"}}
