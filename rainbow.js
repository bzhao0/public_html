let angle = 0.0;

function onframe(){
    document.documentElement.style.setProperty('--hue', angle);
    angle += 2;
    requestAnimationFrame(onframe);
}

onframe();