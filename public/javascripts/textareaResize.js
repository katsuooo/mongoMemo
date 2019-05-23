app.directive('resizeTextarea', function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: "<textarea style='overflow:hidden;'></textarea>",
      link: function(scope, element, attrs) {
        var HEIGHT = 25;
        var el = angular.element(element[0])
        el.css('lineHeight', HEIGHT + "px");
        //el.css('height', HEIGHT + "px");
        el.css('height', HEIGHT * 4 + "px");
        var resize = function(e) {
          var textHeight = e.target.scrollHeight;
          var height = ~~(textHeight / HEIGHT) * HEIGHT
          if (height < HEIGHT * 4){
              height = HEIGHT * 4;
          }
          el.css('height', height + "px");
          console.log(height)
        };
        el.on('input', resize);
        el.on('focus', resize);
      }
    }
  });
