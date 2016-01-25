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

    $scope.search = 'Surrey BC';
    $scope.searchResults;

    $scope.geocode = function(geocoder, map, infowindow) {
        if ($scope.search && $scope.search.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            var latlngArray = $scope.search.split(',');
            // First check if search is lat/lng
            if (latlngArray.length == 2 && ($.isNumeric(latlngArray[0]) && $.isNumeric(latlngArray[1]))) {
                var latlng = {lat: parseFloat(latlngArray[0]), lng: parseFloat(latlngArray[1])};
                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.searchResults = results[1];
                            $scope.searchItems = results[1].address_components;
                            map.setCenter(results[1].geometry.location);
                            var marker = new google.maps.Marker({
                                position: latlng,
                                map: map
                            });
                            infowindow.setContent(results[1].formatted_address);
                            infowindow.open(map, marker);
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
                        $scope.searchResults = results[0];
                        $scope.searchItems = results[0].address_components;
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, marker);
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
                console.log();
            }
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
            var myLatlng = new google.maps.LatLng(49.2827,-123.1207);
            var mapOptions = {
                center: myLatlng,
                zoom: 16
            };
            var map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);
            var geocoder = new google.maps.Geocoder();
            var infowindow = new google.maps.InfoWindow;
            var marker;
            marker = new google.maps.Marker({
                position: myLatlng,
                draggable: true,
                map: map,
                title: 'My Town'
            });
            document.getElementById('searchForm').addEventListener('submit', function() {
                scope.geocode(geocoder, map, infowindow, marker);
            });
        }
    };
});

app.filter('labeler', function () {
  return function (input) {
      input = input.replace(/_/g, ' ');
      return ucwords(input);
  };
});
