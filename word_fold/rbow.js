let angle3 = 0.0;

function onframe(){
    document.documentElement.style.setProperty('', angle3 + 'deg');
    angle3 += 8;

    requestAnimationFrame(onframe);
}

onframe();