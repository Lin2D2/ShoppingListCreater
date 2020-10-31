const { PDFDocument, StandardFonts, rgb } = PDFLib
    const tableRow = `<tr>
          <td><select name="anzahl">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value=">">&rarr</option>
          </select></td>
          <td><input type="text"></td>
          <td><input type="text"></td>
        </tr>`
    function append_row() {
      let tableBody = document.getElementById("tbody");
      let newRow = document.createElement('tr');
      newRow.innerHTML = tableRow;
      tableBody.appendChild(newRow);
    }

    async function createPdf() {
      // Create a new PDFDocument
      const pdfDoc = await PDFDocument.create()

      // Embed the Times Roman font
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

      // Add a blank page to the document
      const page = pdfDoc.addPage()

      // Get the width and height of the page
      const { width, height } = page.getSize()

      // Draw a string of text toward the top of the page
      const fontSize = 30
      page.drawText('Creating PDFs in JavaScript is awesome!', {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      })

      // Serialize the PDFDocument to bytes (a Uint8Array)
      return await pdfDoc.save();
    };

    async function downloadPDF() {
      const pdfBytes = await createPdf();

      // Trigger the browser to download the PDF document
      download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");
    };

    async function printPDF() {
      const pdfBytes = await createPdf();

      // Trigger the browser to download the PDF document
      print(pdfBytes);
    };
    function init(){
        document.getElementById('downloadButton').onclick = downloadPDF;
        document.getElementById('printButton').onclick = printPDF;
    }
    window.onload = init;