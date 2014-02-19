angular-graph
=============

    <script src="js/angular-1.2.10/angular-1.2.10/angular.js"></script>
    <script src="js/angular-graph/angular-graph.js"></script>
    <script src="js/angular-slider.js"></script>
    <script src="js/kinetic-v5.0.1.min.js"></script>


<div id="main-view" ng-app="AngularGraph" ng-controller="mainController">
        <graph>
            <dataset ng-model="dstest1" name="d1 Test" color="#ff0000"></dataset>
            <dataset ng-model="ds2" name="d2" color="#ffff00"></dataset>
            <dataset ng-model="ds3" name="d3" color="#aff0af"></dataset>
            <line-graph width="1000" height="600" class="graph"></line-graph>
            <legend class="legend"></legend>
        </graph>
        <form>
            <input type="number" ng-model="dstest1.value[0]">
            <input type="number" ng-model="ds2.value[1]">
            <slider ng-model="dstest1.value[3]" floor="0" ceiling="600"  ></slider>
        </form>
        <graph>
            <dataset ng-model="dstest1" name="d1 Test" color="#ff0000"></dataset>
            <dataset ng-model="ds2" name="d2" color="#ffff00"></dataset>
            <area-graph id="area-graph" width="1000" height="600" class="graph"></area-graph>
            <legend class="legend"></legend>
        </graph>
    </div>