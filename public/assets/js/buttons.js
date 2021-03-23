// /* eslint-disable camelcase */
// // CREATE
// const createUserBtn = document.getElementById("create-form");

// if (createUserBtn) {
//   createUserBtn.addEventListener("submit", e => {
//     e.preventDefault();

//     const newUser = {
//       name: document.getElementById("dogName").value.trim(),
//       breed: document.getElementById("breed").value.trim(),
//       fav_activity: document.getElementById("fav_activity").value.trim(),
//       outgoing: document.getElementById("outgoing").checked
//     };

//     fetch("/api/adddog", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json"
//       }
//     }).then(() => {
//       // Empty the form
//       document.getElementById("ca").value = "";
//       document.getElementById("dogName").value = "";
//       document.getElementById("breed").value = "";
//       document.getElementById("fav_activity").value = "";

//       // Reload the page so the user can see the new quote
//       console.log("New Profile Created");
//       location.reload();
//     });
//   });
// }
