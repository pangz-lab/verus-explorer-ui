'use strict';

// var ZeroClipboard = window.ZeroClipboard;

angular.module('insight')
  .directive('scroll', function ($window) {
    return function(scope, element, attrs) {
      angular.element($window).bind('scroll', function() {
        if (this.pageYOffset >= 200) {
          scope.secondaryNavbar = true;
        } else {
          scope.secondaryNavbar = false;
        }
        scope.$apply();
      });
    };
  })
  .directive('whenScrolled', function($window) {
    return {
      restric: 'A',
      link: function(scope, elm, attr) {
        var pageHeight, clientHeight, scrollPos;
        $window = angular.element($window);

        var handler = function() {
          pageHeight = window.document.documentElement.scrollHeight;
          clientHeight = window.document.documentElement.clientHeight;
          scrollPos = window.pageYOffset;

          if (pageHeight - (scrollPos + clientHeight) === 0) {
            scope.$apply(attr.whenScrolled);
          }
        };

        $window.on('scroll', handler);

        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
      }
    };
  }).directive('copyToClipboard', function() {
    return {
        restrict: 'A',
        // template: '<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>',
        link: function(scope, element, attrs) {
            // element.attr('uib-tooltip', 'Click to copy'); // Set tooltip text
            // element.attr('tooltip-trigger', 'mouseenter'); // Show tooltip on mouse enter
            // element.attr('tooltip-placement', 'top'); // Set tooltip placement
            // element.tooltip();
            element.on('click', function() {
                // this.tooltip('toggle');
                var textToCopy = attrs.copyToClipboard;
                // var attachedElement = angular.element('<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>');
                // // Append the attachedElement to the body
                // this.re append(attachedElement);
                
                // // Compile the attachedElement to apply AngularJS bindings
                // $compile(attachedElement)(scope);
            
                navigator.clipboard.writeText(textToCopy)
                    .then(function() {
                      alert(textToCopy + ' copied!');
                    })
                    .catch(function(error) { console.error('Unable to copy text to clipboard: ', error);});
            });
        }
    };
})
  // .directive('clipCopy', function() {
  //   ZeroClipboard.config({
  //     moviePath: '/lib/zeroclipboard/ZeroClipboard.swf',
  //     trustedDomains: ['*'],
  //     allowScriptAccess: 'always',
  //     forceHandCursor: true
  //   });

  //   return {
  //     restric: 'A',
  //     scope: { clipCopy: '=clipCopy' },
  //     template: '<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>',
  //     link: function(scope, elm) {
  //       var clip = new ZeroClipboard(elm);

  //       clip.on('load', function(client) {
  //         var onMousedown = function(client) {
  //           client.setText(scope.clipCopy);
  //         };

  //         client.on('mousedown', onMousedown);

  //         scope.$on('$destroy', function() {
  //           client.off('mousedown', onMousedown);
  //         });
  //       });

  //       clip.on('noFlash wrongflash', function() {
  //         return elm.remove();
  //       });
  //     }
  //   };
  // })
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
  });
