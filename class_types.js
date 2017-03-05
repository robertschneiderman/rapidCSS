const CLASS_TYPES = {
    btn: 'buttons',
    chars: 'characters',
    c: 'containers',
    form: 'forms',
    hl: 'headlines',
    icn: 'icons',
    img: 'images',
    input: 'inputs',
    item: 'items',
    label: 'labels',
    link: 'links',
    list: 'lists',
    modal: 'modals',
    nav: 'navs',
    p: 'pages',
    panel: 'panels',
    r: 'rows',
    shape: 'shapes',
    text: 'texts',
    title: 'titles',
    w: 'wrappers'
};

let files = [];
for (let key in CLASS_TYPES) {
    if (key === 'c') continue; 
    files.push(CLASS_TYPES[key]);
}

exports.CLASS_TYPES = CLASS_TYPES;
exports.files = files;