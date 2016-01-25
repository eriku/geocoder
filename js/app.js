function ucwords(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g,
    function(firstLetter){
        return firstLetter.toUpperCase();
    });
}

// --- Start Angular Code ---
var app = angular.module('app', ['ui.directives']);

app.controller('appCtrl', function($scope) {

    $scope.search;
    $scope.searchResults;
    $scope.searchItems;

    $scope.geocode = function(geocoder, map, infowindow) {
        if ($scope.search && $scope.search.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            var latlngArray = $scope.search.split(',');
            // First check if search is lat/lng
            if (latlngArray.length === 2 && ($.isNumeric(latlngArray[0]) && $.isNumeric(latlngArray[1]))) {
                var latlng = {lat: parseFloat(latlngArray[0]), lng: parseFloat(latlngArray[1])};
                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.$apply(function(){
                                $scope.searchResults = results[1];
                                $scope.searchItems = results[1].address_components;
                            });
                            map.setCenter(latlng);
                            var marker = new google.maps.Marker({
                                position: latlng,
                                map: map
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
                this.geocoder.geocode({'address': $scope.search}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        $scope.$apply(function(){
                            $scope.searchResults = results[0];
                            $scope.searchItems = results[0].address_components;
                        });
                        var loc = results[0].geometry.location;
                        map.setCenter(loc);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: loc
                        });
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            }
            map.setZoom(16);
        }
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
