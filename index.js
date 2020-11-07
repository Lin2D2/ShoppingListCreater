const { PDFDocument, StandardFonts, rgb } = PDFLib
    const tableRow = `<tr>
    <td>
      <div class="row">
        <input type="text" placeholder="0">
        <select name="unit">
          <option value="st.">st.</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="l">l</option>
          <option value="not listed">not listed</option>
        </select>
      </div>
    </td>
    <td><input type="text"></td>
    <td><input type="text"></td>
    <td><select name="place">
            <option value="beginn">vorne rechts</option>
            <option value="beginn">mitte rechts</option>
            <option value="beginn">hinten rechts</option>
            <option value="beginn">hinten mitte</option>
            <option value="beginn">mitte</option>
            <option value="beginn">vorne mitte</option>
            <option value="beginn">vorne links</option>
            <option value="beginn">mitte links</option>
            <option value="beginn">hinten links</option>
          </select></td>
  </tr>`
    function append_row() {
      let tableBody = document.getElementById("tbody");
      let newRow = document.createElement('tr');
      newRow.innerHTML = tableRow;
      tableBody.appendChild(newRow);
    }

    async function createPdf() {
      const pdfDoc = await PDFDocument.create()
      let page = pdfDoc.addPage()
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const { width, height } = page.getSize()
      const fontSize = 10

      const title = 'Einkaufsliste';
      page.drawText(title, {
        x: width/2 - title.length*5,
        y: height - 1.5 * 30,
        size: 30,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      const tableChildren = document.getElementById("table").children.tbody.children
      let items = [];
      for (let child in tableChildren) {
        if (tableChildren[child].children != null) {
          let nummberValue = tableChildren[child].children[0].children[0].children[0].value;
          if (nummberValue == "") {
            nummberValue = "0";
          }
          let select = tableChildren[child].children[0].children[0].children[1];
          let selectValue = select.options[select.selectedIndex].attributes[0].value;
          let typeValue = tableChildren[child].children[1].children[0].value;
          let descriptionValue = tableChildren[child].children[2].children[0].value;
          items.push([nummberValue+" "+selectValue, typeValue, descriptionValue]);
        }
      }
      let hightCounter = 790
      for (let item in items) {
        page.drawText(items[item][0], {
          x: width/3  - 160,
          y: hightCounter-30,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        // page.drawRectangle({
        //   x: width/3  - 160,
        //   y: hightCounter-35,
        //   height: fontSize*2,
        //   width: 48,
        //   borderColor: rgb(0,0,0),
        //   borderWidth: 1,
        // })
        page.drawText(items[item][1], {
          x: width/3*2  - 310,
          y: hightCounter-30,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        // page.drawRectangle({
        //   x: width/3*2  - 310,
        //   y: hightCounter-35,
        //   height: fontSize*2,
        //   width: 178,
        //   borderColor: rgb(0,0,0),
        //   borderWidth: 1,
        // })
        page.drawText(items[item][2], {
          x: width/3*3 - 320,
          y: hightCounter-30,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        })
        // page.drawRectangle({
        //   x: width/3*3  - 330,
        //   y: hightCounter-35,
        //   height: fontSize*2,
        //   width: 290,
        //   borderColor: rgb(0,0,0),
        //   borderWidth: 1,
        // })
        page.drawLine({
          start: {
            x: width/3  - 170,
            y: hightCounter-35,},
          end: {
            x: width/3*3  - 330+290,
            y: hightCounter-35,
          }
        })
        hightCounter-=20;
        if (hightCounter < 60) {

          hightCounter = 820
          page = pdfDoc.addPage()
        }
      }

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();
      updatePDF(pdfBytes);
      return pdfBytes;
    };

    async function downloadPDF() {
      const pdfBytes = await createPdf();
      // Trigger the browser to download the PDF document
      download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");
    };

    async function init() {
        document.getElementById('downloadButton').onclick = downloadPDF;
        updatePDF(await createPdf());
    }

    function updatePDF(pdfBytes) {
        let link = window.URL.createObjectURL(new Blob([pdfBytes], {type: "application/pdf"}));
        PDFObject.embed(link, "#pdfObjectViewer");
    }
    window.onload = init;