// const bindings = {
//     shapeResults: ko.observable([]),
//     colorResults: ko.observable([]),
//     queryImage: ko.observable('')
// };
//
// ko.applyBindings(bindings);
//
// const fetchResults = () => {
//     const urls = JSON.parse(sessionStorage.getItem('results'));
//     const queryImage = sessionStorage.getItem('queryImage');
//
//     bindings.shapeResults(urls.slice(0, 19));
//     bindings.colorResults(urls.slice(20, 39));
//     bindings.queryImage(queryImage);
// };

const imageUpload = () => {
    window.scroll({top: 0, left: 0, behavior: 'smooth' });
    const event = new Event('click');
    const el = document.getElementById('image');
    el.dispatchEvent(event);
};

const similarLogo = () => {
    window.scroll({top: 0, left: 0, behavior: 'smooth' });
    const event = new Event('click');
    const el = document.getElementById('url');
    el.dispatchEvent(event);
};