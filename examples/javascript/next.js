/**
 * An example from vanillajs
 */
function jsMain(elm) {

    let h1 = document.createElement('h1');
    h1.classList='red';
    h1.innerHTML = 'Js Module page example';
    const div1 = document.createElement('div');
    div1.appendChild(h1);
    elm.appendChild(div1);

    let p = document.createElement('p');
    p.appendChild(document.createTextNode('This element was created by the js script present in the /examples/javascript/next.js.'));
    elm.appendChild(p);


    let p2 = document.createElement('p');
    p2.appendChild(document.createTextNode('The router load the /examples/css/next.css. which override the current css'));
    elm.appendChild(p2);

    let a = document.createElement('button');
    a.classList= 'btn-king-size';
    a.appendChild(document.createTextNode('Test Javascript'))
    a.addEventListener('click',  (evt) => {
        alert('js defined in the next.js files')
    });
    const div2 = document.createElement('div');
    div2.id="next-buttons";
    div2.appendChild(a);
    elm.appendChild(div2);}
