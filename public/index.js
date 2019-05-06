// function testpage() {
//   $(body).click(
//     console.log('it works...')
//   );
// }
//
// testpage();

// const practiceData = {
//   "postData": [
//     {
//       "id": "01",
//       "question": "Why the sky is blue?",
//       "childAge": 4,
//       "parentName": "Tom Smith",
//       "Date": "01/02/18"
//     },
//     {
//       "id": "02",
//       "question": "Why is grass green?",
//       "childAge": 3,
//       "parentName": "Nick Reed",
//       "Date": "01/10/18"
//     },
//     {
//       "id": "03",
//       "question": "How car go fast?",
//       "childAge": 5,
//       "parentName": "Ryan Cooper",
//       "Date": "01/15/18"
//     },
//     {
//       "id": "04",
//       "question": "Why dog is big?",
//       "childAge": 6,
//       "parentName": "Sarah Batahi",
//       "Date": "01/30/18"
//     }
//   ]
// };
// function postInfo(callbackFn) {
//   setTimeout(function(){callbackFn(practiceData)}, 100);
// }
// function displayPostInfo(data) {
//   for(index in data.postData){
//     $('.container').append(
//       '<p>' + data.postData[index].question + '</p>');
//   }
// }
// function enactDisplayPostInfo() {
//   postInfo(displayPostInfo);
// }
// $(function(){
//   enactDisplayPostInfo();
// })

// $(enactDisplayPostInfo());

// // ==================This section is for post/comment/profile==================
// function test() {
//   $('#entryLogin').submit(
//     console.log('it worked')
//   );
// }
// $(test());

function enterMainPage() {
  $('#entrySubmit').click(function(e){
    e.preventDefault();
    $('.container').html(
      `<nav>
        <ul id='nav'>
          <li class='navBox'>General Questions</li>
          <li class='navBox'>Daughter Questions</li>
          <li class='navBox'>Son Questions</li>
          <li class='navBox'>3-6 years old kids' Questions</li>
          <li class='navBox'>6-10 years old kids' Questions</li>
          <li class='navBox'>FAQs</li>
          <li class='navBox'>Suggestions</li>
        </ul>
       </nav>
       <section id='secondaryContainer'>
       <h3>Your Sharing Center</h3>
        <ul id='usersPosts'>
          <li class='eachPost'>
            <p>Post:</p>
            <p>By:</p>
            <div class='post-user'>
            </div>
            Put your comment below here:
            <br>
            <input type='textarea'>
          </li>
          <li class='eachPost'>
            <p>Post:</p>
            <p>By:</p>
            <div class='post-user'>
            </div>
            Put your comment below here:
            <br>
            <input type='textarea'>
          </li>
          <li class='eachPost'>
            <p>Post:</p>
            <p>By:</p>
            <div class='post-user'>
            </div>
            Put your comment below here:
            <br>
            <input type='textarea'>
          </li>
          <li class='eachPost'>
            <p>Post:</p>
            <p>By:</p>
            <div class='post-user'>
            </div>
            Put your comment below here:
            <br>
            <input type='textarea'>
          </li>
          <li class='eachPost'>
            <p>Post:</p>
            <p>By:</p>
            <div class='post-user'>
            </div>
            Put your comment below here:
            <br>
            <input type='textarea'>
          </li>
        </ul>
       </section>
       `
     );
  });
    console.log('entered the main page successful');
    // $(reportIssue());
  }

// ${body.questionboard.title[0]}




  //  <p>${Date}</p> for up above here.
// //<section>
//  <img src='${pic[0]}'>
//  <img src='${pic[1]}'>
//  <img src='${pic[2]}'>
//  <img src='${pic[3]}'>
//  <img src='${pic[4]}'>
//  <img src='${pic[5]}'>
// </section>
// <p> ${data.post[index].question} </p>
  $(enterMainPage());

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
  $(profileCreation());

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
        `);
    });
  }
$(reportIssue());

function backToMainPage() {
  $('#createdProfile').click(function(e){
    e.preventDefault();
    $(enterMainPage());
  });
}

function selectTopic() {
  $('.navbox').click(function(e) {
    e.preventDefault();
    $('.container').html(
      `<h3>${this.title}</h3>
      <ul>Most recent posts:
        <li>${this.data[0]}</li>
        <li>${this.data[1]}</li>
        <li>${this.data[2]}</li>
        <li>${this.data[3]}</li>
        <li>${this.data[4]}</li>
        <li>${this.data[5]}</li>
        <li>${this.data[6]}</li>
      </ul>`
    )
  })
}

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
