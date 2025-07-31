let angle = 0.0;

function onframe(){
    document.documentElement.style.setProperty('--hue', angle);
    angle += 2;
    requestAnimationFrame(onframe);
}

onframe();

document.addEventListener('mousemove', function(event) {
    let normalizedX = (event.clientX / window.innerWidth) - 0.5;
    
    document.documentElement.style.setProperty('--mouse-x', (normalizedX));

    let normalizedY = (event.clientY / window.innerHeight) - 0.5;
    
    document.documentElement.style.setProperty('--mouse-y', (normalizedY));
    
});