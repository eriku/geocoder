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

app.controller('appCtrl', function($scope) {

    $scope.toggle = false;
    $scope.address;
    $scope.addressResults;
    $scope.addressItems;
    $scope.addressLatLng = [];
    $scope.addressLink;

    // $scope.geocodePosition = function(pos, geocoder, map, infowindow) {
    //     console.log(pos);
    //     var latlng = {lat: parseFloat(pos.lat()), lng: parseFloat(pos.lng())};
    //     geocoder.geocode({'location': latlng}, function(results, status) {
    //         if (status === google.maps.GeocoderStatus.OK) {
    //             if (results[1]) {
    //                 console.log(results[1]);
    //                 $scope.$apply(function(){
    //                     $scope.addressResults = results[1];
    //                     $scope.addressItems = results[1].address_components;
    //                     $scope.addressLatLng.lat = results[1].geometry.location.lat().toString();
    //                     $scope.addressLatLng.lng = results[1].geometry.location.lng().toString();
    //                 });
    //                 map.setCenter(latlng);
    //             } else if (results[0]) {
    //                 $scope.$apply(function(){
    //                     $scope.addressResults = results[0];
    //                     $scope.addressItems = results[0].address_components;
    //                     $scope.addressLatLng.lat = results[0].geometry.location.lat().toString();
    //                     $scope.addressLatLng.lng = results[0].geometry.location.lng().toString();
    //                 });
    //                 map.setCenter(latlng);
    //             } else {
    //                 window.alert('No results found');
    //             }
    //         } else {
    //             window.alert('Geocoder failed due to: ' + status);
    //         }
    //     });
    // };

    $scope.geocode = function(geocoder, map, infowindow) {
        if ($scope.address && $scope.address.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            var latlngArray = $scope.address.split(',');
            // First check if search is lat/lng
            if (latlngArray.length === 2 && ($.isNumeric(latlngArray[0]) && $.isNumeric(latlngArray[1]))) {
                var latlng = {lat: parseFloat(latlngArray[0]), lng: parseFloat(latlngArray[1])};
                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.$apply(function(){
                                $scope.addressResults = results[1];
                                $scope.addressItems = results[1].address_components;
                                $scope.addressLatLng.lat = results[1].geometry.location.lat().toString();
                                $scope.addressLatLng.lng = results[1].geometry.location.lng().toString();
                                $scope.addressLink = 'http://maps.google.com/maps?z=12&q=' + results[1].formatted_address;
                                $scope.addressLink = $scope.addressLink.replace(/ /g,'+');
                            });
                            map.setCenter(latlng);
                            var marker = new google.maps.Marker({
                                position: latlng,
                                // draggable: true,
                                map: map
                            });
                            // google.maps.event.addListener(marker, 'dragend', function() {
                            //     $scope.geocodePosition(marker.getPosition(), geocoder, map, infowindow);
                            // });
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
                            $scope.addressResults = results[0];
                            $scope.addressItems = results[0].address_components;
                            $scope.addressLatLng.lat = results[0].geometry.location.lat().toString();
                            $scope.addressLatLng.lng = results[0].geometry.location.lng().toString();
                            $scope.addressLink = 'http://maps.google.com/maps?z=12&q=' + results[0].formatted_address;
                            $scope.addressLink = $scope.addressLink.replace(/ /g,'+');
                        });
                        var loc = results[0].geometry.location;
                        map.setCenter(loc);
                        var marker = new google.maps.Marker({
                            map: map,
                            // draggable: true,
                            position: loc
                        });
                        // google.maps.event.addListener(marker, 'dragend', function() {
                        //     $scope.geocodePosition(marker.getPosition(), geocoder, map, infowindow);
                        // });
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
        console.log($(event.currentTarget));
        $(event.currentTarget).addClass('success').delay(1000).queue(function(){
            $(this).removeClass('success').dequeue();
        });
    };
});

// - Documentation: https://developers.google.com/maps/documentation/
app.directive('appMap', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function (scope, element, attrs) {
            var myLatlng = new google.maps.LatLng(37.09024, -95.712891);
            var mapOptions = {
                center: myLatlng,
                zoom: 3
            };
            var map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);
            var geocoder = new google.maps.Geocoder();
            var infowindow = new google.maps.InfoWindow;
            var marker;
            // google.maps.event.addListener(marker, 'dragend', function() {
            //   scope.geocodePosition(marker.getPosition(), geocoder, map, infowindow);
            // });
            document.getElementById('searchForm').addEventListener('submit', function() {
                scope.geocode(geocoder, map, infowindow, marker);
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

app.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath('//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf');
}]);
