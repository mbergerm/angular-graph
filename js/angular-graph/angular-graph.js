/**
 * Created by mbergerm on 01.02.14.
 */

angular.module('AngularGraph', ['uiSlider'])
    .directive('graph', function(){
        return {
            restrict: 'E',
            transclude: true,
            template: '<div ng-transclude></div>',
            controller: function () {
                this.datasets={};
                this.datasetsDirty = 0;
                this.addDataset = function(key, color, dataset) {
                    if (dataset !== 'NaN') {
                        this.datasets[key]={data:dataset.value, color: color};
                        this.datasetsDirty++;
                    }

                }
            }
        }
    })


    .directive('dataset', function(){
        return {
            require: ['^?graph', '^?ngModel'],
            restrict: 'E',
            link: function (scope, element, attrs, controllers) {
                var graphController = controllers[0];
                var ngModel = controllers[1];

                if (!ngModel) {
                    console.log('no model!');
                    return;
                }
                 scope.$watchCollection(attrs.ngModel, function() {
                    if (ngModel.$viewValue)
                        graphController.addDataset(attrs.name, attrs.color, ngModel.$viewValue);
                }, true);
            }
        }

    })


    .directive('areaGraph', function(){
        return {
            restrict: 'E',
            require:'^?graph',
            link: function (scope, element, attrs, graphController) {
                scope.redraw = function(){
                    if (!scope.kineticStageObj) {
                        var id = attrs["id"];
                        //create random unique id
                        if (!id) {
                            id = Math.random().toString(36).substring(7);
                        }
                        if (!scope.kineticStageObj) {
                            scope.kineticStageObj = new Kinetic.Stage({
                                container: id,
                                width: attrs.width,
                                height: attrs.height
                            });
                        }
                        if (!scope.kineticStageObj.container) {
                            scope.kineticStageObj.attrs.container = id;
                        }
                    }
                    scope.kineticStageObj.removeChildren();

                    for(var i=0; i<Object.keys(graphController.datasets).length;i++) {
                        var data = graphController.datasets[Object.keys(graphController.datasets)[i]].data;
                        var color = graphController.datasets[Object.keys(graphController.datasets)[i]].color;

                        var step = attrs.width/data.length;

                        var layer = new Kinetic.Layer();
                        var points = [0,attrs.height];
                        for (var j=1; j <= data.length; j++) {
                            points.push(step*j);
                            points.push(attrs.height-data[j-1]);
                        }
                        points.push(attrs.width*100, attrs.height*10);
                        var fill;
                        var strokeWidth;
                        if ((attrs.fill) && (attrs.fill !== false) && (attrs.fill !== 'false')){
                            fill = color;
                            strokeWidth = 0;
                        } else {
                            if (attrs.strokeWidth)
                                strokeWidth = attrs.strokeWidth;
                            else
                                strokeWidth = 2;
                        }
                        var area = new Kinetic.Line({
                            points: points,
                            fill: fill,
                            stroke: color,
                            strokeWidth: strokeWidth,
                            closed: true,
                            tension: attrs.tension
                        });
                        layer.add(area);
                        scope.kineticStageObj.add(layer);
                    }
               };

                scope.$watch(function() {
                    "use strict";
                    return graphController.datasets;
                }, function() {
                    "use strict";
                    scope.redraw();
                }, true);
            }
        }
    })

    .directive('legend', function(){
        return {
            restrict: 'E',
            require:'^?graph',
            template:
                '<div>' +
                '   <div  ng-repeat="element in elements" >' +
                        '<div style="background-color: {{element.color}}; float: left; min-width: 20px;margin-right: 5px">&nbsp;</div>' +
                        '<div>{{element.name}}</div>' +
                    '</div>' +
                '   <div ng-transclude></div>' +
                '</div>',
            transclude: true,
            replace: true,
            link: function (scope, element, attrs, graphController) {
                "use strict";
                scope.elements=[];
                scope.$watch(function() {
                    return graphController.datasetsDirty;
                }, function() {
                    scope.elements=[];
                    for (var i=0; i < Object.keys(graphController.datasets).length; i++){
                        scope.elements.push({name : Object.keys(graphController.datasets)[i], color: graphController.datasets[Object.keys(graphController.datasets)[i]].color});
                    }
                });
            }
        }
    });