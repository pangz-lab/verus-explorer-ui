'use strict';

// var ZeroClipboard = window.ZeroClipboard;

angular.module('insight')
    .directive('scroll', function ($window) {
        return function (scope, element, attrs) {
            angular.element($window).bind('scroll', function () {
                if (this.pageYOffset >= 200) {
                    scope.secondaryNavbar = true;
                } else {
                    scope.secondaryNavbar = false;
                }
                scope.$apply();
            });
        };
    })
    .directive('whenScrolled', function ($window) {
        return {
            restric: 'A',
            link: function (scope, elm, attr) {
                var pageHeight, clientHeight, scrollPos;
                $window = angular.element($window);

                var handler = function () {
                    pageHeight = window.document.documentElement.scrollHeight;
                    clientHeight = window.document.documentElement.clientHeight;
                    scrollPos = window.pageYOffset;

                    if (pageHeight - (scrollPos + clientHeight) === 0) {
                        scope.$apply(attr.whenScrolled);
                    }
                };

                $window.on('scroll', handler);

                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
            }
        };
    }).directive('copyToClipboard', function () {
        return {
            restrict: 'A',
            // template: '<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>',
            link: function (scope, element, attrs) {
                // element.attr('uib-tooltip', 'Click to copy'); // Set tooltip text
                // element.attr('tooltip-trigger', 'mouseenter'); // Show tooltip on mouse enter
                // element.attr('tooltip-placement', 'top'); // Set tooltip placement
                // element.tooltip();
                element.on('click', function () {
                    // this.tooltip('toggle');
                    var textToCopy = attrs.copyToClipboard;
                    // var attachedElement = angular.element('<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>');
                    // // Append the attachedElement to the body
                    // this.re append(attachedElement);

                    // // Compile the attachedElement to apply AngularJS bindings
                    // $compile(attachedElement)(scope);

                    navigator.clipboard.writeText(textToCopy)
                        .then(function () {
                            alert(textToCopy + ' copied!');
                        })
                        .catch(function (error) { console.error('Unable to copy text to clipboard: ', error); });
                });
            }
        };
    })
    .directive('focus', function ($timeout) {
        return {
            scope: {
                trigger: '@focus'
            },
            link: function (scope, element) {
                scope.$watch('trigger', function (value) {
                    if (value === "true") {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    })
    .directive('csvDownload', function () {
        return {
            restrict: 'A',
            scope: {
                data: '=',
                contentTitle: '=',
                filename: '=',
            },
            link: function (scope, element) {
                element.on('click', function () {
                    if (!scope.data || scope.data[0] === undefined) {
                        console.error('No title or data provided for CSV download.');
                        return;
                    }

                    const fileName = scope.filename != undefined ? scope.filename + '.csv' : 'data.csv';
                    // Convert data to CSV format
                    var csvContent = "data:text/csv;charset=utf-8,";
                    if (scope.contentTitle[0] != undefined) {
                        csvContent += scope.contentTitle.join(',') + '\n';
                    }
                    csvContent += scope.data.map(function (row) {
                        return row.join(',');
                    }).join('\n');

                    var encodedUri = encodeURI(csvContent);
                    var link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);

                    link.click();
                    document.body.removeChild(link);
                });
            }
        };
    })
    .directive('reloadPage', ['$route', function($route) {
        return {
            restrict: 'E', // Restrict the directive to be used as an element
            template: '<button class="btn btn-info btn-sm" ng-click="reloadPage()">reload</button>', // Template for the directive
            controller: function($scope) {
                $scope.reloadPage = function() {
                    $route.reload(); // Reload the page using $window service
                };
            }
        };
    }]);
