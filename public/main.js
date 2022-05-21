const inputField = document.querySelector("#imageInput");
const dropZoneContainer = document.querySelector(".drop_zone");

const uploadFile = async (file) => {
  const imgContainer = document.querySelector(".image");
  const loader = document.querySelector(".loader");
  const form = new FormData();
  form.append("file", file);
  try {
    loader.classList.add("loader--active");
    const res = await fetch("/upload", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    loader.classList.remove("loader--active");
    const filePath = data.data.uploadedFileurl;
    imgContainer.src = filePath;
  } catch (error) {
    console.log(error);
    alert("Something Went Wrong");
  }
};

inputField.addEventListener("change", async (e) => {
  await uploadFile(e.target.files[0]);
  if (!dropZoneContainer.className.includes("drop_zone--active")) {
    dropZoneContainer.classList.add("drop_zone--active");
  }
});

const dropZoneImage = (dropZoneContainer, inputField) => {
  dropZoneContainer.addEventListener("click", (e) => {
    inputField.click();
  });

  dropZoneContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneContainer.classList.add("drop_zone--highlight");
  });

  ["dragend", "dragleave"].forEach((type) => {
    dropZoneContainer.addEventListener(type, (e) =>
      dropZoneContainer.classList.remove("drop_zone--highlight")
    );
  });

  dropZoneContainer.addEventListener("drop", async (e) => {
    e.preventDefault();
    await uploadFile(e.dataTransfer.files[0]);
    dropZoneContainer.classList.remove("drop_zone--highlight");
    if (!dropZoneContainer.className.includes("drop_zone--active")) {
      dropZoneContainer.classList.add("drop_zone--active");
    }
  });
};

dropZoneImage(dropZoneContainer, inputField);
