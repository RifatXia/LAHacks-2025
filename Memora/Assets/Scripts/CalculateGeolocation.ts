// @component
// export class NewScript extends BaseScriptComponent {
    
//     private remoteServiceModule: RawLocationModule = require("LensStudio:RawLocationModule");
//     private locationService;
//     private locationFetcher;

//     init() {
//         // Initialize location fetcher
//         this.initLocationFetcher();
        
//         // Fetch location once after 1 second
//         const delayedEvent = this.createEvent("DelayedCallbackEvent");
//         delayedEvent.bind(() => {
//             print("Delayed callback triggered, attempting to fetch location");
//             this.locationFetcher.fetchLocation((location) => {
//                 print("Location callback executed");
//                 print(JSON.stringify(location));
//             });
//         });
//         delayedEvent.reset(1.0);
//     }

//     initLocationFetcher() {
//         try {

//             // Create location service
//             this.locationService = GeoLocation.createLocationService();
//             this.locationService.accuracy = GeoLocationAccuracy.Navigation;
//             print("Location service initialized");
            
//             // Create location fetcher
//             this.locationFetcher = {
//                 fetchLocation: (callback) => {
//                     this.locationService.getCurrentPosition(
//                         (location) => {
//                             print(`Location fetched: ${location.latitude}, ${location.longitude}`);
//                             if (callback) {
//                                 callback(location);
//                             }
//                         },
//                         (error) => {
//                             print(`Failed to fetch location: ${error}`);
//                         }
//                     );
//                 }
//             };
//         } catch (e) {
//             print("Error initializing location service: " + e);
//         }
//     }
// }

require("LensStudio:RawLocationModule");

type Callback<T> = (value: T) => void;


class LocationManager {
  private locationService: any;

    private location = (geoPosition: GeoPosition): void => {
        print(`Current location: ${geoPosition}`);
    };

    constructor() {
    this.locationService = GeoLocation.createLocationService();
    this.locationService.onNorthAlignedOrientationUpdate.add(
        this.handleNorthAlignedOrientationUpdate.bind(this)
    );
    this.locationService.accuracy = GeoLocationAccuracy.Navigation;
    }

    private fetchLocation(callback: (geoPosition: GeoPosition) => void): void {
    this.locationService.getCurrentPosition(
        (geoPosition: GeoPosition) => {
        callback(geoPosition);
        },
        (error: any) => {
        print(`Error fetching location: ${error} \n ${new Error().stack}`);
        }
    );
    }

    private handleNorthAlignedOrientationUpdate(orientation: quat) {
        // this.orientation = orientation;
    
        // // GeoLocation.getNorthAlignedHeading() currently returns a offsetted heading when the user tilts their head in multiple axis.
        // // (e.g. tilting upward in x-axis and then to the left along the z-axis. The heading calculated from GeoLocation.getNorthAlignedHeading() will then start shifting to the left)
        // // This is a temporary fix to minimize the shifting. This will be replaced by GeoLocation.getNorthAlignedHeading when the issue is fixed.
        // this.heading = normalizeAngle(customGetEuler(orientation).y);
      }

}
