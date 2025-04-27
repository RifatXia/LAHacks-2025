// const GeoLocation = require("Geolocation");

// function SimpleLocationFetcher() {
//     this.locationService = GeoLocation.createLocationService();
//     this.locationService.accuracy = GeoLocation.LocationAccuracy.Navigation;
// }

// SimpleLocationFetcher.prototype.fetchLocation = function(callback) {
//     this.locationService.getCurrentPosition(
//         function(location) {
//             print("Location fetched: " + location.latitude + ", " + location.longitude);
//             callback(location);
//         },
//         function(error) {
//             print("Failed to fetch location: " + error);
//         }
//     );
// };

// var locationFetcher = new SimpleLocationFetcher();

// // Fetch location once after 1 second
// var delayedEvent = script.createEvent("DelayedCallbackEvent");
// delayedEvent.bind(function() {
//     print("Delayed callback triggered, attempting to fetch location");
//     locationFetcher.fetchLocation(function(location) {
//         print("Location callback executed");
//         print(JSON.stringify(location)); // Better way to print the object
//     });
// });
// delayedEvent.reset(1.0); // Use reset method to schedule the event