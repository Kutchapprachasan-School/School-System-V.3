// ==========================================
// Google Apps Script File: Code.gs
// This matches the frontend logic from index.html
// ==========================================

var FOLDER_ID = '1gpeQHoqQ2s0O4pSPAoXak7inI7yv98rO'; // สามารถปล่อยว่างไว้ถ้าระบุใน ScriptProperties แล้ว
var SCHOOL_NAME = 'โรงเรียน...';
var SCHOOL_LOGO = '';

// --- ดึง ID ของฐานข้อมูลจากระบบ ---
function getDbId(module) {
  var props = PropertiesService.getScriptProperties();
  return props.getProperty(module + '_DB_ID');
}

// ==========================================
// ONE-CLICK SETUP (ติดตั้งระบบอัตโนมัติ)
// ==========================================
// ให้ผู้ใช้เปิดเมนู เลือก installSystem แล้วกด "เรียกใช้ (Run)" แค่ครั้งเดียว
function installSystem() {
  Logger.log("เริ่มการตั้งค่าระบบและสร้างฐานข้อมูลอัตโนมัติ...");
  
  var props = PropertiesService.getScriptProperties();
  
  // 1. สร้างโฟลเดอร์หลักในบัญชีของผู้ใช้
  var rootFolder = DriveApp.createFolder('School_App_Database_' + new Date().getTime());
  var rootFolderId = rootFolder.getId();
  props.setProperty('ROOT_FOLDER_ID', rootFolderId);
  Logger.log("สร้างโฟลเดอร์หลักสำเร็จ: " + rootFolder.getName());

  // HomeVisit headers ครบทุก field จาก Page_General.html
  var homeVisitHeaders = [
    // --- Step 1: ข้อมูลการเยี่ยม ---
    "student_id", "class_level", "recorded_by", "academic_year",
    "visit_status", "last_visit_date", "informant_relation", "photo_source",
    "map_lat", "map_long", "img_house_outside", "img_house_inside",
    // --- Step 2: ข้อมูลส่วนตัว ---
    "profile_image", "national_id", "nickname", "birth_date",
    "birth_province", "birth_amphoe", "birth_tambon",
    "age", "weight", "height", "nationality", "race", "religion", "blood_type",
    "previous_school", "move_in_reason", "disadvantage_type", "disability_type",
    "congenital_disease", "special_ability", "scholarship_status",
    // --- Step 3: ข้อมูลบิดา ---
    "father_status", "father_name", "father_occupation", "father_income",
    "father_age", "father_phone", "father_education",
    // --- Step 4: ข้อมูลมารดา ---
    "mother_status", "mother_name", "mother_occupation", "mother_income",
    "mother_age", "mother_phone", "mother_education",
    // --- Step 5: ข้อมูลผู้ปกครอง ---
    "guardian_name", "guardian_relation", "guardian_occupation",
    "guardian_income", "guardian_phone", "guardian_education",
    // --- Step 6: ที่พักของนักเรียน ---
    "house_no", "house_moo", "house_road", "house_tambon",
    "house_amphoe", "house_province", "house_distance_km",
    "house_transport_type", "house_living_with",
    // --- Step 7: สภาพเศรษฐกิจ ---
    "family_income", "family_expense", "family_debt", "family_land",
    "family_house_type", "family_members_count", "family_members_details",
    // --- Step 8: สภาพชีวิตและสรุปความช่วยเหลือ ---
    "student_behavior", "student_health", "need_financial_help",
    "need_equipment_help", "need_mental_help", "need_social_help",
    "teacher_summary", "next_action", "timestamp"
  ];

  const dbs = [
    { key: 'CORE', name: '00_CORE_DB', folderName: '00_CORE', sheets: [
      { name: "Users",    headers: ["username", "password", "name", "role", "timestamp"] },
      { name: "Students", headers: ["student_id", "student_name", "class_level", "room", "status", "profile_image"] },
      { name: "Settings", headers: ["setting_key", "setting_value"] }
    ]},
    { key: 'ACADEMIC', name: '01_ACADEMIC_DB', folderName: '01_ACADEMIC', sheets: [
      { name: "Assignments",  headers: ["id", "title", "subject", "teacher", "status", "created_at"] },
      { name: "Schedule",     headers: ["id", "teacher", "subject", "day", "time", "room"] },
      { name: "AcademicDocs", headers: ["docId", "workSystem", "details", "year", "term", "teacherId", "teacherName", "fileName", "fileUrl", "status", "comment", "approvedBy", "timestamp"] }
    ]},
    { key: 'BUDGET', name: '02_BUDGET_DB', folderName: '02_BUDGET', sheets: [
      { name: "Transactions", headers: ["id", "date", "type", "description", "amount", "budget_code", "status"] }
    ]},
    { key: 'HR', name: '03_HR_DB', folderName: '03_HR', sheets: [
      { name: "Staff", headers: ["id", "name", "position", "department", "start_date"] },
      { name: "Leave", headers: ["id", "staff_id", "leave_type", "start_date", "end_date", "reason", "status"] }
    ]},
    { key: 'GENERAL', name: '04_GENERAL_DB', folderName: '04_GENERAL', sheets: [
      { name: "Saraban",   headers: ["id", "doc_number", "date", "title", "from", "to", "status", "type", "timestamp"] },
      { name: "HomeVisit", headers: homeVisitHeaders }
    ]},
    { key: 'STUDENT', name: '05_STUDENT_DB', folderName: '05_STUDENT', sheets: [
      { name: "Behavior", headers: ["student_id", "date", "type", "points", "reason", "teacher"] }
    ]}
  ];

  // 2. สร้างโฟลเดอร์ย่อย + Google Sheet แต่ละโมดูล
  // เตรียม Settings sheet สำหรับเก็บ Folder IDs
  var coreSettingsSheet = null;

  for (var i = 0; i < dbs.length; i++) {
    var dbDef = dbs[i];

    // สร้างโฟลเดอร์ย่อยของแต่ละโมดูล
    var moduleFolder = rootFolder.createFolder(dbDef.folderName);
    var moduleFolderId = moduleFolder.getId();
    props.setProperty(dbDef.key + '_FOLDER_ID', moduleFolderId);
    Logger.log("สร้างโฟลเดอร์ " + dbDef.folderName + " id: " + moduleFolderId);

    // สร้าง Spreadsheet และย้ายเข้าโฟลเดอร์ย่อย
    var ss = SpreadsheetApp.create(dbDef.name);
    var file = DriveApp.getFileById(ss.getId());
    file.moveTo(moduleFolder);
    
    props.setProperty(dbDef.key + '_DB_ID', ss.getId());
    Logger.log("สร้างฐานข้อมูล " + dbDef.name + " สำเร็จ");

    // สร้างชีตย่อยและใส่ Header
    for (var j = 0; j < dbDef.sheets.length; j++) {
      var req = dbDef.sheets[j];
      var sheet = ss.getSheetByName(req.name);
      if (!sheet) { sheet = ss.insertSheet(req.name); }
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(req.headers);
        sheet.getRange(1, 1, 1, req.headers.length).setFontWeight("bold").setBackground("#4a86e8").setFontColor("#ffffff");
      }
      // เก็บ reference ถึง Settings sheet
      if (dbDef.key === 'CORE' && req.name === 'Settings') {
        coreSettingsSheet = sheet;
      }
    }
    
    // ลบ Sheet ค่าเริ่มต้นที่ไม่ต้องการ
    var sheet1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('แผ่นที่ 1');
    if (sheet1 && ss.getSheets().length > 1) { ss.deleteSheet(sheet1); }
    
    // ตั้งค่า user แอดมินเริ่มต้น
    if (dbDef.key === 'CORE') {
       var usersSheet = ss.getSheetByName('Users');
       if (usersSheet && usersSheet.getLastRow() <= 1) {
         usersSheet.appendRow(['admin', 'admin', 'ผู้ดูแลระบบสูงสุด', 'admin', new Date().toISOString()]);
       }
    }
  }

  // 3. บันทึก Folder IDs ลงใน Settings Sheet (CORE DB)
  if (coreSettingsSheet) {
    var settingRows = [
      ['ROOT_FOLDER_ID',     rootFolderId],
      ['CORE_FOLDER_ID',     props.getProperty('CORE_FOLDER_ID')],
      ['ACADEMIC_FOLDER_ID', props.getProperty('ACADEMIC_FOLDER_ID')],
      ['BUDGET_FOLDER_ID',   props.getProperty('BUDGET_FOLDER_ID')],
      ['HR_FOLDER_ID',       props.getProperty('HR_FOLDER_ID')],
      ['GENERAL_FOLDER_ID',  props.getProperty('GENERAL_FOLDER_ID')],
      ['STUDENT_FOLDER_ID',  props.getProperty('STUDENT_FOLDER_ID')],
      ['school_name',        'โรงเรียนของฉัน'],
      ['school_name_en',     'My School'],
      ['school_id',          ''],
      ['school_affiliation', ''],
      ['school_address',     ''],
      ['school_logo',        ''],
    ];
    for (var k = 0; k < settingRows.length; k++) {
      coreSettingsSheet.appendRow(settingRows[k]);
    }
  }

  Logger.log("✅ การตั้งค่าสำเร็จ 100%! โฟลเดอร์และฐานข้อมูลพร้อมใช้งานแล้วครับ");
}

