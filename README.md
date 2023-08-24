# Mobile Route Mapper App

This is an expo snack app created using React Native JS. The link is attached.

This app allows the user to track their route as a line on the map. It loads on the screen with a list of previous routes displayed (and stored asynchronously). This is an app designed for runners to track their runs or for bikers, which will explain some of the design decisions such as displaying a minute-mile pace instead of a traditional speed in meters per second. To start a new route, press the new route button at the top of the screen. This leads you to the map, which has statistics at the top including distance, time, and pace. To begin, you press the start route button, which then converts into an end route button while the route is running. When the map first opens, it automatically animates to the user's position. Before the user presses start, they are able to freely rotate and move the map to their liking. When the user presses start, the animation zooms in on to the user's position to provide a more detailed view of the surroundings. The map will continue to animate to the user's position every time the user location changes (thus, the focus is always on the user's position). HOWEVER, if the user decides to drag off the location while the route is running, it will no longer automatically focus on the user's position (this was completely intentional). If the user drags off of their location initially but later wishes for the app to consistently refocus on their own location later, they can press the target button in the bottom right. When end route is pressed, you are able to press save route, which causes a pop-up to appear to name your route. The map refocuses to fit to the entire polyline (in other words, the route) that the user has created. At this time, the user can only rotate or change the depth of the map. After you submit the name, it appears in the routes screen. You are able to press on the previous routes to see the snapshots in full screen.  If the distance is greater than or equal to 1600m, it will convert the distance to miles instead.

LIMITATION #1: Rarely, the snapshots of previous route save asynchronously at first but then the image uri is later deleted. In other words, the snapshot of the previous route will not be displayed. We are not sure why this occurrs.
LIMITATION #2: This app doesn't work on Android because of the lack of location tracking, but we were told that this is fine and due to circumstances beyond our control.

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo-cli](https://docs.expo.io/get-started/installation).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.io/c/snack).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).
