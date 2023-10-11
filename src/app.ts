// The main entry point to the application.
console.log("hello-o-o-o-o-o!");


let engine: TSE.Engine;


window.onload = function () {
    
    console.log(`app : window is loaded.`);
    engine = new TSE.Engine();
    engine.start();
}


window.onresize = function () {
    engine.fullscreenCanvas();
}
