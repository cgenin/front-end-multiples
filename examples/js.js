/**
 * An home with jsFiles
 **/
function jsMain(elm) {
  let h1 = document.createElement('h1');
  h1.innerHTML = 'Home'
  const div1 = document.createElement('div')
  div1.appendChild(h1)
  elm.appendChild(div1);

  let a = document.createElement('a');
  a.href = '#'
  a.appendChild(document.createTextNode('To Next'))
  a.addEventListener('click',  (evt) => {
    window.femRouter.Link('/next', true)(evt);
  });
  const div2 = document.createElement('div')
  div2.appendChild(a)
  elm.appendChild(div2);

}
