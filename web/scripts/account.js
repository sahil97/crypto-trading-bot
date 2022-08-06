const API_URI = 'http://127.0.0.1:5000';

$(document).ready(() => {

    let current_user_email = '';
    let currentValPwd = '';

    if(localStorage.getItem('email')){
        current_user_email = localStorage.getItem('email')
    } else {
        alert("Not logged in. Login first.")
        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/');
        // console.log(targetUri);
        window.location.href = targetUri;
    };

    $('#logoutBtn').on('click', (e) => {
        localStorage.removeItem('email');
        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/');
        // console.log(targetUri);
        window.location.href = targetUri;
    })

    $('#automatedBot').on('click', (e) => {
        e.preventDefault();

        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/') + '/bot.html';
        // console.log(targetUri);
        window.location.href = targetUri;
    });

    $('#stats').on('click', (e) => {
        e.preventDefault();

        let targetUri = window.location.href;
        targetUri = targetUri.split('/').slice(0, -1).join('/') + '/stats.html';
        // console.log(targetUri);
        window.location.href = targetUri;
    });

    $("#inputPassword").on('change', (e) => {
        currentValPwd = $('#inputPassword').val();
    })

    $('#pwdChangeBtn').on('click', (e) => {
        e.preventDefault();

        if(currentValPwd && current_user_email){
            $.ajax({
                type: "POST",
                url: API_URI + "/details",
                data: JSON.stringify({ email: current_user_email, password: currentValPwd }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    let targetUri = window.location.href;
                    targetUri = targetUri.split('/').slice(0, -1).join('/') + '/bot.html';
                    // console.log(targetUri);
                    window.location.href = targetUri;

                },
                error: function(errMsg){
                    console.log(errMsg);
                }
            });
        }
    })

});