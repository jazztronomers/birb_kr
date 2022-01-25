document.addEventListener("DOMContentLoaded", function(){
    getData();
});


function getData() {
    var req = new XMLHttpRequest()
    req.responseType = 'json';
    req.onreadystatechange = function()
    {
        if (req.readyState == 4)
        {
            if (req.status != 200)
            {
                console.log('hello')
            }
            else
            {
                showData(req.response)
            }
        }
    }
    req.open('POST', '/getMarker')
    req.setRequestHeader("Content-type", "application/json")
    req.send()
}

function showData(data) {

    let map = new naver.maps.Map('map', {
        zoom: 6,
        center: new naver.maps.LatLng(36.2253017, 127.6460516),
        zoomControl: true,
        zoomControlOptions: {
            position: naver.maps.Position.TOP_LEFT,
            style: naver.maps.ZoomControlStyle.SMALL
        }
    })

    var htmlMarker1 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(static/images/cluster-marker-1.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker2 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(static/images/cluster-marker-2.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker3 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(static/images/cluster-marker-3.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker4 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(static/images/cluster-marker-4.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker5 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(static/images/cluster-marker-5.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
    };


    markers = [];

    for (var i = 0, ii = data.length; i < ii; i++) {
        var spot = data[i]
        latlng = new naver.maps.LatLng(spot.grd_la, spot.grd_lo),  // latitude longitude
        marker = new naver.maps.Marker({
            position: latlng,
            draggable: true,
            title: "" + spot.content_id
        });



        markers.push(marker);

    }



    var markerClustering = new MarkerClustering({
	        minClusterSize: 2,
	        maxZoom: 13,
	        map: map,
	        markers: markers,
	        disableClickZoom: false,
	        gridSize: 120,
	        icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
	        indexGenerator: [8, 64, 256, 512, 1000],
	        stylingFunction: function(clusterMarker, count) {
	            $(clusterMarker.getElement()).find('div:first-child').text(count);
	        }
	});



    // infowindow.open(map, marker);




}





