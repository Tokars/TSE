// The main entry point to the application.
console.log("app start.");


let engine: TSE.Engine;


window.onload = function () {
    
    console.log(`app : window is loaded.`);
    engine = new TSE.Engine(320, 480);
    engine.start();
}


window.onresize = function () {
    engine.resize();
}
