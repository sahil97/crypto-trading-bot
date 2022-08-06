const API_URI = 'http://127.0.0.1:5000';

$(document).ready(() => {

    let current_user_email = '';

    if(localStorage.getItem('email')){
        current_user_email = localStorage.getItem('email')
    } else {
        alert("Not logged in. Login first.")
        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/');
        // console.log(targetUri);
        window.location.href = targetUri;
    }
});