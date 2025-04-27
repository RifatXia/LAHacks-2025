@component
export class GrabExample extends BaseScriptComponent {
  
  @input
  textComponent: Text;
    
  @input
  imageCarousel: SceneObject;
    
  @input 
  image: Image;
    
  private remoteServiceModule: RemoteServiceModule = require("LensStudio:RemoteServiceModule");

  private gestureModule: GestureModule = require('LensStudio:GestureModule');
    
  public isProcessing: boolean = false;
   
  onAwake() {
        
    this.gestureModule
      .getGrabBeginEvent(GestureModule.HandType.Right)
      .add((grabBeginArgs: GrabBeginArgs) => {
        this.apiCall();
      }); 
        
    this.gestureModule
      .getGrabBeginEvent(GestureModule.HandType.Left)
      .add((grabBeginArgs: GrabBeginArgs) => {
        if (this.imageCarousel) {
            this.imageCarousel.enabled = true;
            print("Image Enabled")
        } else {
            print("ImageCarousel is not assigned.");
        }
      });
        
    this.gestureModule
      .getGrabEndEvent(GestureModule.HandType.Left)
      .add((grabEndArgs: GrabEndArgs) => {
        if (this.imageCarousel) {
            this.imageCarousel.enabled = false;
            print("Image Disabled")
        } else {
            print("ImageCarousel is not assigned.");
        }
      });
  }

  async apiCall() {
    if (this.isProcessing) {
      print("A request is already in progress. Please wait.");
      return;
    }

    if (!this.image ) {
      print("Image is Missing");
      return;
    }
        
    this.textComponent.text = "Matching..."

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
        file: base64Image
      };

      const request = new Request(
        "https://4449-164-67-70-232.ngrok-free.app/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestPayload),
        }
      );
      let response = await this.remoteServiceModule.fetch(request);
      if (response.status === 200) {
        let responseData = await response.json();
        print(responseData);
        let label = responseData.label
        print(label)
        let distance = responseData.distance
        print("Distance Is")
        print(distance);
        this.textComponent.text = label
      } else {
        this.textComponent.text = "Failed"
        print("Failure: response not successful");
                
      }
    } catch (error) {
      this.textComponent.text = "Failed"
      print("Error: " + error);
    } finally {
      this.isProcessing = false;
    }
  }
    
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

  private updateText(label: string) {
    if (this.textComponent && this.textComponent.text !== undefined) {
      this.textComponent.text = label;
    } else {
      print("TextComponent is not assigned or does not have 'text'.");
    }
  }
}
