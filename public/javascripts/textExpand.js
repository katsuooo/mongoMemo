/*
 textareaを縦expandするdirective
 事前に
 var app = angular.module... を定義しておくこと。
*/

function fitVertical(elem, attrs){
    var HEIGHT = attrs['clickexpand'] ? attrs['clickexpand'] : 20;
      var textHeight = elem[0].scrollHeight;
      var height = Math.floor(textHeight / HEIGHT) * HEIGHT
      /*
      if(height > HEIGHT) {
        height = height - HEIGHT;
      }
      */
      elem.css('height', height + 'px');
}


var clickexpandOn = false;
app.directive('clickexpand', [function() {
return {
  restrict: 'A',
  link: function(scope, elem, attrs){
      var HEIGHT = attrs['clickexpand'] ? attrs['clickexpand'] : 20;
      var resize = function(e) {
          var textHeight = e.target.scrollHeight;
          var height = Math.floor(textHeight / HEIGHT) * HEIGHT
          elem.css('height', height + 'px');
      };
      elem.bind('click', function() {
          fitVertical(elem, attrs);
          clickexpandOn = true;
      });
      elem.on('input', resize);
  }
}
}]);