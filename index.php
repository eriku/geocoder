<?php
  $sPageUrl = 'http://erikuunila.com/geocoder/';
  $sPageTitle = 'Google Geocoder | Erik Uunila';
  $sPageDesc = 'Get google maps information from an address. Including latitude &amp; longitude';
  $sPageKeywords = 'google map, google maps, latitude, longitude, geocode, address search';
  $sPageImage = $sPageUrl . 'images/og_image.jpg';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title><?php echo $sPageTitle; ?></title>

  <meta content="/favicon.png" itemprop="image">
  <link href="/favicon.ico" rel="shortcut icon">

  <meta name="description" content="<?php echo $sPageDesc; ?>" />
  <meta name="keywords" content="<?php echo $sPageKeywords; ?>" />
  <meta name="author" content="Erik Uunila">
  <meta name="robots" content="index, follow">
  <meta name="revisit-after" content="3 month">
  <!-- latitude, longitude, geocode -->

  <meta property="og:title" content="<?php echo $sPageTitle; ?>">
  <meta property="og:site_name" content="Erik Uunila">
  <meta property="og:url" content="<?php echo $sPageUrl; ?>">
  <meta property="og:description" content="<?php echo $sPageDesc; ?>">
  <meta property="og:type" content="website">
  <meta property="og:image" content="<?php echo $sPageImage; ?>">
	<meta property="fb:app_id" content="750827111714594"; ?>

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="euunila">
  <meta name="twitter:title" content="<?php echo $sPageTitle; ?>">
  <meta name="twitter:description" content="<?php echo $sPageDesc; ?>">
  <meta name="twitter:image:src" content="<?php echo $sPageImage; ?>">

  <!-- Bootstrap: CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

  <!-- Bootstrap: Theme -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>

  <!-- Bootstrap: JS -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

  <!-- Google Maps -->
  <!-- <script src="https://maps.google.com/maps/api/js?key=AIzaSyD-9FWU82CZ3SzpxUNjsZ1Vh6XS5o55uiQ&amp;sensor=true"></script> -->
  <script src="https://maps.google.com/maps/api/js?sensor=true"></script>

  <!-- AngularJS -->
  <script src="https://code.angularjs.org/1.3.15/angular.min.js"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.js"></script>

  <!-- Custom App -->
  <script src="js/app.js"></script>
  <script src="js/copytoclipboard.js"></script>
</head>
<body ng-app="app" ng-controller="appCtrl">
  <div class="jumbotron">
    <div class="container">
      <h1>Google Geocoder</h1>
      <p>Enter an address, see it on the map and get the latitude &amp; longitude.</p>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <form id="searchForm">
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></div>
            <input type="text" placeholder="Address or lat,lng" class="form-control" id="search" name="search" autofocus ng-model="search"/>
            <div class="input-group-btn"><button id="submit" type="submit" class="btn btn-primary" ng-disabled="search.length == 0">Go</button></div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-md-7 col-md-push-5">
        <!-- current location -->
        <div class="text-info text-left table-responsive" ng-show="searchItems">
          <table class="table table-striped table-hover small text-nowrap">
            <tr ng-repeat="item in searchItems">
              <th>{{item.types[0] | labeler}}</th>
              <td>{{item.short_name}}</td>
            </tr>
            <tr>
              <th>Latitude</th>
              <td>{{searchResults.geometry.location.lat()}}</td>
            </tr>
            <tr>
              <th>Longitude</th>
              <td>{{searchResults.geometry.location.lng()}}</td>
            </tr>
            <tr>
              <th>Place ID</th>
              <td>{{searchResults.place_id}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="col-md-5 col-md-pull-7">
        <app-map id="map-canvas" style="height: 375px"></app-map>
      </div>
    </div>
  </div>
  <hr>
  <footer>
    <div class="container">
      <div class="row text-center">
        <p>Built With:<br/>
          <img src="images/angularjs-logo.png" alt="Built with AngularJS" height="24" width="auto">
          <img src="images/bootstrap-logo.png" alt="Built with Bootstrap" height="24" width="auto">
        </p>
        <p><small>&copy; <?php echo date('Y'); ?> Ain't got no stinking copyright.</small></p>
        <p><small>Built By: <a href="http://erikuunila.com">Erik Uunila</a></small></p>
      </div>
    </div>
  </footer>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-38747673-4', 'auto');
  ga('send', 'pageview');

</script>
</body>
</html>
