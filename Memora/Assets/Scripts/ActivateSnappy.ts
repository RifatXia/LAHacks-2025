import { VisionOpenAI } from "./VisionOpenAI";

@component
export class ActivateSnappy extends BaseScriptComponent {
  @input textInput: Text;
  @input textOutput: Text;

  @input visionOpenAIScript: VisionOpenAI; // Trigger VisionOpenAI directly

  private voiceMLModule: VoiceMLModule = require("LensStudio:VoiceMLModule");

  private isWaitingForUserPrompt: boolean = false; // NEW: Are we listening for the real prompt after "Hey Snappy"

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
      var transcript = eventData.transcription.toLowerCase();
      print("User said: " + transcript);
  
      if (this.textInput) {
        this.textInput.text = transcript;
      }
  
      if (!this.isWaitingForUserPrompt) {
        if (transcript.includes("hello snappy") || transcript.includes("hello, snappy") || transcript.includes("hey snappy") || transcript.includes("hey, snappy") || transcript.includes("hello") || transcript.includes("hey")) {
          print("Wake word detected! Listening for user command...");
          this.isWaitingForUserPrompt = true;
  
          if (this.textOutput) {
            this.textOutput.text = "Listening...";
          }
        } else if (transcript.includes("show family")){
          print("Showing family");
          
        }
      } else {
        if (transcript.trim() === "") {
          print("Silence detected after wake word. Cancelling.");
          this.isWaitingForUserPrompt = false;
          if (this.textOutput) {
            this.textOutput.text = "Didn't hear anything.";
          }
          return;
        }
  
        print("User prompt detected: " + transcript);
        if (this.visionOpenAIScript && this.visionOpenAIScript.isProcessing === false) {
          if (this.textInput.text) {
            this.textInput.text = transcript;
          }
          this.visionOpenAIScript.handleTriggerEnd(eventData);
        }
  
        this.isWaitingForUserPrompt = false;
      }
    }
  }  
}
