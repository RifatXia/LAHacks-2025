// @input Component.ScriptComponent mapComponent

script.createEvent('OnStartEvent').bind(function () {
    var onMaptilesLoaded = function () {
      var longitude = -0.129956;
      var latitude = 51.51277;
      var mapPin = script.mapComponent.createMapPin(longitude, latitude);
    };
  
    script.mapComponent.onMaptilesLoaded(onMaptilesLoaded);
  });