/**
 * Created by vincentvachon on 17-04-29.
 * Get post from the user
 * Get albums from the user
    * Get photos from the user
 * View comments
 * Add comment
 */

import $ from 'jquery';
import slick from 'slick-carousel';

import {findGetParameter} from './utils';

const root = 'http://jsonplaceholder.typicode.com';
const otherUserId = findGetParameter('userid');
let userFromLocal = JSON.parse(sessionStorage.getItem('user'));
let userToLoad = userFromLocal;

function listenToLogin(){
    userFromLocal = JSON.parse(sessionStorage.getItem('user'));
    userToLoad = userFromLocal;
}

function displayConnectedUserInfo(){

    $('.user-title-username').html(userFromLocal.username);

}

function displayOtherUserInfo(otherUsername){

    $('.other-user-title-username').html(otherUsername);
}


function displayUserConnectedPosts(posts){

    let userPostsTemplate = ``;

    for(const post in posts) {
        if(post < 10){
            const template = `
            <article class="message" data-post-id="${posts[post].id}">
            
                <div class="message-header">
                    <p>${posts[post].title}</p>
                </div>
                
                <div class="message-body">
                    ${posts[post].body}
                    <br>
                    <br>
                    <a class="view-post-comments button is-primary is-small" data-post-id="${posts[post].id}">View comments</a>
                    <div class="post-comments" data-post-comment="${posts[post].id}"></div>
                    <a class="add-post-comments button is-primary is-small" data-post-id="${posts[post].id}">Add comment</a>
                </div>
                

                <div class="add-comment box">
                    <h3>Comment on post</h3>
                    <div class="columns">
                      <div class="column">
                        <p class="control has-icons-left">
                            <input class="input input-name-comment" required="required" type="text" placeholder="Your name">
                            <span class="icon is-small is-left">
                                <i class="fa fa-comment-o"></i>
                            </span>                            
                        </p>
                      </div>
                     
                      
                      <div class="column">
                            <p class="control has-icons-left">
                            <input class="input input-email-comment" required="required" type="email" placeholder="Your email">
                            <span class="icon is-small is-left">
                                <i class="fa fa-envelope-o"></i>
                            </span>                            
                        </p>
                        </div>
                    </div> 
                    
                    <div class="columns">
                    
                        <div class="column">
                        
                            <p class="control has-icons-left">
                                <textarea class="textarea input-body-comment" required="required" type="text" placeholder="Your comment"></textarea>                          
                            </p>
                            
                            <p class="help is-danger">All the fields are required</p>
                        
                            <p class="is-success success-post-comment">
                                You commented on: <em>${posts[post].title}</em>
                            </p>
                            
                            <a class="button is-primary is-outlined post-comment-button">Submit comment</a>
                        
                        </div>
                        
                    </div>        
                    
                </div>
                
            </article>
        `;

            userPostsTemplate += template;
        }
    }

    $('.user-connected-posts').html(userPostsTemplate);

    // initiate posts events
    viewPostComments();
    addPostComments();
    postComment();

}

