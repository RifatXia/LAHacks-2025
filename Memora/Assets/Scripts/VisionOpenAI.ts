import { TextToSpeechOpenAI } from "./TextToSpeechOpenAI";

@component
export class VisionOpenAI extends BaseScriptComponent {
  @input textInput: Text;
  @input textOutput: Text;
  @input image: Image;
  // @input interactable: Interactable;
  @input ttsComponent: TextToSpeechOpenAI;

  // Remote service module for fetching data
  private remoteServiceModule: RemoteServiceModule = require("LensStudio:RemoteServiceModule");

  public isProcessing: boolean = false;

  async handleTriggerEnd(eventData) {
    if (this.isProcessing) {
      print("A request is already in progress. Please wait.");
      return;
    }

    if (!this.textInput.text || !this.image) {
      print("Text, Image, or API key input is missing");
      return;
    }

    try {
      this.isProcessing = true;

      // Access the texture from the image component
      const texture = this.image.mainPass.baseTex;
      if (!texture) {
        print("Texture not found in the image component.");
        return;
      }

      const base64Image = await this.encodeTextureToBase64(texture);

      const requestPayload = {message: JSON.stringify(this.textInput.text), image_url: `data:image/jpeg;base64,${base64Image}`}

      const request = new Request(
        "https://4449-164-67-70-232.ngrok-free.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );
      // More about the fetch API: https://developers.snap.com/spectacles/about-spectacles-features/apis/fetch
      let response = await this.remoteServiceModule.fetch(request);
      if (response.status === 200) {
        let responseData = await response.json();
        this.textOutput.text = responseData.response;
        print(responseData.response);

        // Call TTS to generate and play speech from the response
        if (this.ttsComponent) {
          this.ttsComponent.generateAndPlaySpeech(
            responseData.response
          );
        }
      } else {
        print("Failure: response not successful");
      }
    } catch (error) {
      print("Error: " + error);
    } finally {
      this.isProcessing = false;
    }
  }

  // More about encodeTextureToBase64: https://platform.openai.com/docs/guides/vision or https://developers.snap.com/api/lens-studio/Classes/OtherClasses#Base64
  encodeTextureToBase64(texture) {
    return new Promise((resolve, reject) => {
      Base64.encodeTextureAsync(
        texture,
        resolve,
        reject,
        CompressionQuality.LowQuality,
        EncodingType.Jpg
      );
    });
  }
}


// import { TextToSpeechOpenAI } from "./TextToSpeechOpenAI";
// import { MicrophoneRecorder } from "./MicrophoneRecorder"; // You already have this

// @component
// export class VisionOpenAI extends BaseScriptComponent {
//   @input textInput: Text;
//   @input textOutput: Text;
//   @input image: Image;
//   @input ttsComponent: TextToSpeechOpenAI;
//   @input microphoneRecorder: MicrophoneRecorder; // <-- added MicrophoneRecorder input
//   @input @allowUndefined debugText: Text;

//   // Remote service module for fetching data
//   private remoteServiceModule: RemoteServiceModule = require("LensStudio:RemoteServiceModule");

//   public isProcessing: boolean = false;

//   async handleTriggerEnd(eventData) {
//     if (this.isProcessing) {
//       print("A request is already in progress. Please wait.");
//       return;
//     }

//     if (!this.textInput.text || !this.image || !this.microphoneRecorder) {
//       print("Text, Image, or MicrophoneRecorder input is missing");
//       return;
//     }

//     try {
//       this.isProcessing = true;

//       // 1. Encode Image
//       const texture = this.image.mainPass.baseTex;
//       if (!texture) {
//         print("Texture not found in the image component.");
//         return;
//       }
//       const base64Image = await this.encodeTextureToBase64(texture);

//       // 2. Encode Audio
//       const base64Audio = this.encodeRecordedAudioToBase64();

//       // 3. Build Request Payload
//       const requestPayload = {
//         message: JSON.stringify(this.textInput.text),
//         image_url: `data:image/jpeg;base64,${base64Image}`,
//         audio_base64: base64Audio,
//       };

//       const request = new Request(
//         "https://4449-164-67-70-232.ngrok-free.app/chat",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestPayload),
//         }
//       );

//       // 4. Fetch
//       let response = await this.remoteServiceModule.fetch(request);
//       if (response.status === 200) {
//         let responseData = await response.json();
//         this.textOutput.text = responseData.response;
//         print(responseData.response);

//         if (this.ttsComponent) {
//           this.ttsComponent.generateAndPlaySpeech(responseData.response);
//         }
//       } else {
//         print("Failure: response not successful");
//       }
//     } catch (error) {
//       print("Error: " + error);
//     } finally {
//       this.isProcessing = false;
//     }
//   }

//   // Encode the texture (image) to base64
//   encodeTextureToBase64(texture) {
//     return new Promise((resolve, reject) => {
//       Base64.encodeTextureAsync(
//         texture,
//         resolve,
//         reject,
//         CompressionQuality.LowQuality,
//         EncodingType.Jpg
//       );
//     });
//   }

//   // Encode the recorded audio frames into base64
//   encodeRecordedAudioToBase64(): string {
//     if (!this.microphoneRecorder || this.microphoneRecorder.recordedAudioFrames.length === 0) {
//       return "";
//     }

//     // Concatenate all recorded samples into one big array
//     let allSamples: number[] = [];
//     for (let frame of this.microphoneRecorder.recordedAudioFrames) {
//       allSamples.push(...frame.audioFrame);
//     }

//     // Convert samples to 16-bit PCM format
//     const buffer = new ArrayBuffer(allSamples.length * 2); // 2 bytes per sample
//     const view = new DataView(buffer);
//     for (let i = 0; i < allSamples.length; i++) {
//       let s = Math.max(-1, Math.min(1, allSamples[i]));
//       view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
//     }

//     // Base64 encode the Uint8Array
//     const uint8Array = new Uint8Array(buffer);
//     const base64String = Base64.encode(uint8Array);
//     return base64String;
//   }
// }

