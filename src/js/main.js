import $ from 'jquery';

import {handleUserConnexion, connectUser} from './utils/authentication';
import {getUserContent} from './utils/user-content';

// Avoid login in user is already
// logged in for the session only
function checkIfUserExist(){

    const userFromLocal = sessionStorage.getItem('user');

    if(userFromLocal !== null){

        connectUser();
        getUserContent();

    } else {

        handleUserConnexion();

    }

}

function logout(){

    $('.logout-link').on('click', function(){
        sessionStorage.clear();
        window.location = window.location.href
    })
}

checkIfUserExist();
logout();