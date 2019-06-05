'use strict'

// const CORS = 'https://cors-anywhere.herokuapp.com/';

// JWT works
// function getToken(){
// const loginURL = 'http://localhost:4747/api/auth/login'
// const xhr = new XMLHttpRequest();
// let userElement = document.getElementById('loginUsername');
// let passwordElement = document.getElementById('loginPassword');
// const tokenElement = document.getElementById('token');
// let user = userElement.value;
// let password = passwordElement.value;
//
// xhr.open('POST', loginURL, true);
// xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
// xhr.addEventListener('load', function(){
//   let responseObject = JSON.parse(this.response);
//   console.log(responseObject);
//   if(responseObject.token){
//     tokenElement.innerHTML = responseObject.token;
//   }else {
//     tokenElement.innerHTML = "No Token received";
//   }
// });
// let sendObject = JSON.stringify({name: user, password: password});
// console.log('going to send', sendObject);
// xhr.send(sendObject);
// }
//
// function collectLoginData(){
//   $('#entryLogin').on('click', '#entrySubmit', function(e){
//     e.preventDefault();
//     $(getToken);
//   })
// }
// $(collectLoginData);
function collectLoginData(){
  $('#entryLogin').on('click','#entrySubmit', function(e){
    e.preventDefault();
    // const entryInfo = {};
    let username = document.getElementById('loginUsername').value;
    console.log('username: ' +  username);
    let password = document.getElementById('loginPassword').value;
    console.log("password: " + password);
    // console.log(username "|" password);
    getInfoFromUsername(username)
    loginEntry(username, password)
    })
}
$(collectLoginData);

const usernamesDb = 'https://evening-wave-91131.herokuapp.com/api/users'

function getInfoFromUsername(dataName){
  console.log("retrieved the username: " + dataName);
  const usernamePath = {
    url: usernamesDb + "/singleUsername/" + dataName,
    // data: {
    //   'username': dataName
    // },
    dataType: 'jsonp',
    method: 'GET'
    // success:
  };
  $.ajax(usernamePath)
  .done(function(name){
    console.log(
      // 'Confirmed transfer ' + name + ' to My Post tab'
      JSON.stringify(name),
      JSON.stringify(name, ['firstName', 'lastName'])
    );
    let result = name.find(obj => {
      return obj
    });
    console.log(result.firstName + ' ' + result.lastName);
    let passTheName = result.firstName + ' ' + result.lastName;
    console.log('double check to see if passing worked ' + passTheName);
    //Now Get this information to MyPost
    myPosts(passTheName);
    // addPost()
    passingName(passTheName);

    // fetchUserPosts(passTheName);
  });
}

// $(getInfoFromUsername);

function myPosts(data){
  $('#myPosts').click(function(e){
        console.log('*my Posts clicked*');
        console.log("passing " + data + ' through myPost function');
        e.preventDefault();
        //testing
        // let name = 'Sarah' + ' ' + 'Batahi';
        let name = data;

        renderMainPage();
        fetchUserPosts(name);
  });
}

