/**
 * Created by vincentvachon on 17-04-29.
 *
 * Get the username from the input
 * Make an ajax call to the api
 * Validate username
 * log in user / remove modal
 */

import $ from 'jquery';
import {getUserContent} from './user-content';

let username = '';
const $userLoginErrorField =  $('.user-login-error-field');
const root = 'http://jsonplaceholder.typicode.com';

function displayError(error){
    let errorText = '';

    switch (error) {
        case 'usernameEmpty':
            errorText = 'Please enter a username';
            break;
        case 'invalidUser':
            errorText = 'Username invalid';
            break;
        default:
            errorText = 'An error occured';
    }

    $userLoginErrorField.show().text(errorText);

}

function registerUser(user){
    sessionStorage.setItem('user', JSON.stringify(user));
}

function connectUser(){
    $('.user-login-modal').hide();
    $('.user-loggedin').addClass('visible');
}


function validateUsername(usersList){

    usersList.every(function(user, index) {

        if (user.username === username){

            registerUser(user);

            getUserContent();

            return connectUser();

        } else {

            displayError('invalidUser');

            return true;

        }
    });

}


function requestUsername(){

    $.ajax({

        url: root + '/users',
        method: 'GET'

    }).then(function(data) {

        validateUsername(data);

    });

}


function getUsername() {

    const $loginButton = $('.login-button');

    $loginButton.on('click', (e) => {

        e.preventDefault();

        $userLoginErrorField.hide();

        username = $('#username-login').val();

        if(username !== ''){

            requestUsername();

        } else {

            displayError('usernameEmpty');

        }

    });

}

function handleUserConnexion(){
    $('.user-login-modal').addClass('is-active');
    getUsername();
}

export {handleUserConnexion, connectUser};