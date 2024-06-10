function generatePassword() {
  let range = document.getElementById("pass-length");
  let generate = document.getElementById("generate");
  let copy = document.getElementById("copy");
  let passwordInput = document.getElementById("password");
  let modal = document.getElementById("meaning-modal");
  let modalContent = document.getElementById("modal-content");
  let closeModal = document.getElementById("close-modal");
  let modalMeaning = document.getElementById("modal-meaning");
  let passLenDisplay = document.querySelector(".display-len");
  let reset = document.getElementById("reset-form");

  function resetForm() {
    document.getElementById("form").reset();
    passLenDisplay.textContent = 6;
    passwordInput.value = '';
    modal.style.display = 'none';
  }

  range.addEventListener("change", (e) => {
    passLenDisplay.textContent = e.target.value;
  });

  generate.addEventListener("click", async () => {
    let word = passwordInput.value;
    let length = range.value;
    if (word) {
      try {

        let url = 'http://localhost:3000/means/'+ word + '/' + length;

        let response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          let data = await response.json();
          console.log(data);
          // Assuming the response contains { line: "...", meaning: "..." }
          passwordInput.value = data.line;
          modalMeaning.textContent = data.meaning;
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert("Please enter a word.");
    }
  });

  copy.addEventListener("mouseover", () => {
    if (modalMeaning.textContent) {
      modal.style.display = 'block';
    }
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = 'none';
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

  reset.addEventListener("click", () => resetForm());
}

generatePassword();