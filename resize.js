const fileInput = document.getElementById('select-image');
const images = document.getElementById('images');
const totalImages = document.getElementById('total-images');
const downloadBtn = document.getElementById('download');

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
                    <img class='resized_image' src='${reader.result}'>
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

downloadBtn.addEventListener('click', async () => {
    const imgs = document.querySelectorAll('.resized_image');

    if (imgs.length < 1) return;
    
    const zip = new JSZip();
    imgs.forEach((el) => {
        zip.file(el.nextElementSibling.textContent, dataURLToBlob(resizeImage(el)));
    });

    const zipFile = await zip.generateAsync({ type: 'blob'});
    downloadZip(zipFile);

});

function resizeImage(imgToResize) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  
    let originalWidth = imgToResize.width;
    let originalHeight = imgToResize.height;

    console.log("origin width " + originalWidth);
    console.log("origin height " + originalHeight);

    while (originalWidth % 4 != 0)
    {
        originalWidth = originalWidth - 1;
    }

    while (originalHeight % 4 != 0)
    {
        originalHeight = originalHeight - 1;
    }
  
    canvas.width = originalWidth;
    canvas.height = originalHeight;
  
    context.drawImage(
      imgToResize,
      0,
      0,
      originalWidth,
      originalHeight
    );
  
    return canvas.toDataURL();
}


function downloadZip(file)
{
	const a = document.createElement('a');
	a.download = 'test.zip';
	const url = URL.createObjectURL(file);
	a.href = url;
	
	a.style.display = 'none';

	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);

}

function dataURLToBlob (dataURL) {
	var index = dataURL.indexOf(',');
	var meta = dataURL.substring(0, index);
	var data = dataURL.substring(index + 1);
	var contentType = meta.substring(meta.indexOf(':') + 1);

	if (/;base64$/.test(contentType)) {
		contentType = contentType.substring(0, contentType.length - 7);
		var strdata = atob(data);

		data = new Uint8Array(strdata.length);

		for (var i = 0; i < strdata.length; ++ i) {
			data[i] = strdata.charCodeAt(i);
		}
	}
	else {
		data = decodeURIComponent(data);
	}

	return new Blob([data], {type: contentType});
}

