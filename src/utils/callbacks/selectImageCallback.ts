// selectImageCallback.ts
import { launchImageLibrary, Asset } from "react-native-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { SelectedImage } from "../types/types";

export const selectImage = (): Promise<SelectedImage | null> => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(
      {
        mediaType: "photo",
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
          resolve(null); // Resolve with null if the user cancels
        } else if (response.errorCode) {
          console.error("Image Picker Error: ", response.errorMessage);
          reject(response.errorMessage || "An unknown error occurred");
        } else if (response.assets && response.assets.length > 0) {
          const image: Asset = response.assets[0];
          resolve({
            uri: image.uri ?? "",
            name: image.fileName ?? "selected-image.jpg", // Fallback to a default name if not provided
            type: image.type ?? "image/jpeg", // Fallback to a default MIME type
          });
        }
      }
    );
  });
};

export const resizeImage = async (
  image: SelectedImage | null | undefined,
  width: number,
  height: number,
  quality: number = 0.8
): Promise<SelectedImage | null> => {
  return new Promise((resolve, reject) => {
    if (!image?.uri) {
      resolve(null); // Resolve with null if no image was provided
      return;
    }

    ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: width, height: height } }], // Resize options
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG } // Output options
    )
      .then((resizedImage) => {
        resolve({
          uri: resizedImage.uri,
          name: image.name,
          type: image.type,
        });
      })
      .catch((err) => {
        console.error("Image Manipulator Error: ", err);
        reject("An error occurred while resizing the image");
      });

    // Uncomment the following code to use the Image Resizer library.

    // console.log("Resizing image: ", uri);
    // ImageResizer.createResizedImage(
    //   uri, // Image URI
    //   width, // Max width
    //   height, // Max height
    //   "JPEG", // Output format
    //   quality, // Quality (0-100)
    //   0 // Rotation (0 for no rotation)
    // )
    //   .then((resizedImageUri) => {
    //     resolve(resizedImageUri.uri);
    //   })
    //   .catch((err) => {
    //     console.error("Image Resizer Error: ", err);
    //     reject("An error occurred while resizing the image");
    //   });
  });
};
