<html>
<head>
    <title>Symantec skill search</title>
    <link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.10/angular.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.10/angular-ui-router.js"></script>
    <script src="angularApp.js"></script>
</head>


<body ng-app="skillSearch" ng-controller="SearchCtrl">index
<div class="row">
    <div class="col-md-6 col-md-offset-3">
        <div ui-view></div>
    </div>
</div>

<!--routing for the search page-->
<script type="text/ng-template" id="/search.html">
<div class="page-header">
    <h1>Symantec skill locator</h1>
</div>
<form ng-submit="searchSkill()" style="margin-top:30px;">
    <h3>Search for a skill</h3>
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Java" ng-model="title"></input>
    </div>
    <button type="submit" class="btn btn-primary">Search</button>
</form>
</script>
</body>
</html>