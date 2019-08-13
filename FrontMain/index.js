'use strict';

// function openTheTitleInfo(){
//   $('#titleInfo').click(function(){
//     $('#pageExplanation').toggle();
//   });
// }
// $(openTheTitleInfo);


const posts_centerURL = 'https://evening-wave-91131.herokuapp.com/questionPost';
const usersLoginURL = 'https://evening-wave-91131.herokuapp.com/api/auth/login';
const usersDataBankURL = 'https://evening-wave-91131.herokuapp.com/api/protected';
const usernamesDb = 'https://evening-wave-91131.herokuapp.com/api/users';

function loginForm(){
$(document).ready(function(){
  const loggedJWT = sessionStorage.getItem("jwt");
  console.log("transfer testing - " + loggedJWT);
  if(loggedJWT){
    console.log("condition worked");
    const data = {
      "authToken": loggedJWT
    }
    transferJWT(data);
    // renderMainPage();
  } else{
    $('#container-main').html(`
      <div class='box-login'>
       <form id='entryLogin' aria-label='Get your username and password entry' role='form'>
        <legend></legend>
        <label>Login:</label>
        <br>
        <input id='loginUsername' type='text' placeholder='Your login name' value=''>
        <br>
        <label>Password:</label>
        <br>
        <input id='loginPassword' type="password" placeholder='Your password' value=''>
        <br>
        <input id="peekPW" type='checkbox'>Peek at Your Password
        <br>
        <p>Temporary Access: Username - BellaireBoy | Password: user1234</p>
        <input id='entrySubmit' type='image' src="https://img.icons8.com/ios/50/000000/login-rounded-filled.png" alt='entryButton'>
       </form>
       <p>Are you new to this site? <br> If so, please click sign up button down below here.</p>
       <p>&#8615; &#8615; &#8615;</p>
       <input id='signUp' type='image' value='Sign Up' src='https://cdn3.iconfinder.com/data/icons/user-interface-2-9/34/169-512.png' alt='signup'>
      </div>`
    );
  }
});
}
$(loginForm);

// function enterClick(){
// $('#loginPassword').keypress(function(e){
//   if(e.which == 13){
//     $("#entrySubmit").click();
//   }
// })
// }
// $(enterClick);

