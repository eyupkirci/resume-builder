//FUNCTIONS

function hideButtons() {
  const actionButtons = document.querySelectorAll(".section-buttons");
  const addSectionDiv = document.querySelector("#addSectionDiv");
  actionButtons.forEach((button) => {
    button.style.display = "none";
  });
  addSectionDiv.style.display = "none";
}

function showButtons() {
  const actionButtons = document.querySelectorAll(".section-buttons");
  const addSectionDiv = document.querySelector("#addSectionDiv");
  // Show delete and clear buttons again
  actionButtons.forEach((button) => {
    button.style.display = "inline-block";
  });
  addSectionDiv.style.display = "block";
}

function addSection() {
  const select = document.getElementById("sectionSelect");
  const selectedOption = select.options[select.selectedIndex].value;

  if (selectedOption === "Custom") {
    addCustomSection();
  } else {
    const resumeSection = document.getElementById("new-section");
    const newSection = document.createElement("div");
    newSection.innerHTML = `<div class="section" contenteditable="true">
        <h2>${selectedOption}</h2>
        <p>Your ${selectedOption.toLowerCase()} go here...</p>
        <div class="section-buttons" contenteditable="false">
          <button class="delete-button" onclick="deleteSection(this)">Delete</button>
          <button class="clear-button" onclick="clearContent(this)">Clear</button>
        </div>
      </div>`;
    resumeSection.appendChild(newSection);
  }
}

function addCustomSection() {
  const customTitle = prompt("Enter custom title:");
  if (customTitle) {
    const resumeSection = document.getElementById("new-section");
    const newSection = document.createElement("div");
    newSection.innerHTML = `<div class="section" contenteditable="true">
        <h2>${customTitle}</h2>
        <p>Your ${customTitle.toLowerCase()} go here...</p>
        <div class="section-buttons" contenteditable="false">
          <button class="delete-button" onclick="deleteSection(this)">Delete</button>
          <button class="clear-button" onclick="clearContent(this)">Clear</button>
        </div>
      </div>`;
    resumeSection.appendChild(newSection);
  }
}

async function downloadPDF() {
  // Hide delete and clear buttons for PDF generation
  hideButtons();
  // Load jsPDF module
  const { jsPDF } = window.jspdf;

  // Get the content of the resume
  const content = document.getElementById("resume");

  // Use html2canvas to convert the content to a canvas
  const canvas = await html2canvas(content);

  // Create an image from the canvas
  const imgData = canvas.toDataURL("image/png");

  // Create a new jsPDF instance
  const pdf = new jsPDF("p", "mm", "a4");

  // Define margins (1cm)
  const margin = 0; // 10mm = 1cm

  // Get page dimensions
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pdfWidth - 2 * margin;
  const contentHeight = pdfHeight - 2 * margin;

  // Calculate image dimensions to fit the page
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = contentWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  // Define the height limit for each page
  const pageHeight = contentHeight;
  let heightLeft = imgHeight;

  let position = margin;

  // Add the image to the PDF and handle pagination
  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Check if the PDF is more than one page
  if (pdf.internal.pages.length > 1) {
    const confirmed = confirm("The PDF has more than one page. Do you want to continue?");
    if (!confirmed) {
      // Show delete and clear buttons again
      showButtons();
      return; // Cancel PDF download
    }
  }
  showButtons();
  // Save the PDF
  pdf.save("resume.pdf");
}

function clearContent(button) {
  const section = button.parentNode;
  const paragraphs = section.querySelectorAll("p");
  paragraphs.forEach((paragraph) => {
    paragraph.textContent = "Your content goes here...";
  });
}

function deleteSection(button) {
  const section = button.parentNode.parentNode;
  if (section.id !== "titleSection") {
    section.remove();
    // section.style.display = "none";
  }
}

function reset() {
  window.location.reload();
  // const sections = document.querySelectorAll(".section");
  // sections.forEach((section) => {
  //   section.style.display = "block";
  //   const paragraphs = section.querySelectorAll("p");
  //   paragraphs.forEach((paragraph) => {
  //     paragraph.textContent = "Your content goes here...";
  //   });
  // });
}
