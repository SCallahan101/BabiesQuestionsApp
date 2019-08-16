'use strict';

const posts_centerURL = 'https://evening-wave-91131.herokuapp.com/questionPost';
const usersLoginURL = 'https://evening-wave-91131.herokuapp.com/api/auth/login';
const usersDataBankURL = 'https://evening-wave-91131.herokuapp.com/api/protected';
const usernamesDb = 'https://evening-wave-91131.herokuapp.com/api/users';

function loginForm(){
$(document).ready(function(){
  const loggedJWT = sessionStorage.getItem("jwt");
  if(loggedJWT){
    const data = {
      "authToken": loggedJWT
    }
    transferJWT(data);
    keepNameIn();
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

function peekInPw() {
  $('#peekPW').click(function(){
    // e.preventDefault();
    const x = $("#loginPassword")[0];
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });
}
function peekInProfilePw() {
  $('#peekProfilePW').click(function(){
    const y = $("#profilePW")[0];
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
  });
}

function collectLoginData(){
  $('#entryLogin').on('click','#entrySubmit', function(e){
    e.preventDefault();
    let username = $('#loginUsername').val();
    let password = $('#loginPassword').val();
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
  const loginData = {
    url: usersLoginURL,
    data: {
      "username": user,
      "password": pw
    },
    dataType: 'json',
    method: 'POST',
    success: function(callback){
      transferJWT(callback);
    },
    error: function (jqXHR, exception) {
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
  $.ajax(loginData);
}

function transferJWT(jwt){
  window.sessionStorage.setItem("jwt", jwt.authToken);
  const secondaryJWT = JSON.stringify(jwt);
  const loginJWT = {
    url: usersDataBankURL,
    headers:{'Authorization': "Bearer " +  jwt.authToken || secondaryJWT},
    dataType: 'json',
    method: 'GET',
    success: function loginToMainPage(){
      renderMainPage();
      showNav();
      fetchAllPosts();
      $('#menuDesignation').show();
    }
  };
  $.ajax(loginJWT);
}

function getInfoFromUsername(dataName){
  const usernamePath = {
    url: usernamesDb + "/singleUsername/" + dataName,
    dataType: 'json',
    method: 'GET'
  };
  $.ajax(usernamePath)
  .done(function(name){
    let result = name.find(obj => {
      return obj;
    });
    let passTheName = result.firstName + ' ' + result.lastName;
        window.sessionStorage.setItem("user", passTheName);
    passingName(passTheName);
  });
}
function keepNameIn(){
    const nameAfterRefresh = sessionStorage.getItem("user");
        myPosts(nameAfterRefresh);
        passingName(nameAfterRefresh);
}

function renderMainPage(){
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
      if($("#profileUser").val() == '' || $("#profilePW").val() == '' || $("#profileZip").val() == '' ||$("#profileFN").val() == '' || $("#profileLN").val() == '') {
        swal('Missing information in one of information inputs', 'failure');
        return false;
      }else{
        let userInfoData = {};
        userInfoData.username = $('#profileUser').val();
        userInfoData.password = $('#profilePW').val();
        userInfoData.firstName = $('#profileFN').val();
        userInfoData.lastName = $("#profileLN").val();
        registerUserURL(userInfoData);
      }
    // let userInfoData = {};
    // userInfoData.username = $('#profileUser').val();
    // userInfoData.password = $('#profilePW').val();
    // userInfoData.firstName = $('#profileFN').val();
    // userInfoData.lastName = $("#profileLN").val();
    //  registerUserURL(userInfoData);
  });
}

function registerUserURL(data){
  $.ajax({
    method: 'POST',
    url: usernamesDb,
    data: JSON.stringify(data),
    contentType:'application/json',
    success: function(data){
      swal('Your registration got through!', 'New accomplishment for you!', 'success');
    },
    error: function (jqXHR, exception) {
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
     // swal('Something went terrible wrong. Check: ' + msg, 'warning');
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
  $.ajax(postsData);
}

function renderPosts(data) {
  $('#usersPosts').html(' ');
  $.each(data.questionPosts, function(i, obj){
    let id = 'questionData_' + i;
    let deleteButtonId = `deleteButton_${i}`;
    let editButtonId = `editCreation_${i}`;
    let event = new Date(obj.question.date);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let filteredDate = event.toLocaleDateString('en-US', options);
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
});
}

  function fetchUserPosts(name) {
    window.sessionStorage.setItem("user", name);
    const userPostsData = {
      url: posts_centerURL + "/parent/" + name,
      dataType: 'json',
      method: 'GET'
    };
    $.ajax(userPostsData)
    .done(function(data){
      renderUserPosts(data);
    });
  }

  function renderUserPosts(data) {
    $('#usersPosts').html(' ');
    $.each(data, function(i, obj){
      let id = 'questionData_' + i;
      let deleteButtonId = `deleteButton_${i}`;
      let editButtonId = `editCreation_${i}`;
      let event = new Date(obj.question.date);
      let options = { year: 'numeric', month: 'long', day: 'numeric' };
      let filteredUserDate = event.toLocaleDateString('en-US', options);
      let editEvent = new Date;
      let filteredNewDate = editEvent.toLocaleDateString('en-US', options);
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
              <select id='editAnswer'>
                <option disabled selected value>Pick one</option>
                <option value="No, I haven't find any">No</option>
                <option value='Yes, I did found my'>Yes</option>
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
      $('#' + editButtonId).on('click', function(e){
        $('#postEditBox').toggle(``);
        $('#editQuestionTitle').val(obj.title);
        $('#editInfoData').val(obj.question.content);
        $('#editContentInfo').val(obj.question.childAge);
        $('#editAnswer').val(obj.question.foundAnswer);
        $('#editKnowWhen').val(filteredNewDate);
        window.sessionStorage.setItem("id", obj._id);
        editPost();
        emptyEditPost(obj._id);
      });
      $('.closeEdit').click(function(){
        $('#postEditBox').hide();
      })
      $('#editSubmit').click(function(){
        $('#postEditBox').hide();
      });
      $('#' + deleteButtonId).click(function(){
        deletePost(obj._id);
      });
  });
  }

  function editPost(){
    $('#container-main').submit('#editSubmit', function(e){
      e.preventDefault();
      let newID = sessionStorage.getItem("id");
      let editedData = {};
      editedData.id = newID;
      editedData.parentName = $('#editParentName').val();
      // editedData.zipcode = 55555;
      editedData.content = $('#editInfoData').val();
      editedData.childAge = $('#editContentInfo').val();
      editedData.foundAnswer = $('#editAnswer').val();
      editedData.date = new Date;
      editedData.title =  $('#editQuestionTitle').val();
      updatePost(editedData);
    });
  }

function passingName(name){
  $('#singlePost').submit('#postSubmit', function(e){
    e.preventDefault();
      if($("#questionTitle").val() == '' || $("#infoData").val() == '' || $("#contentInfo").val() == '' || $("#answer").val() == '') {
        swal('Missing information in one of information inputs', 'failure');
        return false;
      }else{
        let data = {};
        data.parentName = name;
        data.title =  $('#questionTitle').val();
        data.content = $('#infoData').val();
        data.childAge = $('#contentInfo').val();
        data.foundAnswer = $('#answer').val();
        data.date = new Date();
        addPost(data);
        clearFields('singlePost');
      }
  });
}
function clearFields(passTheID){
$("#"+ passTheID)[0].reset();
}

function addPost(dataPost) {
  let event = new Date(dataPost.date);
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  let filteredAddPostDate = event.toLocaleDateString('en-US', options);
  $.ajax({
    url: posts_centerURL,
    data: JSON.stringify({
      "title": dataPost.title,
      "parentName": dataPost.parentName,
      "question": {
        "content": dataPost.content,
        "childAge": dataPost.childAge,
        "foundAnswer": dataPost.foundAnswer,
        "date": dataPost.date
      }
    }),
    method: 'POST',
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
       console.log("sanity check, log in error callback");
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
  $('#creationBtn').show();
  $(createPost);
  $(myPosts);
  $(generalQuestions);
}

function createPost(){
  $('#postCreation').click( function(){
    $('#postbox').toggle(``);
  });
  $('.close').click(function(){
    $('#postbox').hide();
  })
  $('#postSubmit').click(function(){
    $('#postbox').hide();
  });
   $('#editSubmit').empty();
}

function deletePost(postId) {
  $.ajax({
    url: posts_centerURL + '/' + postId,
    method: 'DELETE',
    success: function(){
      const theUser = sessionStorage.getItem("user");
      fetchUserPosts(theUser);
    }
  });
}

function updatePost(changePost) {
  let id = changePost.id;
  $.ajax({
    url: posts_centerURL + '/' + id,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      "title": changePost.title,
      "parentName": changePost.parentName,
      "question": {
        "content": changePost.content,
        "childAge": changePost.childAge,
        "foundAnswer": changePost.foundAnswer,
        "date": changePost.date
      }
    }),
    success: function(changePost) {
      let bringName = sessionStorage.getItem("user");
      fetchUserPosts(bringName);
    }
  })
  .done(function(changePost){
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
        e.preventDefault();
        $('#postCreation').show();
        let name = data;
        const stayInWeb = sessionStorage.getItem("user");
        if(stayInWeb){
          renderMainPage();
          fetchUserPosts(stayInWeb);
        }else {
        renderMainPage();
        fetchUserPosts(name);
      }
  });
}

function generalQuestions(){
  $('#generalQuestions').click(function(e){
    e.preventDefault();
    $('#postCreation').hide();
    renderMainPage();
    fetchAllPosts();
  });
}

function generalIcon(){
  $('#generalQuestions2').click(function(e){
    e.preventDefault();
    renderMainPage();
    fetchAllPosts();
  });
}

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
    location.reload();
  });
}

function emptyEditPost(dataID){
  $("#editSubmit").click(function(){
    if($(`#${dataID}`).val() == '' || $("#editQuestionTitle").val() == ''
    || $('#editInfoData').val() == '' || $("#editContentInfo").val() == '' || $("#editAnswer").val() == ''){
      swal("You missed one or some editing inputs, please double check", "failure");
      return false;
    }
  });
}


function executeCRUDProject(){
  $(freqAQs);
  $(previousPage);
  $(peekInPw);
  $(collectLoginData);
  $(profileCreation);
  $(generalIcon);
}

$(executeCRUDProject);