function displayOtherUsers(users){

    let otherUsersTemplate = ``;

    for(const user in users) {

        if(users[user].id !== userToLoad.id){
            const template = `
            <div class="card user">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-5">${users[user].name}</p>
                            <p class="subtitle is-6">${users[user].username}</p>
                            <a href="./other-user.html?userid=${users[user].id}" class="subtitle button is-small">View profile</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

            otherUsersTemplate += template;
        }
    }

    $('.other-users').html(otherUsersTemplate);

}


function displayUserConnectedPhotos(album, photos){

    let userPhotosTemplate = `
        <div class="gallery-container">
            <header class="heading"><h2 class="subtitle">Album: ${album.title}</h2></header>
            <div class="gallery">
    `;

    for(const photo in photos) {

            const template = `
                <div class="photo">
                    <a class="open-photo-modal" data-photo-modal="${photos[photo].url}">
                        <img src="${photos[photo].thumbnailUrl}" alt="${photos[photo].title}">
                    </a> 
                    <p>${photos[photo].title}</p>        
                </div>
                     
        `;

        userPhotosTemplate += template;
    }

    userPhotosTemplate += `</div></div>`;

    $('.user-connected-albums').html(userPhotosTemplate);

    $('.gallery').slick({
        dots: false,
        arrows: true,
        autoplay: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    arrows: false,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false,

                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,

                }
            },
        ]
    });

    showPhotoModal();

}



function displayCommentsForPost(postId, comments){
    let userCommentsTemplate = `<h3>Comments</h3>`;

    for(const comment in comments) {
            const template = `
            <div class="comment">
                <h5>
                    ${comments[comment].name}
                </h5>
                <p>
                    ${comments[comment].body}
                </p>
                <p>- ${comments[comment].email}</p>
            </div>
            
        `;

        userCommentsTemplate += template;
    }

    $('.message').find(`[data-post-comment='${postId}']`).html(userCommentsTemplate);

}

function viewPostComments(){

    $('.view-post-comments').on('click', function(){
        $(this).parents('.message').find('.post-comments').toggleClass('visible');
        getCommentsFromPosts($(this).data('post-id'));

    })

}

function addPostComments(){

    $('.add-post-comments').on('click', function(){

        $(this).parents('.message').find('.add-comment').addClass('visible');

    })

}

function getUserPhotosFromAlbum(album){

    const albumId = album.id;

    $.ajax({
        url: root + `/photos?albumId=${albumId}`,
        method: 'GET'
    }).then(function(data) {
        displayUserConnectedPhotos(album, data);
    });

}

function getCommentsFromPosts(postId){

    $.ajax({
        url: root + `/comments?postId=${postId}`,
        method: 'GET'
    }).then(function(data) {
        displayCommentsForPost(postId, data);
    });
}

function getUserPosts(){
    $.ajax({
        url: root + `/posts?userId = ${userToLoad.id}`,
        method: 'GET'
    }).then(function(data) {
        displayUserConnectedPosts(data);
    });
}

function getOneUserAlbum(albumId){
    $.ajax({
        url: root + `/albums?userId=${userToLoad.id}`,
        method: 'GET'
    }).then(function(data) {
        getUserPhotosFromAlbum(data[albumId])

    });
}

function getOtherUsers(){
    $.ajax({
        url: root + `/users`,
        method: 'GET'
    }).then(function(data) {
        displayOtherUsers(data)

    });
}

function showPhotoModal(){

    $('.open-photo-modal').on('click', function(e) {
        e.preventDefault();
        $('.photo-modal').find('.modal-content').html(`<img src="${$(this).data('photo-modal')}">`);
        $('.photo-modal').addClass('visible');
    });

    $('.photo-modal').find('.modal-close').on('click', function(){
        $('.photo-modal').removeClass('visible');
    })
}

function postComment(){
    $('.post-comment-button').on('click', function(){

        const $messageContainer = $(this).parents('.message');

        const postId = $messageContainer.attr('data-post-id');

        const bodyCommentVal = $messageContainer.find('.input-body-comment').val();
        const nameCommentVal = $messageContainer.find('.input-name-comment').val();
        const emailCommentVal = $messageContainer.find('.input-email-comment').val();

        if(bodyCommentVal !== '' && nameCommentVal !== '' && emailCommentVal !== ''){

            $.ajax({
                url: root + `/comments?postId=1`,
                type: 'POST',
                data: {
                    name: nameCommentVal,
                    email: emailCommentVal,
                    body: bodyCommentVal
                }
            }).then(function(data) {
                // should display posted message
                //getCommentsFromPosts(postId)
                $messageContainer.find('.success-post-comment').addClass('visible');
                $messageContainer.find('.input-body-comment, .input-name-comment, .input-email-comment').val("");
            });

        } else {

            $messageContainer.find('.help').show();

        }

        if(bodyCommentVal === ''){
            $messageContainer.find('.input-body-comment').addClass('is-danger');
        }

        if(nameCommentVal === ''){
            $messageContainer.find('.input-name-comment').addClass('is-danger');
        }

        if(emailCommentVal === ''){
            $messageContainer.find('.input-email-comment').addClass('is-danger');
        }

        $messageContainer.find('.input-body-comment, .input-name-comment, .input-email-comment').on('focus', function(){
            $(this).removeClass('is-danger');
            $messageContainer.find('.help').hide();
        })
    })
}

/*
 * Initialize user content
 *
*/

function getUserContent(){

    listenToLogin();
    displayConnectedUserInfo();

    // If viewing an other user profile
    if(otherUserId !== null) {

        $.ajax({

            url: root + `/users?id=${otherUserId}`,
            method: 'GET'

        }).then(function(data) {

            userToLoad = data[0];

            displayOtherUserInfo(data[0].username);
            getUserPosts();
            getOneUserAlbum(0);
            getOtherUsers();

        });

    } else {

        getUserPosts();
        getOneUserAlbum(0);
        getOtherUsers();

    }

}


export {getUserContent};