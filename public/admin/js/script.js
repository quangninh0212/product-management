// Button status
const buttonsStatus = document.querySelectorAll("button[button-status]");

if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonsStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      }
      else {
        url.searchParams.delete("status");
      }

      url.searchParams.set("page", 1);
      window.location.href = url.href;
    })
  })
}
// End Button status

// Form Search
const formSearch = document.querySelector("form#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = event.target.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    }
    else {
      url.searchParams.delete("keyword");
    }

    url.searchParams.set("page", 1);
    window.location.href = url.href;
  })
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    })
  })
}
// End Pagination

// Checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
  
  inputCheckAll.addEventListener("click", () => {
    if(inputCheckAll.checked) {
      inputsId.forEach(input => {
        input.checked = true;
      });
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      }); 
    }
  })

  inputsId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if(countChecked === inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    })
  })
}
// End checkbox multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
  formChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = event.target.type.value;

    // Tạo 1 đường dẫn gốc KHÔNG ĐỔI
    const basePath = formChangeMulti.getAttribute("action").split("?_method=")[0] + "?_method=";

    if(typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?");
      if(!isConfirm) {
        return;
      }
    }
    if(typeChange == "delete-permanently") {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa vĩnh viễn các sản phẩm đã chọn không?");
      if(!isConfirm) {
        return;
      }
    }
    if(typeChange == "restore") {
      const isConfirm = confirm("Bạn có chắc chắn muốn khôi phục các sản phẩm đã chọn không?");
      if(!isConfirm) {
        return;
      }
    }

    if(inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach(input => {
        const id = input.value;
        
        if(typeChange === "change-position") {
          // const trInputChecked = input.parentNode.parentNode;
          const position = input
            .closest("tr")
            .querySelector("input[name='position']")
            .value;
          ids.push(`${id}-${position}`);
        } else {
          if(typeChange == "delete-permanently") {
            formChangeMulti.action = basePath + "DELETE";
          }
          else if(typeChange == "restore") {
            formChangeMulti.action = basePath + "PATCH"; 
          }
          ids.push(id);
        }
      })

      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một sản phẩm");
    }
  })
}
// End Form change multi

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  })
}
// End Show Alert

// Preview Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  const buttonCloseUploadImage = uploadImage.querySelector("[button-close-upload-image]");

  uploadImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      buttonCloseUploadImage.classList.toggle("d-none");
    }
  });

  buttonCloseUploadImage.addEventListener("click", () => {
    uploadImagePreview.src = "";
    uploadImageInput.value = "";
    buttonCloseUploadImage.classList.add("d-none");
  });
}
// End Preview Image