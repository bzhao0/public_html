let angle3 = 0.0;

function onframe(){
    console.log("hello world");
    document.documentElement.style.setProperty('--hue-angle', angle3 + 'deg');
    angle3 += 1;

    requestAnimationFrame(onframe);
}

onframe();