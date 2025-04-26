// @component
// export class NewScript extends BaseScriptComponent {
//     @input
//     mapComponent: MapComponent;

//     onStartEvent: ScriptEvent = null;

//     onAwake(): void {
//         this.onStartEvent = this.createEvent("OnStartEvent");
//         this.onStartEvent.bind(this.onStart.bind(this));
//     }

//     private onStart(): void {
//         if (!this.mapComponent || !this.mapComponent.api) {
//             print("MapComponent input is not assigned properly!");
//             return;
//         }

//         const onMaptilesLoaded = () => {
//             const longitude: number = -0.129956;
//             const latitude: number = 51.51277;
//             const mapPin: SceneObject = this.mapComponent.api.createMapPin(longitude, latitude);
//         };

//         this.mapComponent.onMaptilesLoaded(onMaptilesLoaded);
//     }
// }
