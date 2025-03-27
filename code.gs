var spreadsheet = SpreadsheetApp.openById(
  "1xOGVjAcjsLEsOx_BoPouUyJzHsIeUdfY0Uj98eHaC2o"
);

var sheet_uniqeDeviceId = spreadsheet.getSheetByName("uniqeDeviceId");


var sheet_clientsData = spreadsheet.getSheetByName("clientsData");

function getPageContent(page) {
  return HtmlService.createHtmlOutputFromFile(page).getContent();
}

function doGet(e) {
  return HtmlService.createTemplateFromFile("interface")
    .evaluate()
    .setTitle("Williams Sales");
}

function searchUniqueDeviceId(uniqueDeviceId) {
  var sheet = sheet_uniqeDeviceId;

  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][getColumnIndex(sheet, "uniqueDeviceId")] === uniqueDeviceId) {
      return "found";
    }
  }

  return "not found";
}

function lolo() {
  Logger.log(searchUniqueDeviceId("1t0zq2G0xa7k0gBxeEQy"));
}

function toto() {
  Logger.log(getColumnIndex(sheet_uniqeDeviceId, "uniqueDeviceId"));
}

function getColumnIndex(vrSheet, columnName) {
  var headers = vrSheet
    .getRange(1, 1, 1, vrSheet.getLastColumn())
    .getValues()[0];

  return headers.indexOf(columnName);
}

function searchClients(value, field) {
  var sheet = sheet_clientsData;
  sheet_clientsData;
  var data = sheet.getDataRange().getValues();
  var clients = [];

  for (var i = 1; i < data.length; i++) {
    if (
      data[i][getColumnIndex(sheet_clientsData, field)]
        .toString()
        .toLowerCase()
        .indexOf(value.toLowerCase()) !== -1
    ) {
      clients.push({
        clientId: data[i][0],
        taxNumber: data[i][1],
        clientName: data[i][2],
        buildingNumber: data[i][3],
        street: data[i][4],
        district: data[i][5],
        governorate: data[i][6],
        country: data[i][7],
        taxDiscount: data[i][8],
      });
    }
  }

  return clients;
}

function submitClient(data) {
  var sheet = sheet_clientsData;

  var clientId;
  if (data.clientId) {
    clientId = data.clientId;
    // Update existing client
    var range = sheet.getRange(
      2,
      1,
      sheet.getLastRow() - 1,
      sheet.getLastColumn()
    );
    var values = range.getValues();

    for (var i = 0; i < values.length; i++) {
      if (values[i][0] == data.clientId) {
        values[i][1] = data.taxNumber;
        values[i][2] = data.clientName;
        values[i][3] = data.buildingNumber;
        values[i][4] = data.street;
        values[i][5] = data.district;
        values[i][6] = data.governorate;
        values[i][7] = data.country;
        values[i][8] = data.taxDiscount;
        range.setValues(values);
        break;
      }
    }
  } else {
    // Add new client
    clientId = new Date().getTime();
    var row = [
      clientId,
      data.taxNumber,
      data.clientName,
      data.buildingNumber,
      data.street,
      data.district,
      data.governorate,
      data.country,
      data.taxDiscount,
    ];
    sheet.appendRow(row);
  }
  return clientId;
}

function deleteClient(clientID) {
  var sheet = sheet_clientsData;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == clientID) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function openClientFolder(clientId) {
  // استبدل taxNumber بـ clientId
  var folderName = "Client_" + clientId;
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    var folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }
  var url = folder.getUrl();
  return url;
}


//God is love88888888888888888888