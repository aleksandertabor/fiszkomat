importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
if (workbox) {

    workbox.core.skipWaiting();
    workbox.core.clientsClaim();

    // top-level routes we want to precache
    workbox.precaching.precacheAndRoute(['/']);

    // injected assets by Workbox CLI
    workbox.precaching.precacheAndRoute([
  {
    "url": "css/app.css",
    "revision": "45f8894c271ffb6398a651a5c9bcc559"
  },
  {
    "url": "favicon.ico",
    "revision": "2a64701304999353492fd8c41ece6204"
  },
  {
    "url": "fonts/vendor/@mdi/materialdesignicons-webfont.woff2?927457ed7478ec7e1580a2b88116f9c3",
    "revision": "927457ed7478ec7e1580a2b88116f9c3"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-Black.woff2?59eb3601394dd87f30f82433fb39dd94",
    "revision": "59eb3601394dd87f30f82433fb39dd94"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-BlackItalic.woff2?f75569f8a5fab0893fa712d8c0d9c3fe",
    "revision": "f75569f8a5fab0893fa712d8c0d9c3fe"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-Bold.woff2?b52fac2bb93c5858f3f2675e4b52e1de",
    "revision": "b52fac2bb93c5858f3f2675e4b52e1de"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-BoldItalic.woff2?94008e69aaf05da75c0bbf8f8bb0db41",
    "revision": "94008e69aaf05da75c0bbf8f8bb0db41"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-Light.woff2?d26871e8149b5759f814fd3c7a4f784b",
    "revision": "d26871e8149b5759f814fd3c7a4f784b"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-LightItalic.woff2?e8eaae902c3a4dacb9a5062667e10576",
    "revision": "e8eaae902c3a4dacb9a5062667e10576"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-Medium.woff2?90d1676003d9c28c04994c18bfd8b558",
    "revision": "90d1676003d9c28c04994c18bfd8b558"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-MediumItalic.woff2?13ec0eb5bdb821ff4930237d7c9f943f",
    "revision": "13ec0eb5bdb821ff4930237d7c9f943f"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-Regular.woff2?73f0a88bbca1bec19fb1303c689d04c6",
    "revision": "73f0a88bbca1bec19fb1303c689d04c6"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-RegularItalic.woff2?4357beb823a5f8d65c260f045d9e019a",
    "revision": "4357beb823a5f8d65c260f045d9e019a"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-Thin.woff2?ad538a69b0e8615ed0419c4529344ffc",
    "revision": "ad538a69b0e8615ed0419c4529344ffc"
  },
  {
    "url": "fonts/vendor/roboto-fontface/roboto/Roboto-ThinItalic.woff2?5b4a33e176ff736a74f0ca2dd9e6b396",
    "revision": "5b4a33e176ff736a74f0ca2dd9e6b396"
  },
  {
    "url": "site.webmanifest",
    "revision": "8255e86f3bb0c79754ebbb15c23b83f1"
  },
  {
    "url": "img/app/icons/icon-128x128.png",
    "revision": "11c551c2981b1d299f5a2e5761515754"
  },
  {
    "url": "img/app/icons/icon-144x144.png",
    "revision": "c15fac59454a02e8d20035ec29990c23"
  },
  {
    "url": "img/app/icons/icon-152x152.png",
    "revision": "cf92ed4ce19bc7eed2f3da0344792a24"
  },
  {
    "url": "img/app/icons/icon-192x192.png",
    "revision": "a385b294366358735296d6947037d72e"
  },
  {
    "url": "img/app/icons/icon-384x384.png",
    "revision": "95d264560224bb0c14a469bc9345fb34"
  },
  {
    "url": "img/app/icons/icon-512x512.png",
    "revision": "9a72d588678eefe18b3356f831c69417"
  },
  {
    "url": "img/app/icons/icon-72x72.png",
    "revision": "3be7a72aec631600d4355d8ea93d8082"
  },
  {
    "url": "img/app/icons/icon-96x96.png",
    "revision": "8cc003eee4f132bd83d92154c219f65a"
  }
]);

    workbox.precaching.cleanupOutdatedCaches()

    // Cache main SPA html for all routes
    workbox.routing.registerNavigationRoute(
        // Assuming '/' has been precached,
        // look up its corresponding cache key.
        workbox.precaching.getCacheKeyForURL('/')
    );

    // Cache GraphQL API requests
    workbox.routing.registerRoute(
        RegExp('(graphql?)'),
        new workbox.strategies.NetworkFirst({
            networkTimeoutSeconds: 3,
            cacheName: 'api-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 5 * 60, // 5 minutes
                }),
            ],
        })
    );


    // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
    workbox.routing.registerRoute(
        /.*(?:googleapis|gstatic)\.com.*$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'google-fonts',
        })
    );


    // images
    workbox.routing.registerRoute(
        RegExp('.+\.(png|jpg|jpeg|webp)'),
        new workbox.strategies.CacheFirst({
            cacheName: 'images-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    // Cache upto 60 images.
                    maxEntries: 60,
                    // Cache for a maximum of a month.
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                })
            ],
        })
    );

    self.addEventListener('notificationclick', function (e) {
        var notification = e.notification;
        var action_url = notification.data.action_url;
        var action = e.action;

        console.log(e);

        switch (action) {
            case 'close':
                notification.close();
                break;
            case 'explore':
                e.waitUntil(
                    clients.matchAll({
                        type: 'window',
                        includeUncontrolled: true
                    })
                    .then(function (clientList) {
                        var client = clientList.find(function (c) {
                            // if has opened browser
                            return c.visibilityState === 'visible';
                        });

                        if (client !== undefined) {
                            // has opened browser
                            client.navigate(action_url);
                            client.focus();
                        } else {
                            // no opened browser so open a new window
                            clients.openWindow(action_url);
                        }
                    })
                );
                break;
            default:
                clients.openWindow(action_url);
                break;
        }

        notification.close();
    });

    self.addEventListener('notificationclose', function (e) {
        var notification = e.notification;
        var action_url = notification.data.action_url;

        console.log(':(((( You dont like our content. Closed notification: ' + action_url);
    });


    self.addEventListener('push', function (e) {
        if (!(self.Notification && self.Notification.permission === 'granted')) {
            //notifications aren't supported or permission not granted!
            return;
        }

        if (e.data) {
            var msg = e.data.json();
            console.log(msg)
            e.waitUntil(self.registration.showNotification(msg.title, {
                body: msg.body,
                image: msg.image,
                icon: msg.icon,
                lang: msg.lang,
                dir: msg.dir,
                actions: msg.actions,
                badge: msg.badge,
                requireInteraction: msg.requireInteraction,
                data: msg.data
            }));
        }
    });

}