function peekInPw() {
  $('#peekPW').click(function(e){
    e.preventDefault();
    const x = document.getElementById("loginPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });
}
$(peekInPw);


function loginEntry(user, pw){
  console.log(user + " | " + pw);
  const loginData = {
    url: usersLoginURL,
    data: {
      'username': user,
      'password': pw
    },
    dataType: 'jsonp',
    method: 'POST',
    success: function(callback){
      console.log("First Step - received and sending: " + callback.authToken);
      // const jwtAuth = new jwtAuth(callback);
      transferJWT(callback);

      // const confirmedJWT = new localStrategy(data.user, data.password, callback);
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
  console.log(loginData);
  $.ajax(loginData);
}


// let printError = function(error, explicit) {
//     console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
// }
//
// try {
//     var json = `
//         {
//             "first": "Jane",
//             "last": "Doe",
//         }
//     `
//     console.log(JSON.parse(json));
// } catch (e) {
//     if (e instanceof SyntaxError) {
//         printError(e, true);
//     } else {
//         printError(e, false);
//     }
// }

function transferJWT(jwt){
  console.log("Second Step received: " + jwt.authToken);
  const loginJWT = {
    url: usersDataBankURL,
    // jwtAuth: jwt,
    headers:{'Authorization': "Bearer " +  jwt.authToken},
    //Still cant get it pass the verfied jwt
    // data: jwt,
    dataType: 'jsonp',
    method: 'GET',
    success: function loginToMainPage(){
    // $('#entrySubmit').click(function(e){
      console.log("***Entry submit  clicked");
      // e.preventDefault();
      renderMainPage();
      showNav();
      fetchAllPosts();
      $('#menuDesignation').show();
    // });
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
    // $(loginToMainPage)
  }

  console.log(loginJWT);
  $.ajax(loginJWT);
}

function userCreation(){

}



const posts_centerURL = 'https://evening-wave-91131.herokuapp.com/questionPost'
// const userPosts_URL = 'http://localhost:4747/questionPost/User'

const usersLoginURL = 'https://evening-wave-91131.herokuapp.com/api/auth/login'
const usersDataBankURL = 'https://evening-wave-91131.herokuapp.com/api/protected'

function fetchAllPosts() {
  const postsData = {
    url: posts_centerURL,
    dataType: 'jsonp',
    method: 'GET',
    success: renderPosts
  };
  console.log(postsData);
  //$.ajax(postsData);
  //getDataReal(postData)
  $.ajax(postsData);
}

//For my post - user's whole posts.
// let name = "Nick" + " Reed"; //parentName
function fetchUserPosts(name) {
  const userPostsData = {
    url: posts_centerURL + "/parent/" + name ,
    // + '/' + name,
    // cache: false,
    // data: {'parentName': name},
    dataType: 'jsonp',
    method: 'GET'
    // ,
    // parentName: parentName,
    // success:
    // console.log('GET:parentName is successful');
    // function(response){
      // console.log("Nick");
      // let result = "Nick";
      // renderPosts
    // }
  };
  console.log(userPostsData);
  // console.log('parentName:' + name.firstname + ' ' + name.lastName);
  $.ajax(userPostsData)
  .done(function(data){
    // console.log(data.firstName + ' ' + data.lastName);
    console.log("*****DONE*****");
    renderUserPosts(data);
  });
}

function renderUserPosts(data) {
  console.log("Client received data");
  console.log(data);
  $.each(data, function(i, obj){
    let id = 'questionData_' + i;
    let deleteButtonId = `deleteButton_${i}`;
    let editButtonId = `editCreation_${i}`;

    console.log(deleteButtonId);
    console.log(editButtonId);
    $('#usersPosts').append(`
      <li class='eachPost'>
      <ul id="questionData">Post Title: ${obj.title}</ul>
      <p>By: ${obj.parentName} <span>from: ${obj.zipcode}</span></p>
      <p>Content: ${obj.question.content} <span> For my ${obj.question.childAge} yrs child</span></p>
      <p>Found answer? - ${obj.question.foundAnswer} </p>
      <p>Date posted: ${obj.question.date}</p>
      <div class='post-user'>
      </div>
      <input type='hidden' value='${obj.id}'>
      <br>
      <button class='editPost' id='${editButtonId}'>Edit my post!</button>
      <div id='postEditBox'>
      <form id='postEdit'>
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
          <p id='editKnowWhen'>date: ${newCurrentDate} </p>
          <br>
          <input type="reset" value="Clear Out">
          <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
        </fieldset>
      </form>
      </div>
      <button id='${deleteButtonId}'>Delete this Post</button>
    </li>`);
    console.log('Object id:' + obj.id);

    $('#' + editButtonId).click(function(e){
      e.preventDefault();
      $('#postEditBox').toggle(``);
      console.log(`Edit called on ${id}`);
      // updatePost(obj.id);
      // let callId = obj.id;
      // updatePost(obj.id);
      editPost(obj.id);
    });
    $('#' + deleteButtonId).click(function(e){
      e.preventDefault();
      deletePost(obj.id);
      console.log(`Delete called on ${id}`);
    });
});
}



// function getMyPosts(){
//   $('#myPosts').click(function(e){
//     e.preventDefault();
//     let name = 'Sarah Batahi';
//   })
//   // let name = 'Sarah Batahi';
//   fetchUserPosts(name);
// }
// $(getMyPosts);
//_____________________________________________________________

//Call AJAX FRAMEWORK
function addPost(dataPost) {
  dataPost.question = {
    content: dataPost.content,
    childAge: dataPost.childAge,
    foundAnswer: dataPost.foundAnswer,
    date: dataPost.date
  };
  console.log('add new post: ' + dataPost.parentName + ' ' + dataPost.zipcode + ' ' + dataPost.title + ' ' + dataPost.content + ' ' + dataPost.childAge + ' ' + dataPost.foundAnswer);
  $.ajax({
    method: 'POST',
    url: posts_centerURL,
    data: JSON.stringify(dataPost),
    success: function(data) {
      alert('Your post was submitted');

      $('#usersPosts').append(
        `<li class='eachPost'>
          <ul id="questionData">Post Title: ${dataPost.title}</ul>
          <p>By: ${dataPost.parentName} <span id='zipcode'>from: ${dataPost.zipcode}</span></p>
          <p>Content: ${dataPost.content} <span id='contentInfo'> For my ${dataPost.childAge} yrs child</span></p>
          <p>Found answer? - ${dataPost.foundAnswer} </p>
          <p>Date posted: ${dataPost.date}</p>
          <input type='hidden' value='${dataPost.id}'>
          <br>
          <button class='editPost'>Edit my post!</button>
          <div id='postEditBox'>
          <form id='postEdit'>
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
              <p id='knowWhen'>date: ${newCurrentDate}</p>
              <br>
              <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
            </fieldset>
          </form>
          </div>
          <button>Delete this Post</button>
        </li>`);
    },
    dataType: 'jsonp',
    contentType: 'application/json'
  });
}

// <ul id="questionData">Post Title: ${dataPost.titleInfo}</ul>
// <p>The Question: ${dataPost.questionData}</p>
// <p>Content: </p>
// <div class='post-user'>
// ${dataPost.postInfo}
// </div>

function deletePost(postId) {
  console.log('Deleting Post `' + postId + '`');
  $.ajax({
    url: posts_centerURL + '/' + postId,
    method: 'DELETE',
    success: function(e){
      console.log('Post deleted with id' + postId);
    }
  });
}

function updatePost(changePost) {
  console.log(changePost.id);
  console.log(changePost);
  console.log('updating post` ' + changePost.id + ' `');
  // changePost.question = {
  //   content: changePost.content,
  //   childAge: changePost.childAge,
  //   foundAnswer: changePost.foundAnswer,
  //   date: changePost.date
  // }
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
    // {id: changePost},
    success: function(changePost) {
      console.log('Successful opened - ' + changePost);
      //need to fix this.
    }
  })
  .done(function(changePost){
    console.log('successful:' + changePost);

  })
  .fail(function(xhr, status, errorThrown){
    alert('This process has been failed');
    console.log('status: ' + status);
    console.log('error: ' + errorThrown);
    console.log(xhr);
  });
}

const currentDate = new Date();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const year = currentDate.getFullYear();

const newCurrentDate = month + "/" + day + "/" + year;

function renderPosts(data) {
  console.log("Client received data");
  console.log(data);
  $.each(data.questionPosts, function(i, obj){
    let id = 'questionData_' + i;
    let deleteButtonId = `deleteButton_${i}`;
    let editButtonId = `editCreation_${i}`;


    console.log(deleteButtonId);
    console.log(editButtonId);
    $('#usersPosts').append(`
      <li class='eachPost'>
      <ul id="questionData">Post Title: ${obj.title}</ul>
      <p>By: ${obj.parentName} <span>from: ${obj.zipcode}</span></p>
      <p>Content: ${obj.question.content} <span> For my ${obj.question.childAge} yrs child</span></p>
      <p>Found answer? - ${obj.question.foundAnswer} </p>
      <p>Date posted: ${obj.question.date}</p>
      <div class='post-user'>
      </div>
      <input type='hidden' value='${obj.id}'>
      <br>
      <button class='editPost' id='${editButtonId}'>Edit my post!</button>
      <div id='postEditBox'>
      <form id='postEdit'>
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
          <p id='editKnowWhen'>date: ${newCurrentDate} </p>
          <br>
          <input type="reset" value="Clear Out">
          <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
        </fieldset>
      </form>
      </div>
      <button id='${deleteButtonId}'>Delete this Post</button>
    </li>`);
    console.log('Object id:' + obj.id);

    $('#' + editButtonId).click(function(e){
      e.preventDefault();
      $('#postEditBox').toggle(``);
      console.log(`Edit called on ${id}`);
      // updatePost(obj.id);
      // let callId = obj.id;
      // updatePost(obj.id);
      editPost(obj.id);
    });
    $('#' + deleteButtonId).click(function(e){
      e.preventDefault();
      deletePost(obj.id);
      console.log(`Delete called on ${id}`);
    });
});
}

//
// <ul id="${id}">Post Title: ${obj.title}</ul>
// <p>The Question: ${obj.question.content}</p>
// <p>Content: </p>
// const nameOfUser =

//something to receive the username and passing it to createPost
function passingName(name){
  $('#singlePost').submit('#postSubmit', function(e){
    e.preventDefault();
    console.log('The transcation executed ' + name);
    // const theName = name;
    e.preventDefault();
    let data = {};
    data.parentName = name;
    // document.getElementById('whoAndWhere'); //todo add parent name to form
    data.zipcode = 80246;
    // document.getElementById('zip'); //todo add zipcode to form
    data.title =  document.getElementById('questionTitle').value;
    data.content = document.getElementById('infoData').value;
    data.childAge = document.getElementById('contentInfo').value;
    data.foundAnswer = document.getElementById('answer').value;
    data.date = newCurrentDate;
    console.log("post result" + JSON.stringify(data));
    renderMainPage();
    addPost(data);
  });
}
$(passingName);

function renderMainPage(){
  // let obj = passName;
  // console.log("Render page called!");
  // console.log('variable received: ' + obj);
  // const currentDate = new Date();
  // const month = currentDate.getMonth() + 1;
  // const day = currentDate.getDate();
  // const year = currentDate.getFullYear();
  //
  // const newCurrentDate = month + "/" + day + "/" + year;

  $('#container-main').html(`
  <section id='secondaryContainer'>
  <h3>Your Sharing Center</h3>
   <ul id='usersPosts'>
   <li class='eachPost'>
     <ul id="questionData">Post Title:EXAMPLE (title)</ul>
     <p>By:EXAMPLE (parentName)<span id='zipcode'>From: (zipcode)</span></p>
     <p>Content: (question.content)<span id='contentInfo'>for my (question.age)yrs child</span></p>
     <p>Found answer: Y/N </p>
     <div class='post-user'>
     </div>
     <br>
     <button id='editCreation'>Edit my post!</button>
     <button class='deleteButton'>Delete this Post</button>
   </li>
   </ul>
  </section>
  `);
    // id='whoAndWhere' - get parentname from login
    // id='zip' - get zipcode from the login account
    //


  // parentName: req.body.parentName,
  // title: req.body.title,
  // zipcode: req.body.zipcode,
  // question: req.body.question
  // $('#postSubmit').submit(function(e){
  //   e.preventDefault();
  //   let data = {};
  //   // data.parentName = document.getElementById('').value;
  //   // document.getElementById('whoAndWhere'); //todo add parent name to form
  //   data.zipcode = 80246;
  //   // document.getElementById('zip'); //todo add zipcode to form
  //   data.title =  document.getElementById('questionTitle').value;
  //   data.content = document.getElementById('infoData').value;
  //   data.childAge = document.getElementById('contentInfo').value;
  //   data.foundAnswer = document.getElementById('answer').value;
  //   data.date = document.getElementById('knowWhen').value;
  //   console.log("post result" + JSON.stringify(data));
  //   addPost(data);
  //
  // });
}

// function makeAPost(info){
//   $('#postSubmit').click(function(e){
//     e.preventDefault();
//     console.log('parentName: ' + info + ' confirm received');
//     let data = {};
//     data.parentName = document.getElementById('whoAndWhere'); //todo add parent name to form
//     data.zipcode = document.getElementById('zip'); //todo add zipcode to form
//     data.title =  document.getElementById('questionTitle').value;
//     data.content = document.getElementById('infoData').value;
//     data.childAge = document.getElementById('contentInfo').value;
//     data.foundAnswer = document.getElementById('answer').value;
//     data.date = document.getElementById('knowWhen').value;
//     addPost(data);
//   });
// }
// $(makeAPost);

// function postUp(){
// $('.container').on('click', '#postSubmit', function(e){
//   e.preventDefault();
//   const newTitle = document.getElementById('titleInfo').value;
//   console.log(newTitle);
//   const newQuestion = document.getElementById('questionData').value;
//   console.log(newQuestion);
//   console.log("received data for post");
//   $('#usersPosts').append(`<li class='eachPost'>
//     <ul id="questionData">Post Title: ${newTitle}</ul>
//     <p>The Question: ${newQuestion}</p>
//     <p>Content: </p>
//     <div class='post-user'>
//     </div>
//     Put your comment below here:
//     <br>
//     <input type='textarea'>
//   </li>`);
// });
// }

function freqAQs(){
  $('.container').on('click', '#faq', function(e){
    e.preventDefault();
    $('#secondaryContainer').html(`
      <h2>Your FAQs board!</h2>
      <ul class='f' >Questions????
        <li>Q: Is there any children age limit for asking question?
          <li class='s'>A: Guess as long it is before teenager age since this site is design for early age questions.</li>
        </li>
        <li>Q: Can I post a child's ridiclous, embarass, awkward, and hard question?
          <li class='s'>A: Hell yeah, there is no question that is not allow to be share! </li>
        </li>
        <li>Q: Where can I report about my concern?
          <li class='s'>A: You can find the icon at bottom left corner. Just click it away.</li>
        </li>
        <li>Q:
            <li class='s'>A: </li>
        </li>
        <li></li>
        <li></li>
      </ul>`)
  });
}

$(freqAQs);

function suggestionTab() {
  $('#suggestion').click( function(e){
    e.preventDefault();
    $('#secondaryContainer').html(`
      <form id='suggestionForm'>
        Your email please?<br>
        <input class='reportbox' type='text' placeholder='Your email?'>
        <br>
        it is for future following up
        <br>
        <div>----------------------------------------------------------------</div>
        Your Suggestion(s):
        <br>
        <textarea class='suggestiontext' placeholder='please type down here'></textarea>
        <br>
        <input type='submit' id='suggestionButton' value='Submit your suggestion'>
      </form>`)
      // let email = document.getElementByClassName('reportbox').value;
      // let suggestion = document.getElementByClassName('suggestiontext').value;
      // alert('Your suggestion was submitted! Congratulation and thank you for your time!');
  });
  // console.log(email + ': ' + suggestion);
}
function getSuggestion(){
  let email = document.getElementsByClassName('reportbox').value;
  let suggestion = document.getElementsByClassName('suggestiontext').value;
  $('#container-main').submit('#suggestionButton', function(e){
    e.preventDefault();
    alert('Your suggestion was submitted! Congratulation and thank you for your time!');
    console.log(email + ': ' + suggestion);
  })
// console.log(email + ': ' + suggestion);
}
$(getSuggestion);

// function myPosts(){
//   $('#myPosts').click(function(e){
//         console.log('*my Posts clicked*');
//         e.preventDefault();
//         //testing
//         // let name = 'Sarah' + ' ' + 'Batahi';
//         let name = 'Tom Smith';
//         renderMainPage();
//         fetchUserPosts(name);
//   });
// }

//_____________________________________________________________
//users database

// usersDataBankURL
// function addUsers(userInfo) {
//   console.log(userInfo.username + ' | ' + userInfo.firstName + ' | ' + userInfo.lastName);
//   $.ajax({
//     method: 'POST',
//     url: usersDataBankURL,
//     data: JSON.stringify(userInfo),
//     success: function(data) {
//       alert('Your profile was submitted');},
//       datatype: 'json',
//       contentType: 'application/json'
//     }
//     $(addUsers);

 // function receiveUserInfo(){
 //   $('.container').submit('#createdProfile', function(e){
 //     e.preventDefault();
 //     let userInfoData = {};
 //     userInfoData.username = document.getElementById('profileUser').value;
 //     console.log(userInfoData.username);
 //     userInfoData.password = document.getElementById('profilePW').value;
 //     console.log(userInfoData.password);
 //     userInfoData.firstName = document.getElementById('profileFN').value;
 //     console.log(userInfoData.firstName);
 //     userInfoData.lastName = document.getElementById('profileLN').value;
 //     console.log(userInfoData.lastName);
 //      console.log(userInfoData);
 //      registerUserURL(userInfoData)
 //   });
 //
 //   // registerUserURL(userInfoData)
 // }
 // $(receiveUserInfo);

 function registerUserURL(data){

   $.ajax({
     method: 'POST',
     url: usernamesDb,
     data: JSON.stringify(data),
     success: function(data){
       alert('Your registration got through');
       // renderMainPage
     },
     dataType: 'jsonp',
     contentType:'application/json'
   });
 }


  function profileCreation() {
    $('#signUp').click(function(e) {
      e.preventDefault();
      $('.container').html(
        `<form>
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
            Password: <input id="profilePW" class='profiletext' type='text' placeholder='Required Input'>
            <br>
            <p>(Must be total of 8 or more characters long!)</p>
            <br>
            <button id='createdProfile'>Finalize the profile</button>
            <input type="reset" value="Clear Inputs">
            <input class='goBack' value='Back' type='button'>
          </fieldset>
        </form>`
      );
    });

  }

  function reportIssue() {
    $('#reportButton').click(function(e){
      e.preventDefault();
      $('.container').html(`
        <h2>Issue(s) report page</h2>
        <section>
          <p>Please share your concern regarding anything in this site</p>
          <form id='submitIssue'>
            <input class='reportbox' type='text' placeholder='Your name?'>
            <br>
            <input class='reportbox' type='text' placeholder='Your email?'>
            <br>
            <textarea class='reporttext' placeholder='please type down here'></textarea>
          </form>
        </section>
        <button>Submit your concern(s)</button>
        <input class='goBack' value='Back' type='button'>
        `);
    });
  }
  function previousPage(){
    $('.container').on('click','.goBack', function(){
      console.log('go back clicked')
      location.reload();
      // window.history.back();
    });
  }
  $(previousPage);

// function backToMainPage() {
//   $('#createdProfile').click(function(e){
//     e.preventDefault();
//     $(renderMainPage());
//   });
// }
function showNav(){
  $('#nav').show();
  $(suggestionTab);
  $('#creationBtn').show();
  $(createPost);
  $(myPosts);
  $(generalQuestions);
  // $(editPost);
}

$(profileCreation);
$(reportIssue);

// function loginToMainPage(){
// $('#entrySubmit').click(function(e){
//   console.log("***Entry submit  clicked");
//   e.preventDefault();
//   renderMainPage();
//   showNav();
//   fetchAllPosts();
// });
// }
// $(loginToMainPage);

function generalQuestions(){
  $('#generalQuestions').click(function(e){
    console.log('*general tab clicked*');
    e.preventDefault();
    renderMainPage();
    fetchAllPosts();
  });
}
function generalIcon(){
  $('#generalQuestions2').click(function(e){
    console.log('Menu Icon clicked!');
    e.preventDefault();
    renderMainPage();
    fetchAllPosts();
  });
}
$(generalIcon);
function createPost(){
  $('.container').on('click', '#postCreation', function(e){
    e.preventDefault();
    console.log('post testing worked');
    $('#postbox').toggle(``);
  });
}
function editPost(callId){
  // $('#container-main').on('click', '.editPost', function(e){
  //   e.preventDefault();
  //   console.log('The edit post opened');
  //   $('#postEditBox').toggle(``);
  // })
  $('#container-main').submit('#editSubmit', function(e){
    e.preventDefault();
    console.log(callId);
    let editedData = {};
    editedData.id = callId;
    // data.parentName = document.getElementById('whoAndWhere'); //todo add parent name to form
    // data.zipcode = document.getElementById('zip'); //todo add zipcode to form
    editedData.parentName = 'Nobody';
    editedData.zipcode = 55555;
    editedData.content = document.getElementById('editInfoData').value;
    // const edContent = editedData.content;
    editedData.childAge = document.getElementById('editContentInfo').value;
    // const edChildAge = editedData.childAge;
    editedData.foundAnswer = document.getElementById('editAnswer').value;
    // const edFoundAnswer = editedData.foundAnswer;
    editedData.date = document.getElementById('editKnowWhen').value;
    // const edDate = editedData.date;

    editedData.title =  document.getElementById('editQuestionTitle').value;
    // editedData.question = {
    //     content: editedData.content,
    //     childAge: editedData.childAge,
    //     foundAnswer: editedData.foundAnswer,
    //     date: editedData.date
    // };
    updatePost(editedData);
  });
}
// function refreshTheData(){
//   $('#nav').on('click', "#refresh", function(e){
//     e.preventDefault();
//     console.log("refresh button clicked");
//     document.location.reload(true);
//     renderMainPage();
//   });
// }
// $(refreshTheData);


// $(postUp);


//   MVP
// -Create User Posts - kinda
// -Create User profile - need polish
// -Create the account creation - need to set connection
// After MVP
// -Create download kids pics
// -Create Error message
// -Create Sign up board
// -Create report users' behavior

// ===============================================================================
//
