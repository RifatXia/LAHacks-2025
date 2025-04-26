import { TextToSpeechOpenAI } from "./TextToSpeechOpenAI";

@component
export class VisionOpenAI extends BaseScriptComponent {
  @input textInput: Text;
  @input textOutput: Text;
  @input image: Image;
  // @input interactable: Interactable;
  @input ttsComponent: TextToSpeechOpenAI;

  apiKey: string = "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";

  // Remote service module for fetching data
  private remoteServiceModule: RemoteServiceModule = require("LensStudio:RemoteServiceModule");

  public isProcessing: boolean = false;

  async handleTriggerEnd(eventData) {
    if (this.isProcessing) {
      print("A request is already in progress. Please wait.");
      return;
    }

    if (!this.textInput.text || !this.image || !this.apiKey) {
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

      const requestPayload = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant that works for Snapchat that has access to the view that the user is looking at using Augmented Reality Glasses." +
              " The user is asking for help with the following image and text. Keep it short like under 30 words. Be a little funny and keep it positive.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: this.textInput.text },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      };

      const request = new Request(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(requestPayload),
        }
      );
      // More about the fetch API: https://developers.snap.com/spectacles/about-spectacles-features/apis/fetch
      let response = await this.remoteServiceModule.fetch(request);
      if (response.status === 200) {
        let responseData = await response.json();
        this.textOutput.text = responseData.choices[0].message.content;
        print(responseData.choices[0].message.content);

        // Call TTS to generate and play speech from the response
        if (this.ttsComponent) {
          this.ttsComponent.generateAndPlaySpeech(
            responseData.choices[0].message.content
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
