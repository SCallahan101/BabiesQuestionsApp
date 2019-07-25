'use strict';

function openTheTitleInfo(){
  $('#titleInfo').click(function(){
    $('#pageExplanation').toggle();
  });
}
$(openTheTitleInfo);


const posts_centerURL = 'https://evening-wave-91131.herokuapp.com/questionPost';
const usersLoginURL = 'https://evening-wave-91131.herokuapp.com/api/auth/login';
const usersDataBankURL = 'https://evening-wave-91131.herokuapp.com/api/protected';
const usernamesDb = 'https://evening-wave-91131.herokuapp.com/api/users';

function loginForm(){
$(document).ready(function(){
  const loggedJWT = sessionStorage.getItem("jwt");
  console.log("transfer testing - " + loggedJWT);
  if(loggedJWT === true){
    console.log("condition worked");
    transferJWT(loggedJWT);
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
        <!-- <input id='entrySubmit' type='submit' value='Login'> -->
        <img id='entrySubmit' src="https://img.icons8.com/ios/50/000000/login-rounded-filled.png" alt='entryButton' >
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

function peekInPw() {
  $('#peekPW').click(function(){
    // e.preventDefault();
    const x = document.getElementById("loginPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });
}
function peekInProfilePw() {
  $('#peekProfilePW').click(function(){
    const y = document.getElementById("profilePW");
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
    let username = document.getElementById('loginUsername').value;
    // console.log('username: ' +  username); phase 1
    let password = document.getElementById('loginPassword').value;
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

function stayAfterRefresh(){
// window.addEventListener("onbeforeunload", function(event){
//   console.log("listen to refresh button");
// });
window.onbeforeunload = function(e){
  e.preventDefault();
  console.log('Well I guess it works');
  e.returnValue = "false";
};
$(window).on("unload", function(e){
  // e.preventDefault();
  console.log("success with this bs");
  const stayInWeb = sessionStorage.getItem("username");
  console.log("testing " + stayInWeb);
  const pwInWeb = sessionStorage.getItem("password");
  console.log("testing " + pwInWeb);
  // $(function(){
  //   $('#loginUsername').val(stayInWeb);
  //   $('#loginPassword').val(pwInWeb);
  //   loginEntry(stayInWeb, pwInWeb);
  // });
  loginEntry(stayInWeb, pwInWeb);
  // renderMainPage();
});
}
// $(stayAfterRefresh);

function keepUserLoggedIn(){
  $(document).ready(function(){
    const stayInWeb = sessionStorage.getItem("username");
    console.log("testing2 " + stayInWeb);
    const pwInWeb = sessionStorage.getItem("password");
    console.log("testing2 " + pwInWeb);
    // $(function(){
    //   $('#loginUsername').val(stayInWeb);
    //   $('#loginPassword').val(pwInWeb);
    //   loginEntry(stayInWeb, pwInWeb);
    // });
    loginEntry(stayInWeb, pwInWeb);
  });
}
// $(keepUserLoggedIn);

function logOutUser(){
  $('#logOut').on('click', function(){
    window.sessionStorage.removeItem("username");
    window.sessionStorage.removeItem("password");
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
    // console.log('double check to see if passing worked ' + passTheName);
    //Now Get this information to MyPost
    myPosts(passTheName);
    passingName(passTheName);
  });
}

function renderMainPage(){
  $('#container-main').html(`
  <section id='secondaryContainer'>
  <h3>Your Sharing Center</h3>
   <ul id='usersPosts'>
   </ul>
  </section>`);
  }

function reportIssue() {
  $('#reportButton').click(function(e){
    e.preventDefault();
    $('.container').html(`
      <h2>Issue(s) report page</h2>
      <section>
        <p>Please share your concern regarding anything in this site</p>
        <form id='submitIssue' aria-label='Submit your concern' role='form'>
          <input class='reportbox' type='text' placeholder='Your name?'>
          <br>
          <input class='reportbox' type='text' placeholder='Your email?'>
          <br>
          <textarea class='reporttext' placeholder='please type down here'></textarea>
          <br>
          <button id='submitreport' type='reset'><span>Submit your concern(s)</span></button>
          <input class='goBack' value='Back' type='button'>
        </form>
      </section>
      `);
  });
}

function profileCreation() {
  $('#signUp').click(function(e) {
    e.preventDefault();
    $('.container').html(
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
}

function receiveUserInfo(){
  $('.container').submit('#profileForm', function(e){
    e.preventDefault();
    let userInfoData = {};
    userInfoData.username = document.getElementById('profileUser').value;
    // console.log(userInfoData.username);
    userInfoData.password = document.getElementById('profilePW').value;
    // console.log(userInfoData.password);
    userInfoData.firstName = document.getElementById('profileFN').value;
    // console.log(userInfoData.firstName);
    userInfoData.lastName = document.getElementById('profileLN').value;
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
    // console.log(obj.question.date);
    let event = new Date(obj.question.date);

    let options = { year: 'numeric', month: 'long', day: 'numeric' };

    let filteredDate = event.toLocaleDateString('en-US', options);


    // console.log(deleteButtonId);
    // console.log(editButtonId);
    $('#usersPosts').append(`
      <li class='eachPost'>
      <ul id="questionData">Post Title: "${obj.title}"</ul>
      <p>Parent: ${obj.parentName}</p>
      <p>Content: "${obj.question.content}"</p>
      <p>from my ${obj.question.childAge} yrs child</p>
      <p>Found answer? - ${obj.question.foundAnswer} </p>
      <p>Date posted: ${filteredDate}</p>
      <div class='post-user'>
      </div>
      <input type='hidden' value='${obj.id}'>
      <br>

      <div id='postEditBox'>
      <form id='postEdit' aria-label='Edit your post' role='form'>
      <fieldset id='postDesign'>
        <legend>Edit your post</legend>
          Title: <input id="editQuestionTitle" class='postInfo' type='text' value='' placeholder='Write down the title'>
          <br>
          Content: <input id='editInfoData' class='postInfo' type='text' value='' placeholder='Short content of question'>
          <br>
          Your child: <input id='editContentInfo' type='text' placeholder='Child age?'>
          <br>
          <p>Found your answer?</p>
            <select id='editAnswer' name='gotAnswer'>
              <option value=''>Pick one</option>
              <option value='No'>No</option>
              <option value='Yes'>Yes</option>
            </select>
          <br>
          <p id='editKnowWhen'>date:  </p>
          <br>
          <input class='clearEdits' type="reset" value="Clear Out">
          <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
        </fieldset>
      </form>
      </div>
      <button class='heartButton' label='Heart this Post'><span>♥</span></button>
    </li>`);
    // console.log('Object id:' + obj.id);
      $('.heartButton').click(function(e){
        e.preventDefault();
        swal("Your ♥heart♥ is sending to the user", "♥ Looking around for some more ♥", "success");
      });
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
    const userPostsData = {
      url: posts_centerURL + "/parent/" + name ,
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
    // console.log("Client received data"); phase 1
    // console.log(data);
    $.each(data, function(i, obj){
      let id = 'questionData_' + i;
      let deleteButtonId = `deleteButton_${i}`;
      let editButtonId = `editCreation_${i}`;
      // console.log('For the user - ' + obj.question.date);
      let event = new Date(obj.question.date);

      let options = { year: 'numeric', month: 'long', day: 'numeric' };

      let filteredUserDate = event.toLocaleDateString('en-US', options);

      let editEvent = new Date;
      let filteredNewDate = editEvent.toLocaleDateString('en-US', options);

      // console.log(deleteButtonId);
      // console.log(editButtonId);
      $('#usersPosts').append(`
        <li class='eachPost'>
        <ul id="questionData">Post Title: ${obj.title}</ul>
        <p>By: ${obj.parentName} <span>from: ${obj.zipcode}</span></p>
        <p>Content: ${obj.question.content} <span> For my ${obj.question.childAge} yrs child</span></p>
        <p>Found answer? - ${obj.question.foundAnswer} </p>
        <p>Date posted: ${filteredUserDate}</p>
        <div class='post-user'>
        </div>
        <input type='hidden' value='${obj.id}'>
        <br>
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
            Content: <input id='editInfoData' class='postInfo' type='text' value='' placeholder='Short content of question'>
            <br>
            Your child's age: <input id='editContentInfo' type='text' placeholder='Child age?'>
            <br>
            <p>Found your answer?</p>
              <select id='editAnswer' name='gotAnswer'>
                <option value=''>Pick one</option>
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
              </select>
            <br>
            <p id='editKnowWhen'>Current Date: ${filteredNewDate}</p>
            <br>
            <input class='clearEdits' type="reset" value="Clear Out">
            <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
          </fieldset>
        </form>
        </div>
        <button class='deletebutton' id='${deleteButtonId}'><span>Delete this Post</span></button>
      </li>`);
      // console.log('Object id:' + obj._id);

      $('#' + editButtonId).click(function(e){
        e.preventDefault();
        $('#postEditBox').toggle(``);
        // console.log(`Edit called on ${id}`);
        editPost(obj._id);
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

  function editPost(callId){
    $('#container-main').submit('#editSubmit', function(e){
      e.preventDefault();

      // console.log(callId);
      let editedData = {};
      editedData.id = callId;
      editedData.parentName = 'Nobody';
      editedData.zipcode = 55555;
      editedData.content = document.getElementById('editInfoData').value;
      editedData.childAge = document.getElementById('editContentInfo').value;
      editedData.foundAnswer = document.getElementById('editAnswer').value;
      editedData.date = document.getElementById('editKnowWhen').value;
      editedData.title =  document.getElementById('editQuestionTitle').value;
      updatePost(editedData);
    });
  }

function passingName(name){
  $('#singlePost').submit('#postSubmit', function(e){
    e.preventDefault();
    // console.log('The transcation executed ' + name); phase 1
    e.preventDefault();
    let data = {};
    data.parentName = name;
    data.zipcode = 80246;

    data.title =  document.getElementById('questionTitle').value;
    data.content = document.getElementById('infoData').value;
    data.childAge = document.getElementById('contentInfo').value;
    data.foundAnswer = document.getElementById('answer').value;
    data.date = new Date();
    // console.log("post result" + JSON.stringify(data));
    addPost(data);
    // empty();
  });
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
          <ul id="questionData">Post Title: ${dataPost.title}</ul>
          <p>By: ${dataPost.parentName} <span id='zipcode'>from: ${dataPost.zipcode}</span></p>
          <p>Content: ${dataPost.content} <span id='contentInfo'> For my ${dataPost.childAge} yrs child</span></p>
          <p>Found answer? - ${dataPost.foundAnswer} </p>
          <p>Date posted: ${filteredAddPostDate}</p>
          <input type='hidden' value='${dataPost.id}'>
          <br>
          <button class='editPost'><span>Edit my post!</span></button>
          <div id='postEditBox'>
          <form id='postEdit' aria-label='Edit tool' role='form'>
          <fieldset id='postDesign'>
            <legend>Edit your post</legend>
              Title: <input id="questionTitle" class='postInfo' type='text' value='' placeholder='Write down the title'>
              <br>
              Content: <input id='infoData' class='postInfo' type='text' value='' placeholder='Short content of question'>
              <br>
              Your child: <input id='contentInfo' type='text' placeholder='Child age?'>
              <br>
              <p>Found your answer?</p>
                <select id='answer' name='gotAnswer'>
                  <option value=''>Pick one</option>
                  <option value='No'>No</option>
                  <option value='Yes'>Yes</option>
                </select>
              <br>
              <p id='knowWhen'>date: </p>
              <br>
              <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
            </fieldset>
          </form>
          </div>
          <button class='deletebutton'><span>Delete this Post</span></button>
        </li>`);
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
}

function suggestionTab() {
  $('#suggestionTab').click( function(e){
    e.preventDefault();
    $('#secondaryContainer').html(`
      <form id='suggestionForm' aria-label='Make any suggestion to improve the site.' role='form'>
        Your email please?<br>
        <input id='suggestionEmail' type='text' placeholder='Your email?'>
        <br>
        it is for future following up
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
  $('#secondaryContainer').submit('#suggestionButton', function(e){
    e.preventDefault();
    // console.log('clicked worked...');
    // let email = document.getElementById('suggestionEmail').value;
    // let suggestion = document.getElementById('suggestiontext').value;
    swal('Your suggestion was submitted!', 'Thank you for your time!', 'success');
    // console.log(email + ': ' + suggestion);
    document.getElementById('suggestionForm').reset();
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
  });
}

function deletePost(postId) {
  // console.log('Deleting Post `' + postId + '`');
  $.ajax({
    url: posts_centerURL + '/' + postId,
    method: 'DELETE',
    success: function(){
      // console.log('Post deleted with id' + postId);
      fetchAllPosts();
    }
  });
}

function updatePost(changePost) {
  // console.log(changePost.id);
  // console.log(changePost);
  // console.log('updating post` ' + changePost.id + ' `');
  let id = changePost.id;
  $.ajax({
    url: posts_centerURL + '/' + id,
    method: "PUT",
    contentType: "application/json",
    // dataType: "json",
    data: JSON.stringify({
      "title": changePost.title,
      "parentName": changePost.parentName,
      "zipcode": changePost.zipcode,
      "question": {
        "content": changePost.content,
        "childAge": changePost.childAge,
        "foundAnswer": changePost.foundAnswer,
        "date": changePost.date
      }
    }),
    success: function(changePost) {
      // console.log('Successful opened - ' + changePost); phase 1
      fetchAllPosts();
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
  $('#myPosts').click(function(e){
        // console.log('*my Posts clicked*');
        // console.log("passing " + data + ' through myPost function'); phase 1
        e.preventDefault();
        let name = data;
        renderMainPage();
        fetchUserPosts(name);
        // myPostIcon(data);
  });
  $('#myPosts2').click(function(e){
        // console.log('*my Posts clicked*');
        // console.log("passing Icon " + data + ' through myPost function'); phase 1
        e.preventDefault();
        let name = data;
        renderMainPage();
        fetchUserPosts(name);
        // myPostIcon(data);
  });
}

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
  $(receiveUserInfo);
  $(freqAQs);
  $(previousPage);
  $(peekInPw);
  $(collectLoginData);
  $(profileCreation);
  $(reportIssue);
  $(passingName);
  $(generalIcon);
  // $(myPostIcon);
}


$(executeCRUDProject);
