require(['domReady','App'],
    function (domReady,App) {
        // domReady is RequireJS plugin that triggers when DOM is ready
        domReady(function () {

            //get device resolution

            function onDeviceReady(options) {

                // Hiding splash screen
                if (options.env == 'mobile' ){
                    //cordova.exec(null, null, "SplashScreen", "hide", []);
                }

                App.roll(options);

            }

            if (navigator.userAgent.match(/(iPad|iPhone|Android)/)) {
                // This is running on a device so waiting for deviceready event
                onDeviceReady({env:'mobile'});
                return;
                document.addEventListener("deviceready", function(){ onDeviceReady({env:'mobile'}); });
            } else {
                // Polyfill for navigator.notification features to work in browser when debugging
                navigator.notification = {alert:function (message) {
                    // Using standard alert
                    alert(message);
                }};
                // On desktop don't have to wait for anything
                onDeviceReady({env:'desktop'});
            }

        });
    }
);
