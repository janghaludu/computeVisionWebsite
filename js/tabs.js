// Self Executing Function that only executes after DOM is ready
(() => {
    const tabs = [];
    tabs.push(document.getElementById("url"));
    tabs.push(document.getElementById("image"));

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log("Event Fired!");
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            updateActiveLayout();
        });
    });
})();

const updateActiveLayout = () => {
    document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.remove('is-active');
    });
    if (document.getElementById("url").classList.contains('is-active')) {
        document.getElementById('url-content').classList.add('is-active');
    } else if (document.getElementById("image").classList.contains('is-active')) {
        document.getElementById('image-content').classList.add('is-active');
    }
};