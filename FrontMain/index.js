'use strict'


// Another test -

const posts_centerURL = 'http://localhost:4747/questionPost'

function fetchAllPosts() {
  const postsData = {
    url: posts_centerURL,
    dataType: 'json',
    type: 'GET',
    success: renderPosts
  };
  console.log(postsData);
  //$.ajax(postsData);
  //getDataReal(postData)
  $.ajax(postsData);
}

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
          <p>Posted by: ${dataPost.date}</p>
          Put your comment below here:
          <br>
          <input type='textarea' id='comment_${dataPost.id}'>
          <input type='hidden' value='${dataPost.id}'>
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
              <p id='knowWhen'>date: </p>
              <br>
              <input id="editSubmit" type='submit' value='Submit the edit(s)'></input>
            </fieldset>
          </form>
          </div>
          <button>Delete this Post</button>
        </li>`);
    },
    datatype: 'json',
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
  console.log(changePost);
  console.log('updating post` ' + changePost + ' `');
  $.ajax({
    url: posts_centerURL + '/' + changePost,
    method: 'PUT',
    data: {id: changePost},
    success: function(changePost) {
      console.log('Successful opened - ' + changePost);
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
      <p>Posted by: ${obj.question.date}</p>
      <div class='post-user'>
      </div>
      Put your comment below here:
      <br>
      <input type='textarea' id='comment_${obj.id}'>
      <input type='hidden' value='${obj.id}'>
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
      updatePost(obj.id);
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

function renderMainPage(){
  console.log("Render page called!");
  // const currentDate = new Date();
  // const month = currentDate.getMonth() + 1;
  // const day = currentDate.getDate();
  // const year = currentDate.getFullYear();
  //
  // const newCurrentDate = month + "/" + day + "/" + year;

  $('#container-main').html(`

  <img id='postCreation' src='http://cdn.onlinewebfonts.com/svg/img_504212.png'>
  <p id='buttonSign'>Open/Close</p>
  <br>
  <div id='postbox'>
    <h2>Post Question</h2>
    <form id="singlePost">
      <fieldset id='postDesign'>
      <legend>Fill those boxes out</legend>
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
      <input type="reset" value="Clear Out">
      <input id="postSubmit" type='submit' value='Submit the post'></input>
      </fieldset>
    </form>
  </div>
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
     Put your comment below here:
     <br>
     <input type='textarea'>
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
  $('#postSubmit').click(function(e){
    e.preventDefault();
    let data = {};
    data.parentName = document.getElementById('whoAndWhere'); //todo add parent name to form
    data.zipcode = document.getElementById('zip'); //todo add zipcode to form
    data.title =  document.getElementById('questionTitle').value;
    data.content = document.getElementById('infoData').value;
    data.childAge = document.getElementById('contentInfo').value;
    data.foundAnswer = document.getElementById('answer').value;
    data.date = document.getElementById('knowWhen').value;
    addPost(data);
  });
}

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
  $('.container').on('click', '#suggestion', function(e){
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
        <button id='suggestionButton'>Submit your suggestion</button>
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
  $('#suggestionButton').click(function(e){
    e.preventDefault();
    alert('Your suggestion was submitted! Congratulation and thank you for your time!');
    console.log(email + ': ' + suggestion);
  })
// console.log(email + ': ' + suggestion);
}
$(getSuggestion);

function myPosts(){
  $('.container').on('click', '#myPosts', function(e){
        console.log('*my Posts clicked*');
        e.preventDefault();
        renderMainPage();
        fetchAllPosts();
  });
}

  function profileCreation() {
    $('#signUp').click(function(e) {
      e.preventDefault();
      $('.container').html(
        `<form>
          <fieldset id='profileContainer'>
            <legend>Profile Builder</legend>
            First Name: <input class='profiletext' type='text' placeholder='Required Input'>
            <br>
            Last Name: <input class='profiletext' type='text' placeholder='Required Input'>
            <br>
            Email: <input class='profiletext' type='text' placeholder='Required Input'>
            <br>
            Date of Birth: <input class='profiletext' type='text' placeholder='Required Input'>
            <br>
            Username: <input class='profiletext' type='text' placeholder='Required Input'>
            <br>
            Password: <input class='profiletext' type='text' placeholder='Required Input'>
            <br>
            <input id='createdProfile' type='button' value='Finalize the profile'>
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
        `);
    });
  }

function backToMainPage() {
  $('#createdProfile').click(function(e){
    e.preventDefault();
    $(renderMainPage());
  });
}
function showNav(){
  $('#nav').show();
  $(suggestionTab);
  $(createPost);
  $(myPosts);
  $(generalQuestions);
  $(editPost);
}

$(profileCreation);
$(reportIssue);

$('#entrySubmit').click(function(e){
  console.log("***Entry submit  clicked");
  e.preventDefault();
  renderMainPage();
  showNav();
  fetchAllPosts();
});

function generalQuestions(){
  $('#generalQuestions').click(function(e){
    console.log('*general tab clicked*');
    e.preventDefault();
    renderMainPage();
    fetchAllPosts();
  });
}
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
    // editedData.content = document.getElementById('editInfoData').value;
    // const edContent = editedData.content;
    // editedData.childAge = document.getElementById('editContentInfo').value;
    // const edChildAge = editedData.childAge;
    // editedData.foundAnswer = document.getElementById('editAnswer').value;
    // const edFoundAnswer = editedData.foundAnswer;
    // editedData.date = document.getElementById('editKnowWhen').value;
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
