/**
 * SQUAD 1 DASHBOARD API
 * Sayfa4!AB = Squad 1 filtresi ve Sayfa3!A:L dashboard verisi.
 */
function doGet(e) {
  try {
    const SQUAD_SHEET_NAME = "Sayfa4";
    const DASHBOARD_SHEET_NAME = "Sayfa3";
    const TARGET_SQUAD = "squad 1";

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) return createJsonResponse({ error: "Google Sheets dosyasına ulaşılamadı." });

    const squadSheet = spreadsheet.getSheetByName(SQUAD_SHEET_NAME);
    const dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET_NAME);
    if (!squadSheet) return createJsonResponse({ error: "Squad sekmesi bulunamadı: " + SQUAD_SHEET_NAME });
    if (!dashboardSheet) return createJsonResponse({ error: "Dashboard sekmesi bulunamadı: " + DASHBOARD_SHEET_NAME });

    const squad1CustomerIds = getSquad1CustomerIds(squadSheet, TARGET_SQUAD);
    const dashboardData = getDashboardData(dashboardSheet, squad1CustomerIds);
    dashboardData.sort(function(a, b) {
      return String(a.musteriNo).localeCompare(String(b.musteriNo), "tr", { numeric: true, sensitivity: "base" });
    });
    return createJsonResponse(dashboardData);
  } catch (error) {
    return createJsonResponse({ error: error && error.message ? error.message : String(error) });
  }
}

function getSquad1CustomerIds(sheet, targetSquad) {
  const customerIds = new Set();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return customerIds;
  const rows = sheet.getRange(2, 1, lastRow - 1, 28).getDisplayValues();
  for (let i = 0; i < rows.length; i++) {
    const customerNo = normalizeCustomerNo(rows[i][0]);
    const squadName = normalizeText(rows[i][27]);
    if (customerNo !== "" && squadName === targetSquad) customerIds.add(customerNo);
  }
  return customerIds;
}

function getDashboardData(sheet, squad1CustomerIds) {
  const jsonData = [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonData;
  const rows = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const customerNo = normalizeCustomerNo(row[0]);
    if (customerNo === "" || !squad1CustomerIds.has(customerNo)) continue;
    jsonData.push({
      musteriNo: customerNo,
      musteriAdi: safeText(row[1]),
      unvan: safeText(row[2]),
      catiLimit: toNumber(row[3]),
      kullanilanLimit: toNumber(row[4]),
      kullanilmayanLimit: toNumber(row[5]),
      aylikOdeme: toNumber(row[6]),
      anlikLimit: toNumber(row[7]),
      aySonuLimit: toNumber(row[8]),
      statu: safeText(row[9]),
      yeniVeri1: safeText(row[10]),
      yeniVeri2: normalizeScore(row[11]),
      squad: "Squad 1"
    });
  }
  return jsonData;
}

function normalizeText(value) {
  return String(value == null ? "" : value).trim().toLocaleLowerCase("tr-TR").replace(/\s+/g, " ");
}

function normalizeCustomerNo(value) {
  if (value == null || value === "") return "";
  let text = String(value).trim().replace(",", ".");
  if (/^\d+\.0+$/.test(text)) text = text.split(".")[0];
  return text;
}

function safeText(value) {
  return value == null ? "" : String(value).trim();
}

function toNumber(value) {
  let numberValue;
  if (typeof value === "number") {
    numberValue = value;
  } else {
    if (value == null || value === "") return 0;
    let text = String(value).trim().replace(/\s/g, "").replace(/[₺$€£]/g, "").replace(/[^0-9,.\-]/g, "");
    if (text === "" || text === "-") return 0;
    const lastComma = text.lastIndexOf(",");
    const lastDot = text.lastIndexOf(".");
    if (lastComma !== -1 && lastDot !== -1) {
      text = lastComma > lastDot ? text.replace(/\./g, "").replace(",", ".") : text.replace(/,/g, "");
    } else if (lastComma !== -1) {
      const decimalLength = text.length - lastComma - 1;
      text = decimalLength === 1 || decimalLength === 2 ? text.replace(",", ".") : text.replace(/,/g, "");
    } else if (lastDot !== -1) {
      const parts = text.split(".");
      if (parts.length > 2) {
        const decimalPart = parts.pop();
        text = parts.join("") + "." + decimalPart;
      } else if (text.length - lastDot - 1 === 3 && /^-?\d{1,3}\.\d{3}$/.test(text)) {
        text = text.replace(".", "");
      }
    }
    numberValue = Number(text);
  }
  if (!isFinite(numberValue)) return 0;
  const roundedValue = Math.round((numberValue + Number.EPSILON) * 100) / 100;
  return Math.abs(roundedValue) < 0.005 ? 0 : roundedValue;
}

function normalizeScore(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return isFinite(value) ? Math.round(value * 100) / 100 : 0;
  const text = String(value).trim();
  if (text === "") return 0;
  const numericValue = Number(text.replace(",", "."));
  return isFinite(numericValue) ? Math.round(numericValue * 100) / 100 : text;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