function peekInPw() {
  $('#peekPW').click(function(){
    // e.preventDefault();
    const x = $("#loginPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });
}
function peekInProfilePw() {
  $('#peekProfilePW').click(function(){
    const y = $("#profilePW");
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
  });
}
// $(peekInProfilePw);

function collectLoginData(){
  $('#entryLogin').on('click','#entrySubmit', function(e){
    e.preventDefault();
    // const entryInfo = {};
    let username = $('#loginUsername').val();
    // console.log('username: ' +  username); phase 1
    let password = $('#loginPassword').val();
    // console.log("password: " + password);
    // console.log(username "|" password);
    // let userInSystem = document.getElementById('loginUsername').value;
    // window.sessionStorage.setItem("username", username);
    // // let pwInSystem = document.getElementById('loginPassword').value;
    // window.sessionStorage.setItem("password", password);
    // console.log("Testing for storage " + username + " and " + password);
    // let testAccess = sessionStorage.getItem("username");
    // console.log("Testing worked: " + testAccess + " ?");

    getInfoFromUsername(username);
    loginEntry(username, password);
    });
}

function logOutUser(){
  $('#logOut').on('click', function(){
    window.sessionStorage.removeItem("jwt");
    location.reload();
  });
}
$(logOutUser);

function loginEntry(user, pw){
  // console.log(user + " | " + pw);
  const loginData = {
    url: usersLoginURL,
    data: {
      "username": user,
      "password": pw
    },
    dataType: 'json',
    method: 'POST',
    success: function(callback){
      // console.log("First Step - received and sending: " + callback.authToken);
      transferJWT(callback);
    },
    error: function (jqXHR, exception) {
       // console.log("sanity check, log in error callback"); phase 1
       var msg = '';
       if (jqXHR.status === 0) {
           msg = 'Not connect.\n Verify Network.';
       } else if (jqXHR.status == 404) {
           msg = 'Requested page not found. [404]';
       } else if (jqXHR.status == 500) {
           msg = 'Internal Server Error [500].';
       } else if (exception === 'parsererror') {
            console.log(JSON.stringify(jqXHR));
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
           msg = 'Time out error.';
       } else if (exception === 'abort') {
           msg = 'Ajax request aborted.';
       } else {
           msg = 'Uncaught Error.\n' + jqXHR.responseText;
       }
     console.log(msg);
     swal('Please check your username and password','error', 'warning');

   }
  };
  // console.log(loginData);
  $.ajax(loginData);
}

// let userInSystem = document.getElementById('loginUsername').value;
// localStorage.setItem("username", userInSystem);
// let pwInSystem = document.getElementById('loginPassword').value;
// localStorage.setItem("password", pwInSystem);
// console.log("Testing for storage " + userInSystem + " and " + pwInSystem);



function transferJWT(jwt){
  console.log("Second Step received: " + jwt.authToken);
  console.log("different test " + JSON.stringify(jwt));
  window.sessionStorage.setItem("jwt", jwt.authToken);
  const secondaryJWT = JSON.stringify(jwt);
  console.log("Double checking on second console log: " + secondaryJWT);
  // console.log(usersDataBankURL);
  const loginJWT = {
    url: usersDataBankURL,
    headers:{'Authorization': "Bearer " +  jwt.authToken || secondaryJWT},
    dataType: 'json',
    method: 'GET',
    success: function loginToMainPage(){
      // console.log("***Entry submit  clicked"); phase 1
      renderMainPage();
      showNav();
      fetchAllPosts();
      $('#menuDesignation').show();
    }
  };

  // console.log(loginJWT);
  $.ajax(loginJWT);
}

function getInfoFromUsername(dataName){
  // console.log("retrieved the username: " + dataName); phase 1
  const usernamePath = {
    url: usernamesDb + "/singleUsername/" + dataName,
    dataType: 'json',
    method: 'GET'
  };
  $.ajax(usernamePath)
  .done(function(name){
    // console.log(
    //   JSON.stringify(name),
    //   JSON.stringify(name, ['firstName', 'lastName'])
    // );
    let result = name.find(obj => {
      return obj;
    });
    // console.log(result.firstName + ' ' + result.lastName);
    let passTheName = result.firstName + ' ' + result.lastName;
        window.sessionStorage.setItem("user", passTheName);
    console.log('double check to see if passing worked ' + passTheName);
    //Now Get this information to MyPost
    myPosts(passTheName);
    passingName(passTheName);
  });
}

function renderMainPage(){
  // $('#reportButton').hide();
  $('#status').show();
  $('#divLogOut').show();
  $('#container-main').html(`
  <section id='secondaryContainer'>
  <h3>Your Sharing Center</h3>
   <ul id='usersPosts'>
   </ul>
  </section>
`);
  }

function reportIssue() {
  $('.reportBug').click(function(e){
    e.preventDefault();
    // $('#reportButton').hide();
    $('#secondaryContainer').html(`
      <h2 class='bugWords'>Issue(s) report page</h2>
      <section id='frameBugWork'>
        <p class='bugWords'>Please share your concern regarding anything in this site</p>
        <form id='submitIssue' aria-label='Submit your concern' role='form'>
          <input class='reportbox' type='text' placeholder='Your name?'>
          <br>
          <input class='reportbox' type='text' placeholder='Your email?'>
          <br>
          <textarea class='reporttext' placeholder='please type down here'></textarea>
          <br>
          <input id='submitreport' type='submit' value='Submit your concern(s)'>
        </form>
      </section>
      `);
  });
}
function shareBugReport(){
  $('#secondaryContainer').on('click', '#submitreport', function(e){
    e.preventDefault();
    // console.log('clicked worked...');
    // let email = document.getElementById('suggestionEmail').value;
    // let suggestion = document.getElementById('suggestiontext').value;
    swal('Your bug report was submitted!', 'Thank you for your time!', 'success');
    // console.log('working or not');
    // console.log(email + ': ' + suggestion);
    // document.getElementById('submitIssue').reset();
    clearFields('submitIssue');
  });
}


function profileCreation() {
  $('#signUp').click(function(e) {
    e.preventDefault();
    $('#container-main').html(' ');
    $('#register').html(
      `<form id='profileForm' aria-label='Create your new profile' role='form'>
        <fieldset id='profileContainer'>
          <legend>Profile Builder</legend>
          First Name: <input id="profileFN" class='profiletext' type='text' placeholder='Required Input'>
          <br>
          Last Name: <input id="profileLN" class='profiletext' type='text' placeholder='Required Input'>
          <br>
          Zipcode: <input id="profileZip" class='profiletext' type=''text' placeholder='Required Input'>
          <br>
          Username: <input id="profileUser" class='profiletext' type='text' placeholder='Required Input'>
          <br>
          Password: <input id="profilePW" class='profiletext' type='password' placeholder='Required Input' value=''>
          <br>
          <input id="peekProfilePW" type='checkbox'>Peek at Your Profile Password
          <p>(Must be total of 8 or more characters long!)</p>
          <br>
          <input id='createdProfile' value='Finalize the profile' type='submit'>
          <input type="reset" value="Clear Inputs" class='clearOutButton'>
          <input class='goBack' value='Back' type='button'>
        </fieldset>
      </form>`
    );
    peekInProfilePw();
  });
  receiveUserInfo();
}

function receiveUserInfo(){
  $('#register').submit('#profileForm', function(e){
    e.preventDefault();
    let userInfoData = {};
    userInfoData.username = $('#profileUser').val();
    // console.log(userInfoData.username);
    userInfoData.password = $('#profilePW').val();
    // console.log(userInfoData.password);
    userInfoData.firstName = $('#profileFN').val();
    // console.log(userInfoData.firstName);
    userInfoData.lastName = $("#profileLN").val();
    // console.log(userInfoData.lastName);
     // console.log(userInfoData);
     registerUserURL(userInfoData);
  });
}
// function reloadTheLogin(){
//   setTimeout(function(){location.reload();}, 3000);
// }


function registerUserURL(data){
  // console.log('Transfer completed ' + JSON.stringify(data));
  $.ajax({
    method: 'POST',
    url: usernamesDb,
    data: JSON.stringify(data),
    contentType:'application/json',
    success: function(data){
      swal('Your registration got through!', 'New accomplishment for you!', 'success');
      // location.reload();
      // $(reloadTheLogin);
    },
    error: function (jqXHR, exception) {
       // console.log("sanity check, log in error callback"); phase 1
       var msg = '';
       if (jqXHR.status === 0) {
           msg = 'Not connect.\n Verify Network.';
       } else if (jqXHR.status == 404) {
           msg = 'Requested page not found. [404]';
       } else if (jqXHR.status == 500) {
           msg = 'Internal Server Error [500].';
       } else if (exception === 'parsererror') {
            console.log(JSON.stringify(jqXHR));
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
           msg = 'Time out error.';
       } else if (exception === 'abort') {
           msg = 'Ajax request aborted.';
       } else {
           msg = 'Uncaught Error.\n' + jqXHR.responseText;
       }
     console.log(msg);
     swal('Something went terrible wrong. Check: ' + msg, 'warning');
   }
  });
   clearFields('profileForm');
}

function fetchAllPosts() {
  const postsData = {
    url: posts_centerURL,
    dataType: 'json',
    method: 'GET',
    success: renderPosts
  };
  // console.log(postsData);
  $.ajax(postsData);
}

function renderPosts(data) {
  // console.log("Client received data"); phase 1
  // console.log(data);
  $('#usersPosts').html(' ');
  $.each(data.questionPosts, function(i, obj){
    let id = 'questionData_' + i;
    let deleteButtonId = `deleteButton_${i}`;
    let editButtonId = `editCreation_${i}`;
    // console.log('render post check for date: ' + obj.question.date);
    let event = new Date(obj.question.date);

    let options = { year: 'numeric', month: 'long', day: 'numeric' };

    let filteredDate = event.toLocaleDateString('en-US', options);

    console.log('filter dates: ' + filteredDate);
    // console.log(deleteButtonId);
    // console.log(editButtonId);
    $('#usersPosts').append(`
      <li class='eachPost'>
      <ul id="questionData">"${obj.title}"</ul>
      <p>By ${obj.parentName}</p>
      <p> - ${obj.question.content} - </p>
      <p>from my ${obj.question.childAge} yrs child</p>
      <p>- ${obj.question.foundAnswer} answer. </p>
      <p>Posted by ${filteredDate}</p>
      <div class='post-user'>
      </div>
      <input type='hidden' value='${obj.id}'>
    </li>`);
    // console.log('Object id:' + obj.id);
    // $('#' + editButtonId).click(function(e){
    //   e.preventDefault();
    //   $('#postEditBox').toggle(``);
    //   // console.log(`Edit called on ${id}`);
    //   editPost(obj.id);
    // });
    // $('#editSubmit').click(function(){
    //   $('#postEditBox').hide();
    // });
    // $('#' + deleteButtonId).click(function(e){
    //   e.preventDefault();
    //   deletePost(obj.id);
    //   // console.log(`Delete called on ${id}`);
    // });
});
}

  function fetchUserPosts(name) {
    console.log("For god sake of testing: " + name);
    window.sessionStorage.setItem("user", name);
    const stayInWeb = sessionStorage.getItem("user");
    console.log("Double checking " + stayInWeb);
    const userPostsData = {
      url: posts_centerURL + "/parent/" + stayInWeb,
      dataType: 'json',
      method: 'GET'
    };
    // console.log(userPostsData);
    $.ajax(userPostsData)
    .done(function(data){
      // console.log("*****DONE*****"); phase 1
      renderUserPosts(data);
    });
  }

  function renderUserPosts(data) {
    $('#usersPosts').html(' ');

    // console.log("Client received data"); phase 1
    // console.log(data);
    $.each(data, function(i, obj){
      let id = 'questionData_' + i;
      let deleteButtonId = `deleteButton_${i}`;
      let editButtonId = `editCreation_${i}`;
      // console.log('For the user - ' + obj.question.date);

      // $('#editQuestionTitle').val(obj.title);

      console.log('checking viable dates: ' + obj.question.date);
      let event = new Date(obj.question.date);

      let options = { year: 'numeric', month: 'long', day: 'numeric' };

      let filteredUserDate = event.toLocaleDateString('en-US', options);

      let editEvent = new Date;
      let filteredNewDate = editEvent.toLocaleDateString('en-US', options);

      // console.log(deleteButtonId);
      // console.log(editButtonId);
      $('#usersPosts').append(`
        <li class='eachPost'>
        <ul id="questionData">"${obj.title}"</ul>
        <p>By: ${obj.parentName}</p>
        <p>- ${obj.question.content} -</p>
        <p> from my ${obj.question.childAge} yrs child</p>
        <p>${obj.question.foundAnswer} answer. </p>
        <p>Posted by: ${filteredUserDate}</p>
        <div class='post-user'>
        </div>
        <input type='hidden' value='${obj._id}'>
        <button class='editPost' id='${editButtonId}'><span>Edit my post!</span></button>
        <div id='postEditBox'>
        <h2>Modify your post</h2>
        <button type="button" class="closeEdit" aria-label="Close">
           <i class="far fa-window-close"></i>
        </button>
        <form id='postEdit' aria-label='Inside the edit box' role='form'>
        <fieldset id='postDesign'>
          <legend>Edit your post</legend>
            Title: <input id="editQuestionTitle" class='postInfo' type='text' value='' placeholder='Write down the title'>
            <br>
            <input id='editParentName' type='text' value='${obj.parentName}' hidden>
            <br>
            Content: <input id='editInfoData' class='postInfo' type='text' value='' placeholder='Short content of question'>
            <br>
            Your child's age: <input id='editContentInfo' type='text' placeholder='Child age?' value=''>
            <br>
            <p>Found your answer?</p>
              <select id='editAnswer' name='gotAnswer'>
                <option value=''>Pick one</option>
                <option value="No, I haven't find any">No</option>
                <option value='Yes, I have found my'>Yes</option>
              </select>
            <br>
            <p>Current Date: <input id='editKnowWhen' type='text' value='${filteredNewDate}'></p>
            <br>
            <input class='clearEdits' type="reset" value="Clear Out">
            <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
          </fieldset>
        </form>
        </div>
        <button class='deletebutton' id='${deleteButtonId}'><span>Delete this Post</span></button>
      </li>`);
      // console.log('Object id:' + obj._id);

      $('#' + editButtonId).on('click', function(e){
        // e.stopPropagation();
        console.log('Looks for specifics ' + editButtonId);
        $('#postEditBox').toggle(``);
        // console.log(`Edit called on ${id}`);
        $('#editQuestionTitle').val(obj.title);
        $('#editInfoData').val(obj.question.content);
        $('#editContentInfo').val(obj.question.childAge);
        $('#editAnswer').val(obj.question.foundAnswer);
        $('#editKnowWhen').val(filteredNewDate);
        console.log('triple check: ' + obj._id);
        window.sessionStorage.setItem("id", obj._id);
        window.sessionStorage.setItem('nameOfParent', obj.parentName);


        editPost();
        //not necessarily to set this way.
        emptyEditPost(obj._id);
      });
      $('.closeEdit').click(function(){
        $('#postEditBox').hide();
      })
      $('#editSubmit').click(function(){
        $('#postEditBox').hide();
      });
      $('#' + deleteButtonId).click(function(e){
        e.preventDefault();
        deletePost(obj._id);
        // console.log(`Delete called on ${id}`);
      });
  });
  }

  // $('#container-main').submit('#editSubmit', function(e){
  //   e.preventDefault();
  //   // console.log('the call id is : ' + callId);
  //   // console.log(callId);
  //   let editedData = {};
  //   editedData.id = document.getElementById('byID').value;
  //   console.log(editedData.id);
  //   editedData.parentName = document.getElementById('editParentName').value;
  //   // editedData.zipcode = 55555;
  //   editedData.content = document.getElementById('editInfoData').value;
  //   editedData.childAge = document.getElementById('editContentInfo').value;
  //   editedData.foundAnswer = document.getElementById('editAnswer').value;
  //   editedData.date = new Date;
  //   console.log(editedData.date);
  //   editedData.title =  document.getElementById('editQuestionTitle').value;
  //   console.log(editedData);
  //   updatePost(editedData);
  // });


  function editPost(){
    $('#container-main').submit('#editSubmit', function(e){
      e.preventDefault();
      // console.log('the call id is : ' + callId);
      // console.log(callId);
      let newID = sessionStorage.getItem("id");
      let editedData = {};
      editedData.id = newID;
      console.log(editedData.id);
      editedData.parentName = $('#editParentName').val();
      // editedData.zipcode = 55555;
      editedData.content = $('editInfoData').val();
      editedData.childAge = $('#editContentInfo').val();
      editedData.foundAnswer = $('#editAnswer').val();
      editedData.date = new Date;
      console.log(editedData.date);
      editedData.title =  $('#editQuestionTitle').val();
      updatePost(editedData);
    });
  }

function passingName(name){
  console.log("checking phase" + name);
  // const personName = sessionStorage.getItem("user");
  // console.log("phase checkpoint: " + personName);
  $('#singlePost').submit('#postSubmit', function(e){
    e.preventDefault();
    // console.log('The transcation executed ' + name); phase 1
    let data = {};
    data.parentName = name;
    console.log('In passing name function' + data.parentName);
    // data.zipcode = 80246;

    data.title =  $('#questionTitle').val();
    data.content = $('#infoData').val();
    data.childAge = $('#contentInfo').val();
    data.foundAnswer = $('#answer').val();
    data.date = new Date();
    // console.log("post result" + JSON.stringify(data));
    addPost(data);
    clearFields('singlePost');
  });
}
function clearFields(passTheID){
  console.log('pass or not: ' + passTheID);
// $(passTheID).reset();
$("#"+ passTheID)[0].reset();
}


function addPost(dataPost) {
  dataPost.question = {
    content: dataPost.content,
    childAge: dataPost.childAge,
    foundAnswer: dataPost.foundAnswer,
    date: dataPost.date
  };
  // console.log('add new post: ' + dataPost.parentName + ' ' + dataPost.zipcode + ' ' + dataPost.title + ' ' + dataPost.content + ' ' + dataPost.childAge + ' ' + dataPost.foundAnswer);
  let event = new Date(dataPost.date);

  let options = { year: 'numeric', month: 'long', day: 'numeric' };

  let filteredAddPostDate = event.toLocaleDateString('en-US', options);

  $.ajax({
    method: 'POST',
    url: posts_centerURL,
    data: JSON.stringify(dataPost),
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      swal('Your post was submitted', 'congratulations', 'success');
      $('#usersPosts').append(
        `<li class='eachPost'>
          <ul id="questionData"> "${dataPost.title}""</ul>
          <p>By ${dataPost.parentName}</p>
          <p>- ${dataPost.content} -</p>
          <p id='contentInfo'> from my ${dataPost.childAge} yrs child</p>
          <p>${dataPost.foundAnswer} answer.</p>
          <p>Posted by: ${filteredAddPostDate}</p>
          <input type='hidden' value='${dataPost.id}'>
        </li>`);
        let bringName = sessionStorage.getItem("user");
        fetchUserPosts(bringName);
    },
    error: function (jqXHR, exception) {
       // console.log("sanity check, log in error callback"); phase 1
       var msg = '';
       if (jqXHR.status === 0) {
           msg = 'Not connect.\n Verify Network.';
       } else if (jqXHR.status == 404) {
           msg = 'Requested page not found. [404]';
       } else if (jqXHR.status == 500) {
           msg = 'Internal Server Error [500].';
       } else if (exception === 'parsererror') {
            console.log(JSON.stringify(jqXHR));
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
           msg = 'Time out error.';
       } else if (exception === 'abort') {
           msg = 'Ajax request aborted.';
       } else {
           msg = 'Uncaught Error.\n' + jqXHR.responseText;
       }
     console.log(msg);
   }
  });
}

function showNav(){
  $('#nav').show();
  $(suggestionTab);
  $('#creationBtn').show();
  $(createPost);
  $(myPosts);
  $(generalQuestions);
  $(getSuggestion);
  $(shareBugReport);
  $(reportIssue);
}

function suggestionTab() {
  $('.suggestionTab').click( function(e){
    e.preventDefault();
    $('#secondaryContainer').html(`
      <form id='suggestionForm' aria-label='Make any suggestion to improve the site.' role='form'>
        Your email please?<br>
        <input id='suggestionEmail' type='text' placeholder='Your email?'>
        <br>
        for future following up
        <br>
        <div>----------------------------------------------------------------</div>
        Your Suggestion(s):
        <br>
        <textarea id='suggestiontext' placeholder='please type down here'></textarea>
        <br>
        <input type='submit' id='suggestionButton' value='Submit your suggestion'>
      </form>`);
  });
}

function getSuggestion(){
  $('#secondaryContainer').on('click', '#suggestionButton', function(e){
    e.preventDefault();
    // console.log('clicked worked...');
    // let email = document.getElementById('suggestionEmail').value;
    // let suggestion = document.getElementById('suggestiontext').value;
    swal('Your suggestion was submitted!', 'Thank you for your time!', 'success');
    // console.log(email + ': ' + suggestion);
    // document.getElementById('suggestionForm').reset();
    clearFields('suggestionForm');
  });
}

function createPost(){
  $('#postCreation').click( function(e){
    e.preventDefault();
    // console.log('post testing worked');
    $('#postbox').toggle(``);
  });
  $('.close').click(function(){
    $('#postbox').hide();
  })
  $('#postSubmit').click(function(){
    $('#postbox').hide();
  });  $('#editSubmit').empty();
}

function deletePost(postId) {
  // console.log('Deleting Post `' + postId + '`');
  $.ajax({
    url: posts_centerURL + '/' + postId,
    method: 'DELETE',
    success: function(){
      // console.log('Post deleted with id' + postId);
      // fetchAllPosts();
      const theUser = sessionStorage.getItem("user");
      fetchUserPosts(theUser);
    }
  });
}

function updatePost(changePost) {
  // console.log(changePost.id);
  // console.log(changePost);
  // console.log('updating post` ' + changePost.id + ' `');
  console.log('check new date: ' + changePost.date);
  let id = changePost.id;
  console.log('updatePost: ' + id);
  $.ajax({
    url: posts_centerURL + '/' + id,
    method: "PUT",
    contentType: "application/json",
    // dataType: "json",
    data: JSON.stringify({
      "title": changePost.title,
      "parentName": changePost.parentName,
      // "zipcode": changePost.zipcode,
      "question": {
        "content": changePost.content,
        "childAge": changePost.childAge,
        "foundAnswer": changePost.foundAnswer,
        "date": changePost.date
      }
    }),
    success: function(changePost) {
      // console.log('Successful opened - ' + changePost); phase 1
      // fetchAllPosts();
      // swal
      let bringName = sessionStorage.getItem("user");
      fetchUserPosts(bringName);
    }
  })
  .done(function(changePost){
    // console.log('successful:' + changePost); phase 1
  })
  .fail(function(xhr, status, errorThrown){
    swal('This process has been failed', 'warning');
    console.log('status: ' + status);
    console.log('error: ' + errorThrown);
    console.log(xhr);
  });
}

function myPosts(data){
  $('.myPosts').on('click', function(e){
        // console.log('*my Posts clicked*');
        console.log("passing " + data + ' through myPost function');
        e.preventDefault();
        $('#postCreation').show();
        let name = data;
        console.log("name checking not function: " + name);
        const stayInWeb = sessionStorage.getItem("user");
        console.log("Double checking " + stayInWeb);
        if(stayInWeb){
          renderMainPage();
          fetchUserPosts(stayInWeb);
        }else {
        renderMainPage();
        fetchUserPosts(name);
      }
        // myPostIcon(data);
  });
}
// function myPosts2(data){
//   $('#myPosts2').click(function(e){
//       e.preventDefault();
//       myPosts(data);
//   });
// }

function generalQuestions(){
  $('#generalQuestions').click(function(e){
    // console.log('*general tab clicked*');
    e.preventDefault();
    renderMainPage();
    fetchAllPosts();
  });
}

function generalIcon(){
  $('#generalQuestions2').click(function(e){
    // console.log('Menu Icon clicked!');
    e.preventDefault();
    renderMainPage();
    fetchAllPosts();
  });
}
// function myPostIcon(name){
//   $('#myPosts2').click(function(e){
//     e.preventDefault();
//     console.log(name);
//     // renderMainPage();
//     // fetchUserPosts(name);
//     myPosts(name);
//   });
// }

function freqAQs(){
  $('.container').on('click', '#faqTab', function(e){
    e.preventDefault();
    $('#secondaryContainer').html(`
      <h2>Your FAQs board!</h2>
      <ul class='f' > Information center for your Questions/Answers
        <li>Q: Is there any children age limit for asking a question?
          <li class='s'>A: Guess as long it is before teenager age since this site is designed for early age child's questions.</li>
        </li>
        <li>Q: Can I post a child's ridiculous, embarrassed, awkward, and hard question?
          <li class='s'>A: Hell yeah, there is no question that is not allowed to be share! </li>
        </li>
        <li>Q: Where can I report about my concern(s)?
          <li class='s'>A: You can find the icon at bottom left corner. Just click it away.</li>
        </li>
        <li>Q: More questions coming up!
            <li class='s'>A: Patience...Time will tell.</li>
        </li>
      </ul>`);
  });
}

function previousPage(){
  $('.container').on('click','.goBack', function(){
    // console.log('go back clicked');
    location.reload();
  });
}
//
// function empty(){
//   const xTitle = document.getElementById('questionTitle').value;
//   const xContent = document.getElementById('infoData').value;
//   const xAge = document.getElementById('contentInfo').value;
//   const xAnswer = document.getElementById('answer').value;
  //
  // $('#singlePost').submit(function(e){
  //   e.preventDefault();
  //   if($.trim($("#questionTitle").val()) === "" || $.trim($("#infoData").val()) === "" || $.trim($('#contentInfo').val()) === "" || $.trim($("#answer").val() === "")) {
  //     swal("You didn't fill out one of the fields", "failure");
  //     return false;
  //   }
  // });


//
//   if (xTitle == ""){
//     alert('Please enter title.');
//     return false;
//   } else if (xContent == ""){
//     alert('please enter your content');
//     return false;
//   } else if (xAge == ""){
//     alert("Please enter your child's age");
//     return false;
//   } else if (xAnswer == ""){
//     alert('Please pick your answer');
//     return false;
//   } else{
//     return true;
//   };
// }
// $(empty);

function emptyPost(){
  $('#postSubmit').click(function(){
    if($("#questionTitle").val() == '' || $("#infoData").val() == '' || $("#contentInfo").val() == '' || $("#answer").val() == '') {
      swal('Missing information in one of information inputs', 'failure');
      return false;
    }
  });
}

$(emptyPost);

function emptyEditPost(dataID){
  $("#editSubmit").click(function(){
    if($(`#${dataID}`).val() == '' || $("#editQuestionTitle").val() == ''
    || $('#editInfoData').val() == '' || $("#editContentInfo").val() == '' || $("#editAnswer").val() == ''){
      swal("You missed one or some editing inputs, please double check", "failure");
      return false;
    }
  });
}
$(emptyEditPost);

function executeCRUDProject(){
  // $(receiveUserInfo);
  $(freqAQs);
  $(previousPage);
  $(peekInPw);
  $(collectLoginData);
  $(profileCreation);
  // $(reportIssue);
  // $(passingName);
  $(generalIcon);
  // $(myPostIcon);
}


$(executeCRUDProject);
