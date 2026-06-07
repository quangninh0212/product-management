// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = `${path}/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    })
  })
}
// End change status

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
      if(isComfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    })
  })
}
// End delete item

// Delete Permanent Item
const buttonsDeletePermanent = document.querySelectorAll("[button-delete-permanent]");
if(buttonsDeletePermanent.length > 0) {
  const formDeletePermanentItem = document.querySelector("#form-delete-permanent-item");
  const path = formDeletePermanentItem.getAttribute("data-path");

  buttonsDeletePermanent.forEach(button => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này không?");
      if(isComfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeletePermanentItem.action = action;
        formDeletePermanentItem.submit();
      }
    })
  })
}
// End delete permanent item

// Restore Item
const buttonsRestore = document.querySelectorAll("[button-restore]");
if(buttonsRestore.length > 0) {
  const formRestoreItem = document.querySelector("#form-restore-item");
  const path = formRestoreItem.getAttribute("data-path");

  buttonsRestore.forEach(button => {
    button.addEventListener("click", () => {
      const isComfirm = confirm("Bạn có chắc chắn muốn khôi phục sản phẩm này không?");
      if(isComfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=PATCH`;
        formRestoreItem.action = action;
        formRestoreItem.submit();
      }
    })
  })
}
// End restore item