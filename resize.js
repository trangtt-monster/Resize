const fileInput = document.getElementById('select-image');
const images = document.getElementById('images');
const totalImages = document.getElementById('total-images');

// Listen to the change event on the <input> element
fileInput.addEventListener('change', (event) => {
    // Get the selected image file
    const imageFiles = event.target.files;

    // Show the number of images selected
    totalImages.innerText = imageFiles.length;

    // Empty the images div
    images.innerHTML = '';

    if (imageFiles.length > 0) {
        // Loop through all the selected images
        for (const imageFile of imageFiles) {
            const reader = new FileReader();

            // Convert each image file to a string
            reader.readAsDataURL(imageFile);

            // FileReader will emit the load event when the data URL is ready
            // Access the string using reader.result inside the callback function
            reader.addEventListener('load', () => {
                // Create new <img> element and add it to the DOM
                images.innerHTML += `
                <div class="image_box">
                    <img src='${reader.result}'>
                    <span class='image_name'>${imageFile.name}</span>
                </div>
            `;
            });
        }
    } else {
        // Empty the images div
        images.innerHTML = '';
    }
});