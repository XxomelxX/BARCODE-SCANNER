$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://*:8080/")
$http.Start()

Write-Host "Server started at http://localhost:8080. Press Ctrl+C to stop."

while ($http.IsListening) {
    $context = $http.GetContext()
    $request = $context.Request
    $response = $context.Response

    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }

    $filePath = Join-Path "c:\QuaggaJS" $localPath.TrimStart("/")

    if (Test-Path $filePath -PathType Leaf) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $response.ContentType = if ($filePath.EndsWith(".html")) { "text/html" } elseif ($filePath.EndsWith(".js")) { "application/javascript" } else { "text/plain" }
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $response.StatusCode = 404
        $notFound = "File not found"
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }

    $response.OutputStream.Close()
}

$http.Stop()