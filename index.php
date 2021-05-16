<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">

    <title>GeoSirius</title>

    <script src="https://code.jquery.com/jquery-1.12.4.js" integrity="sha256-Qw82+bXyGq6MydymqBxNPYTaUXXq7c8v3CwiYwLLNXU=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="libs/moment/moment-with-locales.min.js"></script>

    <link rel="stylesheet" href="libs/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="libs/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="libs/ionicons/css/ionicons.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css">
    <link rel="stylesheet" href="libs/markercluster/MarkerCluster.css"/>
    <link rel="stylesheet" href="libs/markercluster/MarkerCluster.Default.css"/>
    <link rel="stylesheet" href="libs/leaflet-mouse/leaflet-mouse.css">
    <link rel="stylesheet" href="libs/leaflet-layers-tree/L.Control.Layers.Tree.css">
    <link rel="stylesheet" href="libs/leaflet-easy-button/easy-button.css">
    <link rel="stylesheet" href="libs/sweetalert2/sweetalert2.min.css">
    <link rel="stylesheet" href="style.css?v=11"/>

    <link rel="shortcut icon" href="favicon.png" type="image/png" />
</head>
<body>

<div id="map"></div>

<section class="ftco-section" id="buttons">
    <div class="container">
        <a type="button" class="btn btn-danger mr-3 mb-2" href="download/app-debug.apk">
            <i class="ion-ios-phone-portrait"></i><span> Скачай GeoSirius App</span>
        </a>
        <a type="button" class="btn btn-success mr-3 mb-2" href="https://datalens.yandex/3p1mdbbxcnoax" target="_blank">
            <i class="ion-ios-cloud"></i><span> Погода</span>
        </a>
    </div>
</section>

<!-- Yandex.Metrika counter --> <script type="text/javascript" > (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(78650634, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, trackHash:true }); </script> <noscript><div><img src="https://mc.yandex.ru/watch/78650634" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="libs/markercluster/leaflet.markercluster.js"></script>
<script src="libs/leaflet-mouse/leaflet-mouse.js"></script>
<script src="libs/leaflet-layers-tree/L.Control.Layers.Tree.js"></script>
<script src="libs/leaflet-tilelayer-colorpicker/leaflet-tilelayer-colorpicker.js"></script>
<script src="libs/leaflet-easy-button/easy-button.js"></script>
<script src="libs/sweetalert2/sweetalert2.min.js"></script>
<script src="libs/js.cookie/js.cookie.js"></script>
<script src="script.js?v=11"></script>

</body>
</html>
