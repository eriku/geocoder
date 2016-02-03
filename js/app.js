/*!
 *
 * Google Geocoder
 * -----------------
 *
 * @TODO: Drag marker & update data table (commented out code for now)
 * @TODO: Create shortened URL for google maps link using Public API
 *        - https://developers.google.com/url-shortener/v1/getting_started
 *
 */

function ucwords(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g,
    function(firstLetter){
        return firstLetter.toUpperCase();
    });
}

// --- Start Angular Code ---
var app = angular.module('app', ['ui.directives', 'ngClipboard']);

app.controller('appCtrl', function($scope, $http) {

    $scope.toggle = false;
    $scope.address;
    $scope.addressResults;
    $scope.addressItems;
    $scope.addressLatLng = [];
    $scope.addressLink;

    // Create Short URL using Google URL Shortener API
    $scope.createUrl = function(url) {
        // var googleAPIKey = 'AIzaSyD-9FWU82CZ3SzpxUNjsZ1Vh6XS5o55uiQ';
        var googleAPIKey = 'AIzaSyDd6a4GKpiPKTH3AiODafvy7nrjXwgO-oM';
        var googleShortenerUrl = 'https://www.googleapis.com/urlshortener/v1/url?key=' + googleAPIKey;
        $http
            .post(googleShortenerUrl, {longUrl: url})
            .success(function (resp){
              $scope.shortUrl = resp.id;
            });
    };

    $scope.geocodePosition = function(position, geocoder, map) {
        var gResults = '';
        var latlng = {lat: parseFloat(position.lat()), lng: parseFloat(position.lng())};
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    gResults = results[1];
                    $scope.$apply(function(){
                        $scope.applyData(results[1]);
                    });
                    map.setCenter(latlng);
                    $scope.createUrl($scope.addressLink);
                } else if (results[0]) {
                    gResults = results[0];
                    $scope.$apply(function(){
                        $scope.applyData(results[0]);
                    });
                    map.setCenter(latlng);
                    $scope.createUrl($scope.addressLink);
                } else {
                    window.alert('No results found');
                }
                if (gResults.length) {
                  console.log(gResults);
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    };

    $scope.applyData = function(results) {
        $scope.addressResults = results;
        $scope.addressItems = results.address_components;
        $scope.addressLatLng.lat = results.geometry.location.lat().toString();
        $scope.addressLatLng.lng = results.geometry.location.lng().toString();
        $scope.addressLink = 'http://maps.google.com/maps?z=12&q=' + results.formatted_address;
        $scope.addressLink = $scope.addressLink.replace(/ /g,'+');
    };

    $scope.geocode = function(geocoder, map, marker, markers) {
        if ($scope.address && $scope.address.length > 0) {
            if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
            var latlngArray = $scope.address.split(',');
            // First check if search is lat/lng
            if (latlngArray.length === 2 && ($.isNumeric(latlngArray[0]) && $.isNumeric(latlngArray[1]))) {
                var latlng = {lat: parseFloat(latlngArray[0]), lng: parseFloat(latlngArray[1])};
                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.$apply(function(){
                                $scope.applyData(results[1]);
                            });
                            map.setCenter(latlng);
                            $scope.createUrl($scope.addressLink);
                            var marker = new google.maps.Marker({
                                position: latlng,
                                draggable: true,
                                map: map
                            });
                            markers.push(marker);
                            google.maps.event.addListener(marker, 'dragend', function() {
                                $scope.geocodePosition(marker.getPosition(), geocoder, map);
                            });
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
            // Then assume that search is an Address
            } else {
                this.geocoder.geocode({'address': $scope.address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        $scope.$apply(function(){
                            $scope.applyData(results[0]);
                        });
                        var loc = results[0].geometry.location;
                        map.setCenter(loc);
                        $scope.createUrl($scope.addressLink);
                        var marker = new google.maps.Marker({
                            map: map,
                            draggable: true,
                            position: loc
                        });
                        markers.push(marker);
                        google.maps.event.addListener(marker, 'dragend', function() {
                            $scope.geocodePosition(marker.getPosition(), geocoder, map);
                        });
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            }
            map.setZoom(16);
        }
    };

    $scope.getTextToCopy = function(copy) {
      return copy;
    };

    $scope.fallback = function(copy) {
      window.prompt('Press cmd+c to copy the text below.', copy);
    };

    $scope.flashClass = function(event) {
        $(event.currentTarget).addClass('success').delay(1000).queue(function(){
            $(this).removeClass('success').dequeue();
        });
    };
});

// - Documentation: https://developers.google.com/maps/documentation/
app.directive('appMap', function () {
    var markers = [];
    function clearOverlays() {
        for (var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
        }
        markers.length = 0;
    }
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function (scope, element, attrs) {
            var marker;
            var myLatlng = new google.maps.LatLng(37.09024, -95.712891);
            var mapOptions = {
                center: myLatlng,
                zoom: 3
            };
            var map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);
            var geocoder = new google.maps.Geocoder();
            // var infowindow = new google.maps.InfoWindow;
            document.getElementById('searchForm').addEventListener('submit', function() {
                clearOverlays();
                scope.geocode(geocoder, map, marker, markers);
            });
        }
    };
});

app.filter('labeler', function () {
  return function (input) {
      input = input.replace(/_/g, ' ');
      switch (input) {
        case 'point of interest':
             input = 'corner';
             break;
        case 'administrative area level 1':
            input = 'state/province';
            break;
        case 'administrative area level 2':
            input = 'county/district';
            break;
        case 'administrative area level 3':
            input = 'city';
            break;
        case 'locality':
            input = 'city';
            break;
        case 'sublocality level 1':
            input = 'city';
            break;
        case 'postal code':
            input = 'zip/postal code';
            break;
        case 'subpremise':
            input = 'unit';
            break;
        case 'route':
            input = 'road';
            break;
      }
      // return input;
      return ucwords(input);
  };
});

app.filter('cif', function () {
   return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
   };
});

app.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath('//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf');
}]);

// formats latitude or longitude to 6 decimal places
app.filter('latlng', function () {
    return function (input) {
        input = input * 1;
        input = input.toFixed(6);
        return input;
    };
});
