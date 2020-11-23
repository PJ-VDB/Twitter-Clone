console.log("Hello World");

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');

loadingElement.style.display = '';
const API_URL = window.location.hostname == 'localhost' ? 'http://localhost:5000/mews' : 'OTHER URL';

listAllMews();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    console.log('form was submitted');

    const mew = {
        name,
        content,
    };

    // console.log(mew);
    loadingElement.style.display = '';
    form.style.display = 'none';

    //send mew to back end server
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(createdMew => {
        console.log(createdMew);
        form.reset();

        loadingElement.style.display = 'none';
        form.style.display = '';
        listAllMews();
    });
});

function listAllMews(){
    mewsElement.innerHTML = '';
    fetch(API_URL)
    .then(response => response.json())
    .then(mews => {
        console.log(mews);
        mews.reverse(); //most recent mews first

        mews.forEach(mew => {
        const div = document.createElement('div');

        const header = document.createElement('h3');
        header.textContent = mew.name;

        const contents = document.createElement('p');
        contents.textContent = mew.content;

        const date = document.createElement('p');
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        mewsElement.append(div);
            
        });
        loadingElement.style.display = 'none';
    });
}