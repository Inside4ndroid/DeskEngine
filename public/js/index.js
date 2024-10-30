/*
 * Developed by Inside4ndroid Studios Ltd
 */
document.addEventListener('DOMContentLoaded', function () {

    window.addEventListener("load", event => {

        const noDragElement = document.getElementById('noDrag');
        var toggle = document.querySelectorAll('.toggle');

        toggle.forEach(function (el) {
            el.addEventListener("click", activateToggle);
        })

        function activateToggle(event) {
            var currentToggle = event.target;

            if (currentToggle.classList.contains('off')) {
                currentToggle.classList.remove('off');

            } else {
                currentToggle.classList.add('off');
            }
        };

        noDragElement.addEventListener('mousedown', (event) => {
            const isPluginNameInput = event.target === document.getElementById('pluginNameInput');

            if (!isPluginNameInput) {
                event.preventDefault();
            }
        });

        var sidebuttons = document.querySelectorAll('.side_link');

        sidebuttons.forEach(function (el) {
            el.addEventListener("click", activateButton);
        })

        function activateButton(event) {
            var rightHome = document.getElementById('rightHome');
            var rightplugins = document.getElementById('rightplugins');
            var rightwallpapers = document.getElementById('rightwallpapers');
            var currentButton = event.target.closest('.side_link');
            rightHome.style.display = 'none';
            rightplugins.style.display = 'none';
            rightwallpapers.style.display = 'none';

            if (!currentButton.classList.contains('active')) {
                sidebuttons.forEach(function (el) {
                    el.classList.remove('active');
                });

                currentButton.classList.add('active');
                var activeButtonId = currentButton.id;
                switch (activeButtonId) {
                    case 'homeBtn':
                        rightHome.style.display = ''
                        break;
                    case 'wallpapersBtn':
                        rightwallpapers.style.display = ''
                        break;
                    case 'pluginsBtn':
                        rightplugins.style.display = ''
                        break;
                    case 'aboutBtn':
                        // TODO Code to show about data
                        break;
                }
            }
        };

    });

    let pluginName;
    const pluginBtn = document.getElementById('createplugin');
    pluginBtn.addEventListener('click', createPlugin);
    function createPlugin() {
        const pluginNameInput = document.getElementById('pluginNameInput');
        pluginName = pluginNameInput.value;

        if (pluginName.trim() !== "") {
            app.send('createplugin', pluginName);
        }
    };

});
