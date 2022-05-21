const container = document.querySelector(".container");

const createImageCard = (imgLink) => {
  const div = document.createElement("div");
  const image = document.createElement("img");
  const button = document.createElement("button");
  const a = document.createElement("a");

  div.classList.add("imageCard");
  button.classList.add("btn");
  a.classList.add("imageCard_para");
  image.classList.add("imageCard_image");

  button.innerText = "Copy To Clipboard";
  button.onclick = () => {
    navigator.clipboard.writeText(imgLink);
    button.style.marginBottom = "10px";
    button.style.marginBottom = "0px";
  };
  a.innerText = imgLink;
  a.href = imgLink;
  image.src = imgLink;
  image.alt = "Uploaded Image";
  div.append(image);
  div.append(a);
  div.append(button);

  return div;
};

const getAllImages = async () => {
  try {
    const res = await fetch("/upload");
    const files = (await res.json()).data.files;
    files.forEach((filePath) => {
      container.append(createImageCard(filePath));
    });
    const backBtn = document.createElement("a");
    backBtn.classList.add("btn");
    backBtn.href = "/";
    backBtn.innerText = "Go Back";
    container.append(backBtn);
  } catch (error) {
    console.log(error);
    alert("Somthing Went Wrong!!!");
  }
};

getAllImages();
