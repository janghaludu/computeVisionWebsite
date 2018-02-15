let SelectedUrl = "";
let SelectedImage = "";
const autocomplete = inp => {
    const addActive = x => {

        if (!x) return false;

        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        x[currentFocus].classList.add("autocomplete-active");
    };

    const removeActive = x => {

        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    };

    const closeAllLists = elmnt => {
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    };

    let currentFocus;
    const val = inp.value;

    closeAllLists();
    if (!val) {
        closeAllLists();
    }
    currentFocus = -1;

    a = document.createElement("DIV");
    a.setAttribute("id", `${inp.id}autocomplete-list`);
    a.setAttribute("class", "autocomplete-items");

    inp.parentNode.appendChild(a);

    arr = JSON.parse(ajax.responseText);

    for (i = 0; i < arr.length; i++) {
        const b = document.createElement("DIV");
        const text = document.createElement("P");
        const image = document.createElement("IMG");
        const url = document.createElement("P");
        const imgtxt = document.createElement("DIV");


        text.innerHTML = `<strong>${arr[i].name.substr(0, val.length)}</strong>`;
        text.innerHTML += arr[i].name.substr(val.length);


        text.innerHTML += `<input type='hidden' value='${arr[i].name}'>`;

        image.setAttribute('src', arr[i].logo);
        url.innerText = arr[i].domain;

        text.classList.add("text");
        url.classList.add("url");

        b.classList.add('autocomplete-item');

        b.style.zIndex = 100;

        imgtxt.appendChild(image);
        imgtxt.appendChild(text);
        b.appendChild(imgtxt);
        b.appendChild(url);


        b.addEventListener("click", e => {

            inp.value = b.querySelector(".url").innerText;
            SelectedUrl = b.querySelector(".url").innerText;

            const src = b.querySelector("img").getAttribute('src');

            getDataUri(src, dataUri => {
                SelectedImage = dataUri;
            });


            closeAllLists();
            getResults();

        });
        a.appendChild(b);
    }

    inp.addEventListener("keydown", e => {
        let x = document.getElementById(`${e.target.id}autocomplete-list`);
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {

            currentFocus++;

            addActive(x);
        } else if (e.keyCode === 38) {

            currentFocus--;

            addActive(x);
        } else if (e.keyCode === 13) {

            e.preventDefault();
            if (currentFocus > -1) {

                if (x) x[currentFocus].click();
            }
        }
    });

    document.addEventListener("click", e => {
        closeAllLists(e.target);
    });
};

const getResults = () => {

    let string = "https://ml2wqc35jk.execute-api.ap-south-1.amazonaws.com/api/website/?website=";
    string += document.getElementById("search").value;

    const uri = encodeURI(string);

    const request = new XMLHttpRequest();
    request.open("GET", uri);
    request.onload = () => {
        if (request.status === 200) {
            const urls = JSON.parse(request.responseText).map(t => ({
                url: `https://s3.ap-south-1.amazonaws.com/clogos/${t}`
            }));
            sessionStorage.setItem('results', JSON.stringify(urls));
            sessionStorage.setItem('queryImage', SelectedImage);
            window.location.href = "./results.html";
        } else {
            console.log("Error: ", request.response);
        }
    };
    request.send(uri);
};

let arr = [];

const delay = 200;
const input = document.querySelector('#search');
const ajax = new XMLHttpRequest();
let lastKeyUp = 0;
let cb;
input.onkeyup = e => {
    document.querySelector('.autocomplete').classList.add('is-loading');
    lastKeyUp = e.timeStamp;
    if (e.timeStamp - lastKeyUp > delay) {
        console.log(input.value);
        ajax.open("GET", `https://autocomplete.clearbit.com/v1/companies/suggest?query=${input.value}`, true);
        ajax.send();

        ajax.onload = () => {
            arr = JSON.parse(ajax.responseText);
            console.log(arr.length);
            autocomplete(document.getElementById("search"));
            document.querySelector('.autocomplete').classList.remove('is-loading');
        }
    } else {
        cb = setTimeout(doSearch, delay)
    }
};

const doSearch = () => {
    ajax.open("GET", `https://autocomplete.clearbit.com/v1/companies/suggest?query=${input.value}`, true);
    ajax.send();

    ajax.onload = () => {
        arr = JSON.parse(ajax.responseText);
        autocomplete(document.getElementById("search"));
        document.querySelector('.autocomplete').classList.remove('is-loading');
    };
};

const getDataUri = (url, callback) => {
    const image = new Image();

    image.crossOrigin = "Anonymous";

    image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
};