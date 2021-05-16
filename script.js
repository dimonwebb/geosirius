(function () {

    let baseTree = [{
        label: "Яндекс.Спутник",
        layer: L.tileLayer('https://core-sat.maps.yandex.net/tiles?l=sat&v=3.778.0&x={x}&y={y}&z={z}&lang=ru_RU')
    },{
        label: "Open Street Map",
        layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    }],
        overlayTree = [];

    let map = new L.Map('map', {
        center: new L.LatLng(43.410558, 39.952325),
        zoom: 16,
        crs: L.CRS.EPSG3395,
        attributionControl: true,
        zoomControl: true,
        layers: [baseTree[0].layer]
    }),
        layer;

    // Update base layer crs

    map.on('baselayerchange', function (layer) {

        let crs = L.CRS.EPSG3857

        if (layer.name == '0') {
            crs = L.CRS.EPSG3395;
        }

        if (map.options.crs != crs) {
            let bounds = map.getBounds();
            map.options.crs = crs;
            map.removeLayer(baseTree[layer.name].layer);
            map.addLayer(baseTree[layer.name].layer);
            map.fitBounds(bounds);
        }
    });

    // Get URL

    let getLayerUrl = function (layer, filter) {

        let owsrootUrl = '/geoserver/sirius/ows';
        let defaultParameters = {
            service: 'WFS',
            version: '1.3.0',
            request: 'GetFeature',
            typeName: 'sirius:' + layer,
            outputFormat: 'application/json',
            SrsName: 'EPSG:4326',
            maxFeatures: 1000
        };

        if (filter)
            defaultParameters['CQL_FILTER'] = filter;

        let parameters = L.Util.extend(defaultParameters),
            URL = owsrootUrl + L.Util.getParamString(parameters);

        return URL;
    };

    // Points

    let pointsLayer = L.geoJson(undefined, {
        onEachFeature: function (feature, layer) {
            if (feature.properties.Comment) {
                layer.bindPopup(feature.properties.Comment, {maxWidth: 200});
            }
        }
    });

    let clusterGroup = L.markerClusterGroup();
    map.addLayer(clusterGroup);

    overlayTree.push({
        label: '<div class="point-marker" style="background: #2B83CB"></div>' + "Отзывы за неделю",
        layer: clusterGroup
    });

    $.ajax({
        url: getLayerUrl('Report', 'Created>' + moment().subtract(7 , 'day').format('YYYY-MM-DDTHH:mm:ss')),
        dataType: 'json',
        success: function (response) {
            pointsLayer.addData(response);
            clusterGroup.addLayer(pointsLayer);
        }
    });

    // Layers

    let addVectorLayer = function (key, name, layerGroup, color, style, enabled, callback) {

        let layer = L.geoJSON(undefined, {
            pointToLayer: function(feature, latlng) {
                if (color != 'transparent') {
                    let icon = new L.Icon({
                        iconUrl: 'marker/marker-icon-2x-' + color + '.png',
                        shadowUrl: 'marker/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    return L.marker(latlng, {icon: icon});
                }
                return L.marker(latlng);
            },
            style: function (feature) {
                return {
                    fillColor: color,
                    color: color
                };
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(name, {maxWidth: 200});
            }
        });

        if (enabled)
            layer.addTo(map);

        layerGroup.push({
            label: '<div class="' + style + '-marker" style="background: ' + color + '"></div>' + name,
            layer: layer
        });

        $.ajax({
            url: getLayerUrl(key),
            dataType: 'json',
            success: function (response) {

                layer.addData(response);

                if (callback)
                    callback(layer);
            }
        });

        return layer;

    };

    let addRasterLayer = function (key, name, layerGroup, color, enabled, callback) {

        let layer = L.tileLayer.wms.colorPicker('/geoserver/sirius/wms', {
                layers: 'sirius:' + key,
                format: 'image/png',
                transparent: true,
                version: '1.3.0',
                opacity: 0.6,
                crs: L.CRS.EPSG4326
            });

        if (enabled)
            layer.addTo(map);

        layerGroup.push({
            label: '<div class="raster-marker" style="background: ' + color + '"></div>' + name,
            layer: layer
        });

        if (callback)
            callback(layer);

        return layer;

    };

    //===============================================================

    let infraGroup = {
        label: 'Инфракрасный синтез',
        selectAllCheckbox: false,
        children: []
    }, naturalGroup = {
        label: 'Натуральный синтез',
        selectAllCheckbox: false,
        children: []
    }, reliefGroup = {
        label: 'Рельеф',
        selectAllCheckbox: false,
        children: []
    }, objectGroup = {
        label: 'Автоматическое детектирование объектов',
        selectAllCheckbox: false,
        children: []
    }, POIGroup = {
        label: 'Места общественного притяжения',
        selectAllCheckbox: false,
        children: []
    }, CadasterGroup = {
        label: 'Оценка качества постановки объектов на кадастровый учет',
        selectAllCheckbox: false,
        children: []
    };

    addVectorLayer('Federal', 'Федеральная территория', overlayTree, 'red', 'layer', true, function (layer) {
        map.fitBounds(layer.getBounds());
    });

    addVectorLayer('POI_shops', 'Магазины', POIGroup.children, 'red', 'point');
    //addVectorLayer('Social', 'Сфера услуг', POIGroup.children, 'transparent', 'point');
    addVectorLayer('Leisure', 'Досуг', POIGroup.children, 'green', 'point');
    addVectorLayer('Sport', 'Спорт', POIGroup.children, 'violet', 'point');
    addVectorLayer('Tourism', 'Туризм', POIGroup.children, 'yellow', 'point');

    addVectorLayer('Kadastr_1', '100% - 90%', CadasterGroup.children, 'green', 'layer');
    addVectorLayer('Kadastr_2', '90% - 60%', CadasterGroup.children, 'lightgreen', 'layer');
    addVectorLayer('Kadastr_3', '60% - 30%', CadasterGroup.children, 'yellow', 'layer');
    addVectorLayer('Kadastr_4', '30% - 0%', CadasterGroup.children, 'red', 'layer');

    addRasterLayer('Layer_Building', 'Здания и сооружения', objectGroup.children, 'transparent');
    addRasterLayer('Layer_Road', 'Дороги', objectGroup.children, 'transparent');
    addRasterLayer('Layer_Forest', 'Древесная растительность', objectGroup.children, 'transparent');
    addRasterLayer('NRG_Summer_Cut', 'Лето', infraGroup.children, 'transparent');
    addRasterLayer('NRG_Fall_Cut', 'Осень', infraGroup.children, 'transparent');
    addRasterLayer('NRG_Winter_Cut', 'Зима', infraGroup.children, 'transparent');
    addRasterLayer('Sentinel_NRG_Cut', 'Весна', infraGroup.children, 'transparent');
    addRasterLayer('RGB_Summer_Cut', 'Лето', naturalGroup.children, 'transparent');
    addRasterLayer('RGB_Fall_Cut', 'Осень', naturalGroup.children, 'transparent');
    addRasterLayer('RGB_Winter_Cut', 'Зима', naturalGroup.children, 'transparent');
    addRasterLayer('Sentinel_RGB_Cut', 'Весна', naturalGroup.children, 'transparent');
    addRasterLayer('SRTM30Colored', 'Высота', reliefGroup.children, 'transparent');
    addRasterLayer('SS', 'Крутизна склона', reliefGroup.children, 'transparent');
    addRasterLayer('Layer_Exposure', 'Экспозиция склона', reliefGroup.children, 'transparent');

    overlayTree.push(POIGroup);
    overlayTree.push(CadasterGroup);
    overlayTree.push(objectGroup);

    overlayTree.push({
        label: 'Спутниковые снимки',
        collapsed: true,
        selectAllCheckbox: false,
        children: [infraGroup, naturalGroup]
    });

    overlayTree.push(reliefGroup);

    // Add controls
    /*
    map.on("mousemove", function(event) {
        var a = objectGroup.children[0].layer.getColor(event.latlng);
        if (a !== null) {
            var hex = "#" + (0x1000000 + (a[0] << 16) + (a[1] << 8) + a[2]).toString(16).substr(1);
            var tmpl = "<b style='background:@;color:black;'>@</b>";
            if (Math.min(a[0], a[1], a[2]) < 0x40) tmpl = tmpl.replace("black", "white");
            map.attributionControl.setPrefix(tmpl.replace(/@/g, hex));
        } else {
            map.attributionControl.setPrefix("unavailable");
        }
    });
    */

    L.easyButton('fa-comment', function () {
        location.href = 'download/app-debug.apk';
    }).addTo(map);

    L.easyButton('fa-cloud', function () {
        location.href = 'https://datalens.yandex/3p1mdbbxcnoax';
    }).addTo(map);

    L.control.layers.tree(baseTree, overlayTree).addTo(map);
    L.control.scale().addTo(map);
    L.control.mousePosition().addTo(map);

}).call(this);
