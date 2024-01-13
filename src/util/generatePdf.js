import jsPDF from "jspdf";
import "jspdf-autotable";

// define function
export const generatePdf = (data,date) => {
  // data && console.log(data.map(doc => doc.foodData))

  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = ["No", "Name", "Morning", "Noon", "Night"];
  // define an empty array of rows
  const tableRows = [];

  let count = 0;

  data.forEach((doc) => {
    const foodData = [
      (count = count + 1),
      doc.name,
      doc.foodData.morning ? "✅" : "❌",
      doc.foodData.noon ? "✅" : "❌",
      doc.foodData.night ? "✅" : "❌"
    ];
    tableRows.push(foodData);
  });

  //console.log(tableRows)


  doc.autoTable(tableColumn, tableRows, { startY: 20 });

  doc.text("Food Details", 14, 15);

  doc.save(`${date}.pdf`);
};