// --- API Entry Points ---
function doGet(e) {
  var result = { status: 'success', message: 'API is running' };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Parse plaintext body to bypass CORS preflight
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var payload = body.payload;
    
    var responseData = apiCall(action, payload);
    
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- Authentication Login Check ---
// The frontend calls checkLogin via google.script.run
function checkLogin(username, password, dbId) {
  Logger.log("checkLogin Called: " + username + " (DB: " + dbId + ")");
  
  // Here, query the "Users" sheet from SpreadsheetApp.openById(dbId)
  // MOCK LOGIC: Simulate correct user login
  var simulatedDbUser = {
      username: 'admin',
      password: '123',
      name: 'ผู้ดูแลระบบ ตัวอย่าง',
      role: 'admin'
  };
  
  if(username === simulatedDbUser.username && password === simulatedDbUser.password) {
      return {
          status: 'success',
          data: {
              username: simulatedDbUser.username,
              name: simulatedDbUser.name,
              role: simulatedDbUser.role,
              token: Utilities.getUuid() // Optional simple token
          }
      };
  } else if (username === 'kru' && password === '123') {
      return {
          status: 'success',
          data: {
              username: username,
              name: 'ครูสมปอง ทดสอบ',
              role: 'teacher'
          }
      };
  }
  
  return { status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!' };
}

// --- Main API Router ---
function apiCall(action, payload) {
  try {
    // 1. Determine which DB to use based on action or payload.module
    // Default is CORE if not specified
    var dbModule = payload.module || 'CORE'; 
    var activeDbId = getDbId(dbModule);
    
    // Attach DB ID so functions can use it without hardcoding
    payload._dbId = activeDbId;

    switch(action) {
      case 'checkLogin':
        return checkLogin(payload.username, payload.password, activeDbId);
      case 'setupSystem':
        return { status: 'success', message: setupSystem() };
      case 'getStudentList':
        return getStudentList(payload);
      case 'getStudentDetail':
        return getStudentDetail(payload);
      case 'handleUpdateStudent':
        return handleUpdateStudent(payload);
      case 'uploadImage':
        var url = uploadImage(payload.base64Data, payload.type, payload.filename);
        return url;
      // --- Academic Submission Actions ---
      case 'getPendingDocs':
        return getPendingDocs(payload);
      case 'uploadAcademicDoc':
        return uploadAcademicDoc(payload);
      case 'approveDocument':
        return approveDocument(payload);
      case 'getRecentDocRequests':
        return getRecentDocRequests(payload);
      case 'requestDocNumber':
        return requestDocNumber(payload);
      case 'getSettings':
        return getSettings(payload);
      case 'saveSettings':
        return saveSettings(payload);
      // add more actions as needed...
      default:
        if (typeof this[action] === 'function') {
           return this[action](payload);
        }
        return { status: 'error', message: 'Action Not Found: ' + action };
    }
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

// --- API Functions ---
function getStudentList(payload) {
  // Replace with SpreadsheetApp logic mapping rows to object array
  var mockData = [
    { student_id: '12345', student_name: 'ด.ช. สมชาย รักดี', class_level: '1', room: '1', visit_status: 'รอเยี่ยม', profile_image: '' },
    { student_id: '12346', student_name: 'ด.ญ. สมใจ มุ่งมั่น', class_level: '2', room: '1', visit_status: 'เยี่ยมแล้ว', profile_image: '' },
    { student_id: '12347', student_name: 'นาย ธนธรณ์ ขยันยิ่ง', class_level: '4', room: '2', visit_status: 'ไม่สามารถเยี่ยมได้', profile_image: '' }
  ];
  return { status: 'success', data: mockData };
}

function getStudentDetail(payload) {
  var id = payload.studentId;
  // Fetch detailed row matching 'student_id'
  // Mock Data Return:
  var mock = {
    student_id: id,
    student_name: 'ด.ช. สมชาย รักดี',
    class_level: '1',
    room: '1',
    nickname: 'ชาย',
    birth_date: '2010-05-14',
    visit_status: 'รอเยี่ยม',
    age: 13,
    weight: 45,
    height: 155,
    religion: 'พุทธ',
    blood_type: 'O',
    nationality: 'ไทย',
    race: 'ไทย',
    birth_province: 'กรุงเทพมหานคร'
  };
  return { status: 'success', data: mock };
}

function handleUpdateStudent(payload) {
  // Save form object 'payload' back to spreadsheet using payload.student_id row
  // var dbId = payload._dbId; // Use correct DB based on module (GENERAL in this case)
  // var sheet = SpreadsheetApp.openById(dbId).getSheetByName('home_visit_data');
  // findRowAndReplace(sheet, payload.student_id, payload);
  Logger.log("Update Data DB["+payload._dbId+"]: " + JSON.stringify(payload));
  return { status: 'success', message: 'Data saved to Google Sheets' };
}

// File Upload to Google Drive (Images)
function uploadImage(base64Data, mimeType, fileName) {
  try {
    if(!FOLDER_ID || FOLDER_ID === 'YOUR_FOLDER_ID_HERE') return null; // Abort if unset
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (e) {
    Logger.log("Upload Error: " + e.toString());
    return null; // Ensure graceful fail if folder is wrong
  }
}

// ==========================================
// ACADEMIC SUBMISSION FUNCTIONS
// ==========================================

/**
 * getPendingDocs - ดึงรายการเอกสารวิชาการ (ทั้งรออนุมัติ และประวัติ)
 * @param {Object} payload - { user: { username, role } }
 */
function getPendingDocs(payload) {
  try {
    var dbId = getDbId('ACADEMIC');
    var ss = SpreadsheetApp.openById(dbId);
    var sheet = ss.getSheetByName('AcademicDocs');
    if (!sheet || sheet.getLastRow() < 2) return { status: 'success', data: [] };

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = {};
      headers.forEach(function(h, idx) { row[h] = data[i][idx]; });

      // กำหนด isActionable: true ถ้ารออนุมัติ และ user เป็น admin/head
      var isActionable = (row.status === 'รออนุมัติ') && 
                         (payload && payload.user && (payload.user.role === 'admin' || payload.user.role === 'head'));
      row.isActionable = isActionable;
      row.type = row.workSystem; // map field name
      row.teacher = row.teacherName;
      row.link = row.fileUrl;
      rows.push(row);
    }
    // เรียงล่าสุดก่อน
    rows.sort(function(a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
    return { status: 'success', data: rows };
  } catch (e) {
    Logger.log('getPendingDocs Error: ' + e.toString());
    return { status: 'error', message: e.toString() };
  }
}

/**
 * uploadAcademicDoc - อัพโหลดเอกสารวิชาการและบันทึกเมตาดาต้าลง Sheet
 * @param {Object} payload - { fileName, mimeType, content(base64), workSystem, details, year, term, teacherId, module }
 */
function uploadAcademicDoc(payload) {
  try {
    // 1. อัปโหลดไฟล์ไปยัง Google Drive
    var fileUrl = '';
    if (payload.content && FOLDER_ID && FOLDER_ID !== 'YOUR_FOLDER_ID_HERE') {
      var folder = DriveApp.getFolderById(FOLDER_ID);
      var blob = Utilities.newBlob(
        Utilities.base64Decode(payload.content),
        payload.mimeType || 'application/octet-stream',
        payload.fileName || 'document'
      );
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    // 2. บันทึกข้อมูลลง AcademicDocs Sheet
    var dbId = getDbId('ACADEMIC');
    var ss = SpreadsheetApp.openById(dbId);
    var sheet = ss.getSheetByName('AcademicDocs');
    if (!sheet) {
      sheet = ss.insertSheet('AcademicDocs');
      sheet.appendRow(['docId', 'workSystem', 'details', 'year', 'term', 'teacherId', 'teacherName', 'fileName', 'fileUrl', 'status', 'comment', 'approvedBy', 'timestamp']);
    }

    var docId = 'DOC_' + new Date().getTime();
    var teacherName = payload.teacherName || payload.teacherId || 'ไม่ระบุ';

    sheet.appendRow([
      docId,
      payload.workSystem || '',
      payload.details || '',
      payload.year || '',
      payload.term || '',
      payload.teacherId || '',
      teacherName,
      payload.fileName || '',
      fileUrl,
      'รออนุมัติ',
      '',   // comment
      '',   // approvedBy
      new Date().toISOString()
    ]);

    return { status: 'success', message: 'ส่งงานเรียบร้อยแล้ว', docId: docId, fileUrl: fileUrl };
  } catch (e) {
    Logger.log('uploadAcademicDoc Error: ' + e.toString());
    return { status: 'error', message: e.toString() };
  }
}

/**
 * approveDocument - อนุมัติหรือตีกลับเอกสาร
 * @param {Object} payload - { id(docId), act('Approve'|'Reject'), cmt, user }
 */
function approveDocument(payload) {
  try {
    var docId = payload.id;
    var act = payload.act; // 'Approve' or 'Reject'
    var comment = payload.cmt || '';
    var approver = (payload.user && payload.user.name) ? payload.user.name : 'ระบบ';

    var dbId = getDbId('ACADEMIC');
    var ss = SpreadsheetApp.openById(dbId);
    var sheet = ss.getSheetByName('AcademicDocs');
    if (!sheet) return { status: 'error', message: 'ไม่พบ Sheet AcademicDocs' };

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var docIdCol = headers.indexOf('docId');
    var statusCol = headers.indexOf('status');
    var commentCol = headers.indexOf('comment');
    var approvedByCol = headers.indexOf('approvedBy');

    for (var i = 1; i < data.length; i++) {
      if (data[i][docIdCol] === docId) {
        var newStatus = act === 'Approve' ? 'อนุมัติเรียบร้อย' : ('ตีกลับ: ' + comment);
        sheet.getRange(i + 1, statusCol + 1).setValue(newStatus);
        sheet.getRange(i + 1, commentCol + 1).setValue(comment);
        sheet.getRange(i + 1, approvedByCol + 1).setValue(approver);
        return { status: 'success', message: 'บันทึกผลการอนุมัติเรียบร้อย' };
      }
    }
    return { status: 'error', message: 'ไม่พบเอกสาร ID: ' + docId };
  } catch (e) {
    Logger.log('approveDocument Error: ' + e.toString());
    return { status: 'error', message: e.toString() };
  }
}

/**
 * getRecentDocRequests - ดึงประวัติการขอเลขหนังสือล่าสุด (Saraban)
 */
function getRecentDocRequests(payload) {
  try {
    var dbId = getDbId('GENERAL');
    var ss = SpreadsheetApp.openById(dbId);
    var sheet = ss.getSheetByName('Saraban');
    if (!sheet || sheet.getLastRow() < 2) return [];

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = [];
    for (var i = data.length - 1; i >= 1 && rows.length < 50; i--) {
      var row = {};
      headers.forEach(function(h, idx) { row[h] = data[i][idx]; });
      rows.push(row);
    }
    return rows;
  } catch (e) {
    Logger.log('getRecentDocRequests Error: ' + e.toString());
    return [];
  }
}

/**
 * requestDocNumber - ออกเลขหนังสือราชการ
 */
function requestDocNumber(payload) {
  try {
    var form = payload.form || payload;
    var docType = form.docType || 'ภายใน';
    var title = form.title || '';
    var receiver = form.receiver || '';
    var requester = form.requester || 'ไม่ระบุ';

    var dbId = getDbId('GENERAL');
    var ss = SpreadsheetApp.openById(dbId);
    var sheet = ss.getSheetByName('Saraban');
    if (!sheet) {
      sheet = ss.insertSheet('Saraban');
      sheet.appendRow(['id', 'doc_number', 'date', 'title', 'from', 'to', 'status', 'type', 'timestamp']);
    }

    // หาเลขที่ถัดไปสำหรับประเภทหนังสือ
    var year = new Date().getFullYear() + 543; // พ.ศ.
    var data = sheet.getDataRange().getValues();
    var count = data.filter(function(row) { return row[7] === docType && String(row[8]).includes(String(year)); }).length;
    var nextNum = count + 1;
    var prefix = docType === 'คำสั่ง' ? 'คส.' : (docType === 'ภายนอก' ? 'สง.' : 'บท.');
    var fullNumber = prefix + (nextNum < 10 ? '0' : '') + nextNum + '/' + year;

    var id = 'SB_' + new Date().getTime();
    sheet.appendRow([id, fullNumber, new Date().toLocaleDateString('th-TH'), title, requester, receiver, 'ออกแล้ว', docType, new Date().toISOString()]);

    return { status: true, docNumber: fullNumber };
  } catch (e) {
    Logger.log('requestDocNumber Error: ' + e.toString());
    return { status: false, message: e.toString() };
  }
}

// ==========================================
// SETTINGS FUNCTIONS
// ==========================================

/**
 * getSettings - ดึงการตั้งค่าทั้งหมดจาก Settings sheet
 */
function getSettings(payload) {
  try {
    var dbId = getDbId('CORE');
    if (!dbId) return { status: 'error', message: 'ยังไม่ได้ติดตั้งระบบ (installSystem)' };

    var ss = SpreadsheetApp.openById(dbId);
    var sheet = ss.getSheetByName('Settings');
    if (!sheet || sheet.getLastRow() < 2) return { status: 'success', data: {} };

    var data = sheet.getDataRange().getValues();
    var settings = {};
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) settings[data[i][0]] = data[i][1];
    }
    return { status: 'success', data: settings };
  } catch (e) {
    Logger.log('getSettings Error: ' + e.toString());
    return { status: 'error', message: e.toString() };
  }
}

/**
 * saveSettings - บันทึก/อัพเดทค่าตั้งค่าลงใน Settings sheet
 * @param {Object} payload - { settings: { key: value, ... } }
 */
function saveSettings(payload) {
  try {
    var newSettings = payload.settings || {};
    var dbId = getDbId('CORE');
    if (!dbId) return { status: 'error', message: 'ยังไม่ได้ติดตั้งระบบ' };

    var ss = SpreadsheetApp.openById(dbId);
    var sheet = ss.getSheetByName('Settings');
    if (!sheet) {
      sheet = ss.insertSheet('Settings');
      sheet.appendRow(['setting_key', 'setting_value']);
      sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a86e8').setFontColor('#ffffff');
    }

    var data = sheet.getDataRange().getValues();
    var keyRowMap = {};
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) keyRowMap[data[i][0]] = i + 1; // 1-indexed row number
    }

    var keys = Object.keys(newSettings);
    for (var j = 0; j < keys.length; j++) {
      var k = keys[j];
      var v = newSettings[k];
      if (keyRowMap[k]) {
        // อัพเดทแถวที่มีอยู่
        sheet.getRange(keyRowMap[k], 2).setValue(v);
      } else {
        // เพิ่มแถวใหม่
        sheet.appendRow([k, v]);
        keyRowMap[k] = sheet.getLastRow();
      }
    }

    return { status: 'success', message: 'บันทึกการตั้งค่าเรียบร้อยแล้ว' };
  } catch (e) {
    Logger.log('saveSettings Error: ' + e.toString());
    return { status: 'error', message: e.toString() };
  }
}
