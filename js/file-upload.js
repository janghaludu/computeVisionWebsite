const fileInput = document.querySelector('.file-input');
const droparea = document.querySelector('.file-drop-area');
let data;

// highlight drag area
// Requires Utils.js to be imported first
addListenerMulti(fileInput, 'dragenter focus click', () => {
    droparea.classList.add('is-active');
});

// back to normal state
// Requires Utils.js to be imported first
addListenerMulti(fileInput, 'dragleave blur drop', () => {
    droparea.classList.remove('is-active');
});

fileInput.addEventListener('change', event => {
    const _this = event.target;
    const filesCount = _this.files.length;
    const file = _this.files[0];
    const textContainer = _this.previousElementSibling;

    if (filesCount === 1) {
        // if single file then show file name
        textContainer.innerText = _this.value.split('\\').pop();
    } else {
        // otherwise show number of files
        textContainer.innerText = `${filesCount} files selected`;
    }

    const canvas = document.getElementById('canvasu');
    const img = document.createElement("img");
    const fr = new FileReader(); // FileReader instance
    fr.readAsDataURL(file);

    fr.onload = e => {
        img.src = e.target.result;
        sessionStorage.setItem('queryImage', e.target.result);
        img.onload = () => {
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const dataurl = canvas.toDataURL();
            const url = 'https://ml2wqc35jk.execute-api.ap-south-1.amazonaws.com/api/upload/' + 'testing';

            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url);
            xhr.setRequestHeader('Content-type', 'application/octet-stream');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const urls = JSON.parse(xhr.responseText).map(t => ({
                        url: `https://s3.ap-south-1.amazonaws.com/clogos/${t}`
                    }));
                    sessionStorage.setItem('results', JSON.stringify(urls));
                    window.location.href = "./results.html";
                } else {
                    console.log("Error: ", xhr.response);
                }
            };
            xhr.send(dataurl);
        }
    }

});

// // change inner text
// $fileInput.on('change', function () {
//             //$fileInput.val().split('\\').pop()
//             $.put(url, dataurl, result => {
//                 const urls = JSON.parse(result).map(t => ({
//                     url: `https://s3.ap-south-1.amazonaws.com/clogos/${t}`
//                 }));
//                 sessionStorage.setItem('results', JSON.stringify(urls));
//                 window.location.href = "./results.html"
//             });
//         }
//     }
// });
//
//
// function _ajax_request(url, data, callback, method) {
//     return jQuery.ajax({
//         url: 'https://ml2wqc35jk.execute-api.ap-south-1.amazonaws.com/api/upload/' + 'testing',
//         headers: {
//             'Content-Type': 'application/octet-stream'
//         },
//         type: method,
//         data,
//         success: callback
//     });
// }
//
//
// jQuery.extend({
//     put(url, data, callback) {
//         return _ajax_request(url, data, callback, 'PUT');
//     }
// });
//
//
// function getBinary() {
//     data = fr.result;
//     console.log(data);
//     $.ajax({
//         headers: {
//             'Content-Type': 'application/octet-stream'
//         },
//         method: 'PUT',
//         data,
//         url: `https://ml2wqc35jk.execute-api.ap-south-1.amazonaws.com/api/upload/${$fileInput.val().split('\\').pop()}`,
//         success(response) {
//             console.log(response);
//         }
//     });
// }