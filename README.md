# Front-end-multiples.

An implementation of an js router for mannaging multiple spa app. The purpose of this framework is to provide an agnostic router. 

## Declarative routing

The declaration of the routing rules use custom html elements :

```
<fem-router>
    <fem-route path="/home" default="true" scripts="/js/route.js, /css/route.css"></fem-route>
    <fem-route module="angularjs" path="/another-app" scripts="/js/app-angular.js, /css/app-angular.css"></fem-route>
</fem-router>
``` 
Two main tags :
 * __fem-router__ : the main tags. Initialize and Allow to parametrize all the router.
 * __fem-route__ : Define an specific app. Contain all the description for mounting this route.
 
## Change the route

The fem script inject in the global context of the page an object for changing the current location :

```
femRouter.Link('/home')(evt);
``` 
with as first parameter the target path and second parameter an optional event.

