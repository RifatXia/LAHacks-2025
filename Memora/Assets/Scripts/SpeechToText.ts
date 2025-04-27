@component
export class SpeechToText extends BaseScriptComponent {
  @input()
  text: Text;
  // Remote service module for fetching data
  private voiceMLModule: VoiceMLModule = require("LensStudio:VoiceMLModule");

  onAwake() {
    let options = VoiceML.ListeningOptions.create();
    options.shouldReturnAsrTranscription = true;
    options.shouldReturnInterimAsrTranscription = true;
    this.voiceMLModule.onListeningEnabled.add(() => {
      this.voiceMLModule.startListening(options);
      this.voiceMLModule.onListeningUpdate.add(this.onListenUpdate);
    });
  }

  onListenUpdate = (eventData: VoiceML.ListeningUpdateEventArgs) => {
    if (eventData.isFinalTranscription) {
      this.text.text = eventData.transcription;
    }
  };
}

// import { Interactable } from "../SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable";
// import { MicrophoneRecorder } from "./MicrophoneRecorder";

// type AudioFrameData = {
//   audioFrame: Float32Array;
//   audioFrameShape: vec3;
// };

// const SAMPLE_RATE = 44100;

// @component
// export class SpeechRecorderAndTranscriber extends BaseScriptComponent {
//   @input
//   microphoneAsset: AudioTrackAsset;

//   @input
//   audioOutput: AudioTrackAsset;

//   @input
//   text: Text;

//   @input
//   @allowUndefined
//   debugText: Text;

//   private microphoneRecorder: MicrophoneRecorder;
//   private interactable: Interactable;
//   private voiceMLModule: VoiceMLModule = require("LensStudio:VoiceMLModule");
//   private listeningUpdateEventRegistration: EventRegistration = null;

//   onAwake() {
//     // Create and setup MicrophoneRecorder
//     this.microphoneRecorder = new MicrophoneRecorder();
//     this.microphoneRecorder.sceneObject = this.sceneObject;
//     this.microphoneRecorder.microphoneAsset = this.microphoneAsset;
//     this.microphoneRecorder.audioOutput = this.audioOutput;
//     this.microphoneRecorder.debugText = this.debugText;
//     this.microphoneRecorder.onAwake();

//     // Setup Interactable for starting/stopping recording
//     this.interactable = this.sceneObject.getComponent(Interactable.getTypeName());
//     if (this.interactable) {
//       this.interactable.onTriggerStart.add(() => {
//         this.microphoneRecorder.recordMicrophoneAudio(true);
//         this.startListening();
//       });
//       this.interactable.onTriggerEnd.add(() => {
//         this.microphoneRecorder.recordMicrophoneAudio(false);
//         this.stopListening();
//       });
//       this.interactable.onTriggerCanceled.add(() => {
//         this.microphoneRecorder.recordMicrophoneAudio(false);
//         this.stopListening();
//       });
//     } else {
//       print("Warning: Interactable component not found on the SceneObject!");
//     }
//   }

//   private startListening() {
//     let options = VoiceML.ListeningOptions.create();
//     options.shouldReturnAsrTranscription = true;
//     options.shouldReturnInterimAsrTranscription = true;
  
//     this.listeningUpdateEventRegistration = this.voiceMLModule.onListeningUpdate.add((eventData) => {
//       this.onListenUpdate(eventData);
//     });
  
//     this.voiceMLModule.startListening(options);
//   }
  
//   private stopListening() {
//     this.voiceMLModule.stopListening();
  
//     if (this.listeningUpdateEventRegistration) {
//       this.voiceMLModule.onListeningUpdate.remove(this.listeningUpdateEventRegistration);
//       this.listeningUpdateEventRegistration = null;
//     }
//   }

//   private onListenUpdate = (eventData: VoiceML.ListeningUpdateEventArgs) => {
//     if (eventData.isFinalTranscription && this.text) {
//       this.text.text = eventData.transcription;
//     }
//   };
// }
