# Install ImageMagick first from https://imagemagick.org/

$images = Get-ChildItem -Path "assets/images" -Include *.jpg,*.jpeg,*.png -Recurse

foreach ($img in $images) {
    $outputPath = Join-Path $img.DirectoryName ($img.BaseName + ".webp")
    
    # Convert to WebP with 85% quality
    & magick convert $img.FullName -quality 85 $outputPath
    
    Write-Host "Converted: $($img.Name) -> $($img.BaseName).webp"
}

Write-Host "Image conversion complete!"