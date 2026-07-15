// ==========================================
// app.js - Frontend Application Logic
// School Management System (GitHub Pages Version)
// ==========================================

// --- API Configuration ---
const API_URL = 'https://script.google.com/macros/s/AKfycbywQ0W7vBq7d.../exec';

// Demo mode: ถ้า API_URL ยังไม่ได้ตั้งค่า จะใช้ระบบจำลองอัตโนมัติ
const IS_DEMO_MODE = !API_URL || API_URL.includes('AKfycbywQ0W7vBq7d...');



// ผู้ใช้ในโหมด Demo
const DEMO_USERS = [
    { username: 'admin', password: '123', name: 'ผู้ดูแลระบบ', role: 'admin' },
    { username: 'kru', password: '123', name: 'ครูสมปอง ทดสอบ', role: 'teacher' },
    { username: '65001', password: '65001', name: 'ด.ช. สมชาย รักเรียน (สภานักเรียน)', role: 'student', student_id: '65001', sub_role: 'student_council' },
    { username: '65002', password: '65002', name: 'ด.ญ. สมหญิง ใจดี (รองหัวหน้า)', role: 'student', student_id: '65002', sub_role: 'vice_class_president' },
    { username: '65003', password: '65003', name: 'ด.ช. ธนกร วงศ์สว่าง (ทั่วไป)', role: 'student', student_id: '65003', sub_role: 'normal' },
    { username: '65004', password: '65004', name: 'ด.ญ. พิมพ์ชนก แสงทอง (หัวหน้า)', role: 'student', student_id: '65004', sub_role: 'class_president' }
];

// ===================== DEMO MOCK DATA =====================

const DEMO_STUDENTS = [
    { student_id: '65001', student_name: 'ด.ช. สมชาย รักเรียน', class_level: '1', room: '1', visit_status: 'เยี่ยมแล้ว', profile_image: '', nickname: 'ชาย', birth_date: '2554-05-15', age: '14', weight: '45', height: '155', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'A', previous_school: 'ร.ร. อนุบาลท่าม่วง', congenital_disease: 'ไม่มี' },
    { student_id: '65002', student_name: 'ด.ญ. สมหญิง ใจดี', class_level: '2', room: '2', visit_status: 'เยี่ยมแล้ว', profile_image: '', nickname: 'หญิง', birth_date: '2553-08-20', age: '15', weight: '42', height: '152', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'B', previous_school: 'ร.ร. วัดดอนตะโก', congenital_disease: 'ไม่มี' },
    { student_id: '65003', student_name: 'ด.ช. ธนกร วงศ์สว่าง', class_level: '1', room: '2', visit_status: 'รอเยี่ยม', profile_image: '', nickname: 'เก่ง', birth_date: '2554-02-10', age: '14', weight: '50', height: '160', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'O', previous_school: 'ร.ร. อนุบาลราชบุรี', congenital_disease: 'ไม่มี' },
    { student_id: '65004', student_name: 'ด.ญ. พิมพ์ชนก แสงทอง', class_level: '3', room: '1', visit_status: 'รอเยี่ยม', profile_image: '', nickname: 'พิม', birth_date: '2552-11-03', age: '16', weight: '48', height: '158', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'AB', previous_school: 'ร.ร. วัดเขาลั่นทม', congenital_disease: 'ภูมิแพ้' },
    { student_id: '65005', student_name: 'ด.ช. วรเมธ พงษ์ประเสริฐ', class_level: '2', room: '1', visit_status: 'เยี่ยมแล้ว', profile_image: '', nickname: 'เมธ', birth_date: '2553-06-25', age: '15', weight: '55', height: '168', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'A', previous_school: 'ร.ร. ประถมราชบุรี', congenital_disease: 'ไม่มี' },
    { student_id: '65006', student_name: 'ด.ญ. นภัสสร สุดสวย', class_level: '1', room: '3', visit_status: 'รอเยี่ยม', profile_image: '', nickname: 'นภ', birth_date: '2554-09-12', age: '14', weight: '40', height: '150', nationality: 'ไทย', race: 'ไทย', religion: 'อิสลาม', blood_type: 'B', previous_school: 'ร.ร. บ้านห้วยสำนัก', congenital_disease: 'ไม่มี' },
    { student_id: '65007', student_name: 'ด.ช. ปัณณวิชญ์ ศรีสุข', class_level: '3', room: '2', visit_status: 'ไม่สามารถเยี่ยมได้', profile_image: '', nickname: 'ปัณ', birth_date: '2552-01-30', age: '16', weight: '58', height: '170', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'O', previous_school: 'ร.ร. ท่าม่วงวิทยา', congenital_disease: 'ไม่มี' },
    { student_id: '65008', student_name: 'ด.ญ. กัญญาวีร์ ตันติพงศ์', class_level: '2', room: '3', visit_status: 'รอเยี่ยม', profile_image: '', nickname: 'วีร์', birth_date: '2553-04-07', age: '15', weight: '44', height: '155', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'A', previous_school: 'ร.ร. คุรุราษฎร์', congenital_disease: 'หอบหืด' },
    { student_id: '65009', student_name: 'ด.ช. ภูริต เจริญสุข', class_level: '1', room: '1', visit_status: 'เยี่ยมแล้ว', profile_image: '', nickname: 'ริต', birth_date: '2554-12-18', age: '13', weight: '43', height: '153', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'B', previous_school: 'ร.ร. อนุบาลบ้านโป่ง', congenital_disease: 'ไม่มี' },
    { student_id: '65010', student_name: 'ด.ญ. ณัฐณิชา วรรณดี', class_level: '3', room: '3', visit_status: 'รอเยี่ยม', profile_image: '', nickname: 'ณิชา', birth_date: '2552-07-22', age: '16', weight: '46', height: '156', nationality: 'ไทย', race: 'ไทย', religion: 'คริสต์', blood_type: 'O', previous_school: 'ร.ร. ดรุณาราชบุรี', congenital_disease: 'ไม่มี' },
    { student_id: '65011', student_name: 'ด.ช. ศุภกร มั่นคง', class_level: '2', room: '2', visit_status: 'รอเยี่ยม', profile_image: '', nickname: 'กร', birth_date: '2553-10-05', age: '15', weight: '52', height: '163', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'AB', previous_school: 'ร.ร. วัดหนองตาหลวง', congenital_disease: 'ไม่มี' },
    { student_id: '65012', student_name: 'ด.ญ. อริสรา ปิ่นทอง', class_level: '1', room: '2', visit_status: 'รอเยี่ยม', profile_image: '', nickname: 'อริ', birth_date: '2554-03-28', age: '14', weight: '38', height: '148', nationality: 'ไทย', race: 'ไทย', religion: 'พุทธ', blood_type: 'A', previous_school: 'ร.ร. อนุบาลดำเนิน', congenital_disease: 'ไม่มี' }
];

const DEMO_SARABAN_DOCS = [
    { doc_number: 'ศธ 0423/001', date: '2567-10-01', title: 'ขอให้ส่งนักเรียนเข้าร่วมกิจกรรม', from: 'สพป.รบ.1', to: 'ผู้อำนวยการ', status: 'ออกแล้ว' },
    { doc_number: 'ศธ 0423/002', date: '2567-10-05', title: 'แจ้งกำหนดการประชุมผู้บริหาร', from: 'สพป.รบ.1', to: 'ผู้อำนวยการ', status: 'ออกแล้ว' },
    { doc_number: 'ศธ 0423/003', date: '2567-10-10', title: 'ส่งรายงานผลการดำเนินงาน', from: 'ฝ่ายวิชาการ', to: 'สพป.รบ.1', status: 'ออกแล้ว' },
    { doc_number: 'ศธ 0423/004', date: '2567-10-15', title: 'ขอเชิญประชุมคณะกรรมการสถานศึกษา', from: 'โรงเรียน', to: 'คณะกรรมการ', status: 'ออกแล้ว' },
    { doc_number: 'ศธ 0423/005', date: '2567-10-20', title: 'รายงานผลการเยี่ยมบ้านนักเรียน', from: 'ฝ่ายทั่วไป', to: 'ผู้อำนวยการ', status: 'ออกแล้ว' }
];

const DEMO_ACADEMIC_DOCS = [
    { id: 'DOC001', fileName: 'แผนการจัดการเรียนรู้_วิทยาศาสตร์_ม1.pdf', workSystem: 'curriculum', details: 'แผนการจัดการเรียนรู้รายวิชาวิทยาศาสตร์ ม.1 ภาคเรียนที่ 1/2567', year: '2567', term: '1', teacherId: 'kru', teacherName: 'ครูสมปอง ทดสอบ', status: 'Pending', uploadDate: '2567-10-01' },
    { id: 'DOC002', fileName: 'รายงานผลสัมฤทธิ์_คณิตศาสตร์_ม2.pdf', workSystem: 'evaluation', details: 'รายงานผลสัมฤทธิ์ทางการเรียน วิชาคณิตศาสตร์ ม.2', year: '2567', term: '1', teacherId: 'kru02', teacherName: 'ครูวิชัย ศิริ', status: 'Approved', uploadDate: '2567-09-28' },
    { id: 'DOC003', fileName: 'บันทึกการนิเทศ_ภาษาไทย.pdf', workSystem: 'supervision', details: 'บันทึกการนิเทศการสอน กลุ่มสาระภาษาไทย', year: '2567', term: '1', teacherId: 'admin', teacherName: 'ผู้ดูแลระบบ', status: 'Approved', uploadDate: '2567-09-25' },
    { id: 'DOC004', fileName: 'ตารางสอนครู_ภาคเรียน1.xlsx', workSystem: 'schedule', details: 'ตารางสอนครูทั้งหมด ภาคเรียนที่ 1/2567', year: '2567', term: '1', teacherId: 'admin', teacherName: 'ผู้ดูแลระบบ', status: 'Pending', uploadDate: '2567-10-03' },
    { id: 'DOC005', fileName: 'ข้อสอบกลางภาค_ม3.pdf', workSystem: 'exams', details: 'ข้อสอบกลางภาค วิชาสังคมศึกษา ม.3', year: '2567', term: '1', teacherId: 'kru', teacherName: 'ครูสมปอง ทดสอบ', status: 'Rejected', uploadDate: '2567-10-02', comment: 'กรุณาแก้ไขข้อ 15-20 ให้สอดคล้องกับตัวชี้วัด' },
    { id: 'DOC006', fileName: 'สมุดเช็คเวลาเรียน_ม1.pdf', workSystem: 'attendance', details: 'บันทึกการเข้าเรียนนักเรียน ม.1/1 เดือนกันยายน', year: '2567', term: '1', teacherId: 'kru', teacherName: 'ครูสมปอง ทดสอบ', status: 'Approved', uploadDate: '2567-10-01' }
];

// ==========================================
// DEPT_WORKLOAD – ภาระงานรวมทุกฝ่าย (Todo Registry)
// ==========================================
var DEPT_WORKLOAD = [];

/**
 * สร้างรายการภาระงานจากข้อมูลจริงของแต่ละฝ่าย
 * เรียกครั้งแรกตอนโหลด และ refresh ได้ทุกเมื่อ
 */
function buildDeptWorkload() {
    var items = [];
    var seq = 1;

    // ----- 1. ACADEMIC: เอกสาร/งานที่รออนุมัติ ----------------------------------------
    (DEMO_ACADEMIC_DOCS || []).forEach(function (doc) {
        var statusMap = { Pending: 'pending', Rejected: 'todo', Approved: 'done' };
        var priorityMap = { Pending: 'high', Rejected: 'urgent', Approved: 'low' };
        var workLabel = { curriculum: 'หลักสูตร', evaluation: 'วัดผล', supervision: 'นิเทศ', schedule: 'ตารางสอน', exams: 'สอบ', attendance: 'เช็คชื่อ' };
        items.push({
            id: seq++,
            source: 'academic',
            sourceRef: doc.id,
            title: doc.details || doc.fileName,
            category: 'academic',
            priority: priorityMap[doc.status] || 'normal',
            status: statusMap[doc.status] || 'todo',
            due: '2026-03-20',
            assignee: doc.teacherName || 'ฝ่ายวิชาการ',
            note: doc.comment ? 'หมายเหตุ: ' + doc.comment : 'ระบบงาน: ' + (workLabel[doc.workSystem] || doc.workSystem)
        });
    });

    // ----- 2. DOCUMENT: สารบรรณที่ต้องดำเนินการ ----------------------------------------
    (DEMO_SARABAN_DOCS || []).forEach(function (doc) {
        items.push({
            id: seq++,
            source: 'document',
            sourceRef: doc.doc_number,
            title: 'ลงรับ/ส่งหนังสือ: ' + doc.title,
            category: 'document',
            priority: 'normal',
            status: doc.status === 'ออกแล้ว' ? 'done' : 'todo',
            due: '2026-03-15',
            assignee: 'งานสารบรรณ',
            note: 'เลขที่ ' + doc.doc_number + ' | จาก: ' + doc.from
        });
    });

    // ----- 3. GENERAL: นักเรียนรอเยี่ยมบ้าน ----------------------------------------
    var visitStudents = (studentsData && studentsData.length > 0 ? studentsData : DEMO_STUDENTS) || [];
    visitStudents.filter(function (s) { return s.visit_status === 'รอเยี่ยม'; }).forEach(function (s) {
        items.push({
            id: seq++,
            source: 'general',
            sourceRef: s.student_id,
            title: 'เยี่ยมบ้าน: ' + s.student_name + ' (ม.' + s.class_level + '/' + s.room + ')',
            category: 'general',
            priority: 'normal',
            status: 'todo',
            due: '2026-03-31',
            assignee: 'ครูประจำชั้น',
            note: 'รหัสนักเรียน: ' + s.student_id
        });
    });

    // ----- 4. BUDGET: รายการงบประมาณรออนุมัติ ----------------------------------------
    var budgetItems = [
        { title: 'ขออนุมัติโครงการปรับปรุงห้องคอมพิวเตอร์', priority: 'high', status: 'pending', due: '2026-03-15', assignee: 'ครูสมปอง ทดสอบ', note: 'วงเงิน 150,000 บาท รอผอ.อนุมัติ' },
        { title: 'เบิกจ่ายค่าอบรมเชิงปฏิบัติการ', priority: 'high', status: 'pending', due: '2026-03-11', assignee: 'งานการเงิน', note: 'แนบใบเสร็จครบถ้วน รอเซ็น' },
        { title: 'จัดซื้อวัสดุสำนักงาน Q1/2569', priority: 'normal', status: 'inprogress', due: '2026-03-18', assignee: 'งานพัสดุ', note: 'อยู่ระหว่างการตรวจรับของ' },
        { title: 'รายงานสรุปยอดใช้จ่ายไตรมาส 1', priority: 'high', status: 'todo', due: '2026-03-25', assignee: 'งานการเงิน', note: 'ส่งให้ สพป. ภายในสิ้นเดือน' },
        { title: 'ขออนุมัติซื้อหนังสือห้องสมุด', priority: 'normal', status: 'pending', due: '2026-03-22', assignee: 'ครูบรรณารักษ์', note: 'รายการหนังสือ 45 รายการ' }
    ];
    budgetItems.forEach(function (b) {
        items.push({ id: seq++, source: 'budget', sourceRef: null, category: 'budget', ...b });
    });

    // ----- 5. HR: งานบุคคลรออนุมัติ ----------------------------------------
    var hrItems = [
        { title: 'ประเมินผลปฏิบัติงานรอบ 6 เดือน', priority: 'high', status: 'todo', due: '2026-03-20', assignee: 'ฝ่ายบุคคล', note: 'ครบกำหนดสิ้นเดือนมีนาคม' },
        { title: 'อนุมัติการลาป่วย (ครูสมศรี)', priority: 'normal', status: 'pending', due: '2026-03-09', assignee: 'ผอ. สมบูรณ์', note: 'ลาป่วย 2 วัน รอเซ็นอนุมัติ' },
        { title: 'จัดทำแผนพัฒนาบุคลากรประจำปี 2569', priority: 'normal', status: 'inprogress', due: '2026-04-15', assignee: 'ฝ่ายบุคคล', note: 'อยู่ระหว่างรวบรวมข้อมูล' },
        { title: 'ต่อสัญญาจ้างครูพี่เลี้ยง 3 ราย', priority: 'urgent', status: 'todo', due: '2026-03-10', assignee: 'ผอ. สมบูรณ์', note: 'ครบสัญญา 31 มี.ค. นี้' },
        { title: 'บันทึกเวลาทำงานครูราย 6 เดือน', priority: 'normal', status: 'todo', due: '2026-03-28', assignee: 'ฝ่ายบุคคล', note: 'สรุปเพื่อประกอบการประเมิน' }
    ];
    hrItems.forEach(function (h) {
        items.push({ id: seq++, source: 'hr', sourceRef: null, category: 'hr', ...h });
    });

    // ----- 6. STUDENT COUNCIL: สภานักเรียน ----------------------------------------
    var scItems = [
        { title: 'อนุมัติแผนงานสภานักเรียน ภาคเรียน 2/2567', priority: 'high', status: 'pending', due: '2026-03-13', assignee: 'ผอ. สมบูรณ์', note: 'รอ ผอ. เซ็นท้ายรายงาน' },
        { title: 'ประชาสัมพันธ์กิจกรรมวันเปิดบ้าน', priority: 'normal', status: 'inprogress', due: '2026-03-25', assignee: 'ทีมสื่อสาร', note: 'กำลังทำโปสเตอร์' },
        { title: 'บันทึกเวรประจำวัน (สัปดาห์นี้)', priority: 'normal', status: 'todo', due: '2026-03-14', assignee: 'สภานักเรียน', note: 'บันทึกทุกวันก่อน 8.30 น.' }
    ];
    scItems.forEach(function (s) {
        items.push({ id: seq++, source: 'student_council', sourceRef: null, category: 'student_council', ...s });
    });

    // ----- 7. GENERAL (อื่น ๆ): บริหารทั่วไป ----------------------------------------
    var genItems = [
        { title: 'ซ่อมโปรเจคเตอร์ห้อง 402', priority: 'high', status: 'overdue', due: '2026-03-07', assignee: 'ช่างเทคนิค', note: 'หลอดภาพขาด เกินกำหนดแล้ว' },
        { title: 'อัปเดตข้อมูลอาคารสถานที่ในระบบ', priority: 'low', status: 'todo', due: '2026-04-01', assignee: 'งานอาคาร', note: '' },
        { title: 'รายงานโภชนาการและอาหารกลางวัน', priority: 'low', status: 'done', due: '2026-03-01', assignee: 'แม่ครัว', note: 'ส่งรายงานเดือนกุมภาพันธ์แล้ว' }
    ];
    genItems.forEach(function (g) {
        items.push({ id: seq++, source: 'general', sourceRef: null, category: 'general', ...g });
    });

    DEPT_WORKLOAD = items;
    window.DEPT_WORKLOAD = DEPT_WORKLOAD;

    // Re-render todo table if visible
    if (typeof renderTodoTable === 'function') {
        renderTodoTable();
    }
    return DEPT_WORKLOAD;
}

// Build immediately when app.js loads, and expose globally
window.DEPT_WORKLOAD = [];
window.buildDeptWorkload = buildDeptWorkload;

// --- Global App State (shared via window) ---
// NOTE: currentUser is declared as `var currentUser` in index.html <script> block.
// Do NOT redeclare it here to avoid shadowing.
var studentsData = [];
var currentStudent = null;
var currentStep = 1;
var allDocsData = [];
var myChart = null;

// --- Mock API Wrapper ---
// สร้าง google object เพื่อให้ทำงานได้ทั้งบน Live Server (demo) และ Google Apps Script
var google = {
    script: {
        run: {
            withSuccessHandler: function (callback) {
                var makeCall = function (action, data) {
                    if (IS_DEMO_MODE) {
                        console.log('[DEMO] API Call:', action, data);
                        setTimeout(function () { callback({ status: 'success', data: [] }); }, 300);
                        return;
                    }
                    fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify({ action: action, payload: data || {} })
                    }).then(function (r) { return r.json(); }).then(function (result) { callback(result); })
                        .catch(function (err) { console.error(err); callback({ status: 'error', message: err.message }); });
                };
                return {
                    apiCall: makeCall,
                    checkLogin: function (u, p) {
                        if (IS_DEMO_MODE) {
                            var user = DEMO_USERS.find(function (x) { return x.username === u && x.password === p; });
                            var result = user
                                ? { status: 'success', data: { username: user.username, name: user.name, role: user.role, token: 'demo-token' } }
                                : { status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
                            setTimeout(function () { callback(result); }, 300);
                            return;
                        }
                        makeCall('checkLogin', { username: u, password: p });
                    },
                    getPendingDocs: function (user) { return makeCall('getPendingDocs', { user: user }); },
                    uploadAcademicDoc: function (payload) { return makeCall('uploadAcademicDoc', payload); },
                    approveDocument: function (id, act, cmt, user) { return makeCall('approveDocument', { id: id, act: act, cmt: cmt, user: user }); },
                    uploadImage: function (b64, type, fname) { return makeCall('uploadImage', { base64Data: b64, type: type, filename: fname }); },
                    getRecentDocRequests: function () { return makeCall('getRecentDocRequests', {}); },
                    requestDocNumber: function (form) { return makeCall('requestDocNumber', { form: form }); },
                    getSettings: function () {
                        if (IS_DEMO_MODE) {
                            var saved = localStorage.getItem('school_settings');
                            var data = saved ? JSON.parse(saved) : {};
                            setTimeout(function () { callback({ status: 'success', data: data }); }, 200);
                            return;
                        }
                        makeCall('getSettings', {});
                    },
                    saveSettings: function (settings) {
                        if (IS_DEMO_MODE) {
                            var existing = JSON.parse(localStorage.getItem('school_settings') || '{}');
                            var merged = Object.assign(existing, settings);
                            localStorage.setItem('school_settings', JSON.stringify(merged));
                            setTimeout(function () { callback({ status: 'success', message: 'บันทึกการตั้งค่าเรียบร้อยแล้ว (Demo Mode)' }); }, 200);
                            return;
                        }
                        makeCall('saveSettings', { settings: settings });
                    }
                };
            }
        }
    }
};

// ==========================================
// PAGE NAVIGATION
// ==========================================
function showPage(pageId) {
    document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('active', 'bg-white/10', 'text-white');
        if (l.dataset.page === pageId) l.classList.add('active', 'bg-white/10', 'text-white');
    });
    const titles = {
        'academic': 'บริหารงานวิชาการ', 'budget': 'บริหารงบประมาณ', 'hr': 'บริหารงานบุคคล',
        'general': 'บริหารงานทั่วไป', 'document': 'เอกสารทะเบียน', 'student-council': 'สภานักเรียน', 'setting': 'ตั้งค่าระบบ'
    };
    const title = titles[pageId] || 'ระบบโรงเรียน';
    const h = document.getElementById('header-title'); if (h) h.innerText = title;
    const hm = document.getElementById('header-title-mobile'); if (hm) hm.innerText = title;
}

function openPage(pageId) { showPage(pageId); }

// ==========================================
// HOME VISIT SYSTEM (ระบบเยี่ยมบ้าน)
// ==========================================
function openHomeVisitSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('home-visit-system').classList.remove('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.getElementById('detail-view').classList.add('hidden');
    const hm = document.getElementById('header-title-mobile'); if (hm) hm.innerText = 'ระบบเยี่ยมบ้าน';
    loadStudentList();
}
function closeHomeVisitSystem() {
    document.getElementById('home-visit-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
    const hm = document.getElementById('header-title-mobile'); if (hm) hm.innerText = 'ฝ่ายทั่วไป';
}
function showDashboardHomeVisit() {
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
}
function loadStudentList() {
    showLoading('กำลังโหลดรายชื่อนักเรียน...');
    setTimeout(() => {
        hideLoading();
        // If studentsData is already populated, don't overwrite it with default, so the updates persist in the mock session.
        if (!studentsData || studentsData.length === 0) {
            studentsData = [
                { student_id: '65001', student_name: 'ด.ช. สมชาย รักเรียน', class_level: '1', room: '1', visit_status: 'รอเยี่ยม', profile_image: '' },
                { student_id: '65002', student_name: 'ด.ญ. สมหญิง ใจดี', class_level: '2', room: '2', visit_status: 'เยี่ยมแล้ว', profile_image: '' },
                { student_id: '65003', student_name: 'ด.ช. ขยัน สุดยอด', class_level: '3', room: '1', visit_status: 'ไม่สามารถเยี่ยมได้', profile_image: '' }
            ];
        }
        renderStudentList(studentsData);
    }, 600);
}
function renderStudentList(data) {
    const container = document.getElementById('student-list-container');
    document.getElementById('total-count').innerText = `${data.length} คน`;
    const visited = data.filter(s => s.visit_status === 'เยี่ยมแล้ว').length;
    document.getElementById('stat-visited').innerText = visited;
    document.getElementById('stat-pending').innerText = data.length - visited;
    if (data.length === 0) { container.innerHTML = `<div class="text-center p-8 text-slate-400">ไม่พบข้อมูล</div>`; return; }
    container.innerHTML = data.map(s => {
        const isVisited = s.visit_status === 'เยี่ยมแล้ว', cannotVisit = s.visit_status === 'ไม่สามารถเยี่ยมได้';
        let color = 'slate', icon = 'clock', text = s.visit_status || 'รอเยี่ยม';
        if (isVisited) { color = 'amber'; icon = 'check-circle'; } else if (cannotVisit) { color = 'red'; icon = 'circle-xmark'; }
        return `<div class="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-slate-100 hover:border-blue-300 transition cursor-pointer group" onclick="openStudentDetail('${s.student_id}')">
            <img src="${s.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURI(s.student_name) + '&background=random&color=fff'}" class="w-14 h-14 rounded-2xl object-cover">
            <div class="flex-1 min-w-0"><h4 class="font-bold text-slate-800 text-sm truncate">${s.student_name}</h4>
            <p class="text-[10px] text-slate-500 mt-1"><span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">ม.${s.class_level}/${s.room}</span></p></div>
            <span class="text-[10px] bg-${color}-50 text-${color}-600 px-2 py-1 rounded-lg border border-${color}-100 font-bold">${text}</span>
        </div>`;
    }).join('');
}
function openStudentDetail(id) {
    showLoading('กำลังเตรียมข้อมูล...');
    let localData = studentsData.find(s => s.student_id === id) || { student_id: id, student_name: 'Demo Student' };
    setTimeout(() => {
        hideLoading();
        currentStudent = localData;
        populateForm(currentStudent);
        document.getElementById('dashboard-view').classList.add('hidden');
        document.getElementById('detail-view').classList.remove('hidden');
        setStep(1);
    }, 500);
}
function populateForm(data) {
    document.getElementById('detail-name').innerText = data.student_name || 'ไม่ระบุชื่อ';
    document.getElementById('detail-id').innerText = data.student_id || '-';
    document.getElementById('detail-class').innerText = data.class_level && data.room ? `${data.class_level}/${data.room}` : '-';
    document.getElementById('detail-img').src = data.profile_image || `https://ui-avatars.com/api/?name=${encodeURI(data.student_name || 'S')}&background=random&color=fff`;
    const sb = document.getElementById('detail-status-badge');
    sb.innerText = data.visit_status || 'รอเยี่ยม';
    sb.className = data.visit_status === 'เยี่ยมแล้ว' ? 'text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold' :
        data.visit_status === 'ไม่สามารถเยี่ยมได้' ? 'text-[10px] px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold' :
            'text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium';
    document.getElementById('visit-form').reset();
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val != null && val !== '') { el.value = val; el.classList.add('filled-data'); } };
    setVal('input-student_id', data.student_id); setVal('input-class_level', data.class_level);
    const fields = ['nickname', 'visit_status', 'last_visit_date', 'informant_relation', 'photo_source', 'map_lat', 'map_long', 'birth_date', 'age', 'weight', 'height', 'birth_province', 'birth_amphoe', 'birth_tambon', 'nationality', 'race', 'religion', 'blood_type', 'previous_school', 'move_in_reason', 'disadvantage_type', 'disability_type', 'congenital_disease', 'teacher_summary'];
    fields.forEach(f => setVal('input-' + f, data[f]));
    ['nationality', 'race'].forEach(f => { const el = document.getElementById('input-' + f); if (el && !el.value) el.value = 'ไทย'; });
    if (data.profile_image) { document.getElementById('detail-img').src = data.profile_image; }
    if (data.img_house_outside) { const el = document.getElementById('prev-out'); if (el) { el.src = data.img_house_outside; el.classList.remove('hidden'); } }
    if (data.img_house_inside) { const el = document.getElementById('prev-in'); if (el) { el.src = data.img_house_inside; el.classList.remove('hidden'); } }
}
function setStep(n) {
    if (n < 1 || n > 8) return;
    currentStep = n;
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById(`step-${n}`); if (panel) panel.classList.add('active');
    const btn = document.querySelector(`.step-btn[data-step="${n}"]`);
    if (btn) { btn.classList.add('active'); const nav = document.getElementById('wizard-nav'); if (nav) nav.scrollTo({ left: btn.offsetLeft - nav.clientWidth / 2 + btn.clientWidth / 2, behavior: 'smooth' }); }
    const btnBack = document.getElementById('btn-back'); if (btnBack) btnBack.style.visibility = n === 1 ? 'hidden' : 'visible';
    const btnNext = document.getElementById('btn-next'), btnSave = document.getElementById('btn-save-main');
    if (btnNext && btnSave) { if (n === 8) { btnNext.classList.add('hidden'); btnSave.classList.add('animate-bounce'); setTimeout(() => btnSave.classList.remove('animate-bounce'), 1000); } else { btnNext.classList.remove('hidden'); } }
}
function navStep(dir) { setStep(currentStep + dir); }
function calculateAge() {
    const bd = document.getElementById('input-birth_date')?.value; if (!bd) return;
    const today = new Date(), birthDate = new Date(bd);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() - birthDate.getMonth() < 0 || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
    document.getElementById('input-age').value = age;
}
function getLocation() {
    if (!navigator.geolocation) { Swal.fire('Error', 'เบราว์เซอร์ไม่รองรับ Geolocation', 'error'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
        document.getElementById('input-map_lat').value = pos.coords.latitude;
        document.getElementById('input-map_long').value = pos.coords.longitude;
        Swal.fire({ icon: 'success', title: 'ดึงพิกัดสำเร็จ', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    }, err => Swal.fire('Error', 'ไม่สามารถเข้าถึงตำแหน่งได้: ' + err.message, 'error'), { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
}
function openNavigation() {
    const lat = document.getElementById('input-map_lat')?.value, lng = document.getElementById('input-map_long')?.value;
    if (lat && lng) window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    else Swal.fire('Info', 'ไม่พบข้อมูลพิกัด กรุณาดึงตำแหน่งก่อน', 'warning');
}
function applyFilters() { } function resetFilters() { } function populateFilters() { }
function handleImageUpload(inputEl, hiddenId, prevId, type) {
    const file = inputEl.files[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { Swal.fire('ไฟล์ขนาดใหญ่', 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB', 'warning'); inputEl.value = ''; return; }
    showLoading('กำลังอัปโหลดรูปภาพ...');
    const reader = new FileReader();
    reader.onload = function (e) {
        setTimeout(() => {
            hideLoading();
            const url = e.target.result; // Use Base64 directly as URL for mockup
            const hid = document.getElementById('input-' + hiddenId); if (hid) hid.value = url;
            const prev = document.getElementById(prevId); if (prev) { prev.src = url; prev.classList.remove('hidden'); }
            Swal.fire({ icon: 'success', title: 'อัปโหลดสำเร็จ', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
        }, 800);
    };
    reader.readAsDataURL(file);
}
function viewImage(src) {
    if (!src) return;
    Swal.fire({ imageUrl: src, imageAlt: 'Image', showCloseButton: true, showConfirmButton: false });
}
function saveVisitData() {
    const form = document.getElementById('visit-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const formData = new FormData(form);
    const dataObj = {};
    for (let [k, v] of formData.entries()) dataObj[k] = v;

    // update mock studentsData array
    const stId = document.getElementById('input-student_id')?.value;
    const stIndex = studentsData.findIndex(s => s.student_id === stId);
    if (stIndex !== -1) {
        studentsData[stIndex].visit_status = document.getElementById('input-visit_status')?.value || 'เยี่ยมแล้ว';
        studentsData[stIndex] = { ...studentsData[stIndex], ...dataObj };
    }

    showLoading('กำลังบันทึกข้อมูล...');
    setTimeout(() => {
        hideLoading();
        Swal.fire({
            icon: 'success',
            title: '(Demo) บันทึกสำเร็จ!',
            text: 'ระบบได้อัปเดตสถานะการเยี่ยมบ้านแล้ว',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            showDashboardHomeVisit();
            loadStudentList();
        });
    }, 1000);
}

// ==========================================
// GENERAL SUBSYSTEMS NAVIGATION
// ==========================================

function openStudentAffairsSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('student-affairs-system').classList.remove('hidden');
    loadAffairsRecords();
}
function closeStudentAffairsSystem() {
    document.getElementById('student-affairs-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

// ==========================================
// STUDENT AFFAIRS SYSTEM LOGIC
// ==========================================

let mockAffairsRecords = [
    { studentName: 'ด.ช. เกเร ไม่เรียน', classRoom: 'ม.3/2', type: 'deduct', category: 'หนีเรียน', points: 40, time: '12:30', recorder: 'ครูสมชาย' },
    { studentName: 'ด.ญ. ใจดี มีเมตตา', classRoom: 'ม.5/1', type: 'good', category: 'ช่วยเหลืองานโรงเรียน', points: 15, time: '09:15', recorder: 'ครูสมศรี' }
];

const mockMisconductRules = {
    'เบา': [
        { id: 101, name: 'มาโรงเรียนสาย', points: 5 },
        { id: 102, name: 'ไม่มาเข้าแถวเคารพธงชาติ', points: 5 },
        { id: 103, name: 'แต่งกายผิดระเบียบ / ผิดวัน', points: 5 },
        { id: 104, name: 'ทรงผมผิดระเบียบ', points: 5 },
        { id: 105, name: 'ไว้เล็บยาว / ทาสีเล็บ', points: 5 },
        { id: 106, name: 'ใส่เครื่องประดับที่ไม่อนุญาต', points: 5 },
        { id: 107, name: 'ไม่พกบัตรประจำตัวนักเรียน', points: 5 },
        { id: 108, name: 'นำอาหารมารับประทานในห้องเรียน', points: 5 },
        { id: 109, name: 'ทิ้งขยะไม่เป็นที่', points: 5 },
        { id: 110, name: 'ไม่ทำเวรทำความสะอาดห้องเรียน', points: 5 },
        { id: 111, name: 'พูดจาไม่สุภาพ / ใช้คำหยาบ', points: 5 },
        { id: 112, name: 'เล่นหยอกล้อแรงเกินไป', points: 10 },
        { id: 113, name: 'ใช้โทรศัพท์มือถือในเวลาเรียนโดยไม่ได้รับอนุญาต', points: 10 },
        { id: 114, name: 'ไม่ตั้งใจเรียน / หลับในห้องเรียน', points: 10 }
    ],
    'ปานกลาง': [
        { id: 201, name: 'หลบหนีการเรียน (โดดเรียน)', points: 15 },
        { id: 202, name: 'ออกนอกบริเวณโรงเรียนโดยไม่ได้รับอนุญาต', points: 20 },
        { id: 203, name: 'ปลอมแปลงอักษร ยับยั้ง หรือทำลายเอกสารของโรงเรียน', points: 20 },
        { id: 204, name: 'ปลอมแปลงลายมือชื่อผู้ปกครองหรือครู', points: 20 },
        { id: 205, name: 'นำหนังสือหรือสื่อที่ไม่เหมาะสมมาโรงเรียน', points: 15 },
        { id: 206, name: 'ทุจริตในการสอบ (การสอบเก็บคะแนน)', points: 20 },
        { id: 207, name: 'ทำลายทรัพย์สินของโรงเรียน (ความเสียหายเล็กน้อย)', points: 20 },
        { id: 208, name: 'ก่อความวุ่นวายในโรงเรียน', points: 20 },
        { id: 209, name: 'แสดงกิริยาก้าวร้าวต่อเพื่อนนักเรียน', points: 20 },
        { id: 210, name: 'เล่นการพนันรูปแบบเบาบาง', points: 20 },
        { id: 211, name: 'พกพาบุหรี่ หรือบุหรี่ไฟฟ้า', points: 20 },
        { id: 212, name: 'ทะเลาะวิวาท (ไม่มีการบาดเจ็บรุนแรง)', points: 20 },
        { id: 213, name: 'ไม่ให้ความร่วมมือในการตรวจค้นของครู', points: 15 }
    ],
    'ร้ายแรง': [
        { id: 301, name: 'ทะเลาะวิวาทหรือทำร้ายร่างกายผู้อื่น (มีการบาดเจ็บ)', points: 30 },
        { id: 302, name: 'ข่มขู่ รีดไถ หรือรังแกผู้อื่น', points: 30 },
        { id: 303, name: 'ลักทรัพย์หรือเจตนาขโมยสิ่งของ', points: 40 },
        { id: 304, name: 'สูบบุหรี่ หรือสูบบุหรี่ไฟฟ้าในบริเวณโรงเรียน', points: 30 },
        { id: 305, name: 'ดื่มสุรา หรือนำเครื่องดื่มแอลกอฮอล์เข้ามาในโรงเรียน', points: 40 },
        { id: 306, name: 'เล่นการพนันเอาทรัพย์สิน', points: 30 },
        { id: 307, name: 'ทุจริตในการสอบ (สอบกลางภาค/ปลายภาค)', points: 30 },
        { id: 308, name: 'มีพฤติกรรมชู้สาวหรือทำอนาจาร', points: 40 },
        { id: 309, name: 'นำบุคคลภายนอกเข้ามาก่อความวุ่นวาย', points: 30 },
        { id: 310, name: 'ทำลายทรัพย์สินของโรงเรียน (ความเสียหายมาก)', points: 40 },
        { id: 311, name: 'แสดงกิริยาก้าวร้าว หมิ่นประมาทต่อครูอาจารย์', points: 40 },
        { id: 312, name: 'ดูหมิ่นสถาบัน ชาติ ศาสนา พระมหากษัตริย์', points: 40 }
    ],
    'ร้ายแรงมาก': [
        { id: 401, name: 'พกพาอาวุธทุกชนิดเข้ามาในโรงเรียน', points: 50 },
        { id: 402, name: 'ทำร้ายร่างกายผู้อื่นจนได้รับบาดเจ็บสาหัส', points: 100 },
        { id: 403, name: 'ค้ายาเสพติด หรือมีสารเสพติดไว้ในครอบครอง', points: 100 },
        { id: 404, name: 'เสพยาเสพติดให้โทษ', points: 100 },
        { id: 405, name: 'มีพฤติกรรมค้าประเวณี หรือจัดหาเพื่อการอนาจาร', points: 100 },
        { id: 406, name: 'ก่ออาชญากรรม หรือเป็นสมาชิกแก๊งอันธพาล', points: 100 },
        { id: 407, name: 'นำอาวุธไปลอบทำร้ายผู้อื่น', points: 100 },
        { id: 408, name: 'เผยแพร่สื่อลามกอนาจาร หรือผิดพ.ร.บ.คอมพิวเตอร์ร้ายแรง', points: 50 },
        { id: 409, name: 'กระทำการที่ทำให้โรงเรียนเสื่อมเสียชื่อเสียงอย่างร้ายแรง', points: 50 },
        { id: 410, name: 'วางเพลิง หรือพยายามเผาทำลายสิ่งก่อสร้าง', points: 100 }
    ]
};

function loadAffairsRecords() {
    const tbody = document.getElementById('affairsRecordsTable');
    if (!tbody) return;

    if (mockAffairsRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-slate-400">ยังไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = mockAffairsRecords.map(r => {
        const isGood = r.type === 'good';
        const typeBadge = isGood ? '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">บำเพ็ญประโยชน์</span>'
            : '<span class="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">ผิดระเบียบ</span>';
        const pointsBadge = isGood ? `<span class="text-emerald-600 font-bold">+${r.points}</span>`
            : `<span class="text-rose-600 font-bold">-${r.points}</span>`;
        return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
            <td class="px-6 py-4">
                <p class="font-bold text-slate-800">${r.studentName}</p>
                <p class="text-[10px] text-slate-500">${r.classRoom}</p>
            </td>
            <td class="px-6 py-4">${typeBadge}</td>
            <td class="px-6 py-4 text-xs font-medium text-slate-700">${r.category}</td>
            <td class="px-6 py-4 text-center">${pointsBadge}</td>
            <td class="px-6 py-4 text-xs text-slate-500">${r.recorder}</td>
            <td class="px-6 py-4 text-right text-xs text-slate-400">${r.time}</td>
        </tr>`;
    }).join('');
}

function openAffairsModal(type) {
    document.getElementById('affairsForm').reset();
    document.getElementById('affairsRecordType').value = type;
    document.getElementById('affairsStudentPreview').classList.add('hidden');
    document.getElementById('affairsEvidencePreviewContainer').classList.add('hidden');

    const titleObj = document.getElementById('affairsModalTitle');
    const severityContainer = document.getElementById('severityContainer');
    const categoryWrapper = document.getElementById('categoryWrapper');
    const punishmentSection = document.getElementById('punishmentSection');
    const goodSection = document.getElementById('goodSection');
    const btnSubmit = document.getElementById('btnSubmitAffairs');

    if (type === 'deduct') {
        titleObj.innerHTML = '<i class="fa-solid fa-minus-circle text-rose-500"></i> บันทึกการหักคะแนนพฤติกรรม';
        severityContainer.classList.remove('hidden');
        categoryWrapper.className = 'md:col-span-1 lg:col-span-1';
        punishmentSection.classList.remove('hidden');
        goodSection.classList.add('hidden');

        btnSubmit.className = 'w-2/3 px-4 py-3.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2 text-sm';

    } else {
        titleObj.innerHTML = '<i class="fa-solid fa-plus-circle text-emerald-500"></i> บันทึกการทำความดี/บำเพ็ญประโยชน์';
        severityContainer.classList.add('hidden');
        categoryWrapper.className = 'md:col-span-2 lg:col-span-2';
        punishmentSection.classList.add('hidden');
        goodSection.classList.remove('hidden');

        btnSubmit.className = 'w-2/3 px-4 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm';
    }

    updateAffairsCategories();
    document.getElementById('affairsModal').classList.remove('hidden');
}

function closeAffairsModal() {
    document.getElementById('affairsModal').classList.add('hidden');
}

function updateAffairsCategories() {
    const type = document.getElementById('affairsRecordType').value;
    const catSelect = document.getElementById('affairsCategory');
    catSelect.innerHTML = '';

    if (type === 'good') {
        const options = [
            '<option value="10" data-points="10">เก็บของได้นำมาคืน (10 คะแนน)</option>',
            '<option value="15" data-points="15">ช่วยเหลืองานโรงเรียน/กิจกรรม (15 คะแนน)</option>',
            '<option value="20" data-points="20">สร้างชื่อเสียงให้โรงเรียน (20 คะแนน)</option>',
            '<option value="50" data-points="50">ทำประโยชน์ระดับประเทศ/นานาชาติ (50 คะแนน)</option>'
        ];
        catSelect.innerHTML = options.join('');
        document.getElementById('affairsPointsGood').value = 10;
    } else {
        const severity = document.getElementById('affairsSeverityLevel').value;
        const rules = mockMisconductRules[severity] || [];

        let optionsHtml = '';
        let defaultPoint = rules.length > 0 ? rules[0].points : 0;

        rules.forEach(rule => {
            optionsHtml += `<option value="${rule.name}" data-points="${rule.points}">${rule.name} หัก ${rule.points} คะแนน</option>`;
        });

        catSelect.innerHTML = optionsHtml;
        document.getElementById('affairsPoints').value = defaultPoint;

        // Auto check external saraban if severity is ร้ายแรง
        const extSaraban = document.getElementById('affairsGenSarabanExternal');
        if (extSaraban) {
            extSaraban.checked = (severity === 'ร้ายแรง' || severity === 'ร้ายแรงมาก');
        }
    }
}

function autoSetPoints() {
    const catSelect = document.getElementById('affairsCategory');
    const type = document.getElementById('affairsRecordType').value;
    const selectedOption = catSelect.options[catSelect.selectedIndex];
    const pointVal = selectedOption ? selectedOption.getAttribute('data-points') : 0;

    if (type === 'good') {
        document.getElementById('affairsPointsGood').value = pointVal;
    } else {
        document.getElementById('affairsPoints').value = pointVal;
    }
}

let mockSearchTimeout;
function searchAffairsStudentPreview(val) {
    clearTimeout(mockSearchTimeout);
    const view = document.getElementById('affairsStudentPreview');
    if (val.length < 3) {
        view.classList.add('hidden');
        return;
    }

    mockSearchTimeout = setTimeout(() => {
        document.getElementById('affairsPreviewImg').src = 'https://ui-avatars.com/api/?name=' + encodeURI(val) + '&background=random&color=fff';
        document.getElementById('affairsPreviewName').innerText = (val.length === 5 && !isNaN(val)) ? 'ด.ช. นักเรียน สมมติ' : val;
        document.getElementById('affairsPreviewClass').innerText = 'ม.3/2';
        view.classList.remove('hidden');
    }, 400);
}

// Preview image upload mock
document.getElementById('affairsEvidenceImg')?.addEventListener('change', function (e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('affairsEvidencePreview').src = e.target.result;
            document.getElementById('affairsEvidencePreviewContainer').classList.remove('hidden');
        }
        reader.readAsDataURL(this.files[0]);
    }
});

function submitAffairsRecord(e) {
    e.preventDefault();
    const type = document.getElementById('affairsRecordType').value;
    const studentInput = document.getElementById('affairsStudentTarget').value;
    const studentName = document.getElementById('affairsPreviewName').innerText || studentInput;
    const catText = document.getElementById('affairsCategory').options[document.getElementById('affairsCategory').selectedIndex].text.split('(')[0].trim();

    const points = type === 'good' ? document.getElementById('affairsPointsGood').value : document.getElementById('affairsPoints').value;

    let htmlMsg = '<p class="text-slate-600 text-sm">ข้อมูลถูกบันทึกเรียบร้อยแล้ว</p>';
    if (type === 'deduct') {
        const createInternal = document.getElementById('affairsGenSarabanInternal')?.checked;
        const createExternal = document.getElementById('affairsGenSarabanExternal')?.checked;
        if (createInternal) htmlMsg += '<p class="text-[10px] text-indigo-600 mt-2"><i class="fa-solid fa-file-invoice"></i> ส่งบันทึกข้อความถึงครูที่ปรึกษาแล้ว</p>';
        if (createExternal) htmlMsg += '<p class="text-[10px] text-rose-600 mt-1"><i class="fa-solid fa-paper-plane"></i> ออกหนังสือส่ง (ภายนอก) รอ ผอ. ลงนามแล้ว</p>';
    }

    Swal.fire({
        title: 'กำลังประมวลผล...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            setTimeout(() => {
                mockAffairsRecords.unshift({
                    studentName: studentName,
                    classRoom: 'ม.3/2',
                    type: type,
                    category: catText,
                    points: parseInt(points),
                    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                    recorder: currentUser ? currentUser.name : 'ผู้ดูแลระบบ'
                });
                loadAffairsRecords();
                closeAffairsModal();

                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ!',
                    html: htmlMsg,
                    confirmButtonColor: type === 'deduct' ? '#e11d48' : '#10b981'
                });
            }, 800);
        }
    });
}

function issueCertificate() {
    Swal.fire({
        title: 'ออกใบรับรองความประพฤติ',
        html: `
            <div class="text-left text-sm mt-3">
                <label class="block font-bold text-slate-700 mb-1">รหัสนักเรียน</label>
                <input type="text" id="certStudentId" class="w-full p-2 border border-slate-200 rounded-lg mb-3" placeholder="ระบุรหัสนักเรียน...">
                
                <label class="block font-bold text-slate-700 mb-1">เงื่อนไขผลการเรียนบำเพ็ญประโยชน์รวม</label>
                <select class="w-full p-2 border border-slate-200 rounded-lg mb-3">
                    <option>คะแนนมากกว่า 80 (ดีมาก)</option>
                    <option>คะแนนมากกว่า 60 (ดี)</option>
                </select>
                
                <label class="block font-bold text-slate-700 mb-1">รูปแบบเอกสาร (Template)</label>
                <select class="w-full p-2 border border-slate-200 rounded-lg">
                    <option>หนังสือรับรองผลความประพฤติ (เรียนต่อ)</option>
                    <option>หนังสือรับรองผลความประพฤติ (ทั่วไป)</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-print"></i> ตรวจสอบข้อมูลและพิมพ์',
        confirmButtonColor: '#4f46e5',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const val = document.getElementById('certStudentId').value;
            if (!val) {
                Swal.showValidationMessage('กรุณาระบุรหัสนักเรียน');
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'พร้อมพิมพ์เอกสาร',
                text: 'ระบบดึงข้อมูลพฤติกรรมอัตโนมัติ กรุณาดาวน์โหลด PDF',
                confirmButtonText: '<i class="fa-solid fa-download"></i> ดาวน์โหลด',
                confirmButtonColor: '#4f46e5'
            });
        }
    });
}

function openPRSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('pr-system').classList.remove('hidden');
    loadPRNewsRecords();
}
function closePRSystem() {
    document.getElementById('pr-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

// ==========================================
// PUBLIC RELATIONS SYSTEM LOGIC
// ==========================================

let mockPRNews = [
    { title: 'ประกาศรับสมัครนักเรียนปีการศึกษา 2568', date: '05 เม.ย. 67', status: 'โพสต์แล้ว', url: 'https://placehold.co/100x100?text=News' },
    { title: 'ภาพบรรยากาศวันปัจฉิมนิเทศ', date: '01 เม.ย. 67', status: 'โพสต์แล้ว', url: 'https://placehold.co/100x100?text=Events' }
];

function loadPRNewsRecords() {
    const tbody = document.getElementById('prNewsTableBody');
    if (!tbody) return;

    tbody.innerHTML = mockPRNews.map(r => {
        return `
        <tr class="hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0">
            <td class="p-4 px-6 text-slate-600 text-xs">${r.date}</td>
            <td class="p-4 text-slate-800 font-bold font-medium flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 bg-cover bg-center" style="background-image: url('${r.url}')"></div>
                ${r.title}
            </td>
            <td class="p-4 text-center">
                <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 rounded-md px-2 py-1 text-[10px] font-bold border border-blue-100"><i class="fa-brands fa-facebook"></i> ${r.status}</span>
            </td>
            <td class="p-4 px-6 text-right">
                <button class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-pink-50 hover:text-pink-600 transition inline-flex items-center justify-center"><i class="fa-solid fa-pen"></i></button>
            </td>
        </tr>`;
    }).join('');
}

document.getElementById('prNewsImage')?.addEventListener('change', function (e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('prNewsImagePreview').src = e.target.result;
            document.getElementById('prNewsImagePreviewContainer').classList.remove('hidden');
        }
        reader.readAsDataURL(this.files[0]);
    }
});

let mockPRImageURL = 'https://placehold.co/100x100?text=News';
function submitPRNews(e) {
    e.preventDefault();
    const title = document.getElementById('prNewsTitle').value;
    const shareToFB = document.getElementById('prNewsShareFB').checked;
    const previewImg = document.getElementById('prNewsImagePreview').src;
    const finalImg = previewImg || mockPRImageURL;

    Swal.fire({
        title: 'กำลังเผยแพร่...',
        html: shareToFB ? 'กำลังอัปโหลดและส่งข้อมูลไปยัง Facebook Page <i class="fa-brands fa-facebook text-blue-500"></i>' : 'กำลังบันทึกลงระบบจดหมายข่าว',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            setTimeout(() => {
                mockPRNews.unshift({
                    title: title,
                    date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }).replace('พ.ศ.', '').trim(),
                    status: shareToFB ? 'โพสต์แล้ว' : 'ฉบับร่าง',
                    url: finalImg
                });

                loadPRNewsRecords();
                document.getElementById('prNewsForm').reset();
                document.getElementById('prNewsImagePreviewContainer').classList.add('hidden');
                document.getElementById('prNewsImagePreview').src = '';

                Swal.fire({
                    icon: 'success',
                    title: 'เผยแพร่สำเร็จ!',
                    html: shareToFB ? 'ส่งโพสต์ไปยัง Facebook และบันทึกลงระบบเรียบร้อยแล้ว' : 'บันทึกจดหมายข่าวเข้าระบบเรียบร้อยแล้ว',
                    confirmButtonColor: '#db2777' // pink-600
                });
            }, 1200);
        }
    });
}

function openAdmissionSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('admission-system').classList.remove('hidden');
}
function closeAdmissionSystem() {
    document.getElementById('admission-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

// ==========================================
// ADMISSION SYSTEM LOGIC
// ==========================================

function openAdmissionApply() {
    Swal.fire({
        title: 'บันทึกผู้สมัครใหม่',
        html: `
            <div class="text-left text-sm mt-3 space-y-3">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">เลขประจำตัวประชาชน <span class="text-rose-500">*</span></label>
                    <input type="text" id="admIdCard" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-100 outline-none" placeholder="13 หลัก" maxlength="13">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ชื่อ-นามสกุล <span class="text-rose-500">*</span></label>
                        <input type="text" id="admName" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-100 outline-none" placeholder="ด.ช./ด.ญ.">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ชั้นที่สมัครเข้าเรียน</label>
                        <select id="admClassClass" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                            <option>ม.1</option>
                            <option>ม.4</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">พื้นที่บริการ</label>
                    <select id="admArea" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                        <option value="ในเขต">นักเรียนในเขตพื้นที่บริการ</option>
                        <option value="นอกเขต">นักเรียนนอกเขตพื้นที่บริการ</option>
                        <option value="เงื่อนไขพิเศษ">เงื่อนไขพิเศษ</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">อัปโหลดเอกสารประกอบ (ปพ.1, ทะเบียนบ้าน ฯลฯ)</label>
                    <input type="file" multiple class="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs cursor-pointer">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึกข้อมูลสมัคร',
        confirmButtonColor: '#0891b2', // cyan-600
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const id = document.getElementById('admIdCard').value;
            const name = document.getElementById('admName').value;
            if (!id || !name) Swal.showValidationMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
            return { id, name };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire('บันทึกสำเร็จ', 'เก็บประวัติผู้สมัครเรียบร้อยแล้ว', 'success');
        }
    });
}

function openAdmissionEnroll() {
    Swal.fire({
        title: 'บันทึกมอบตัว',
        html: `
            <div class="text-left text-sm mt-3 space-y-3">
                <div class="relative">
                    <label class="block font-bold text-slate-700 mb-1">ค้นหาผู้สมัครที่มีสิทธิ์มอบตัว</label>
                    <div class="flex gap-2">
                        <input type="text" id="enrollSearch" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="เลข ปชช. หรือ ชื่อ...">
                        <button type="button" class="bg-slate-200 px-3 rounded-lg"><i class="fa-solid fa-search"></i></button>
                    </div>
                </div>
                <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg hidden" id="enrollPreview">
                    <p class="font-bold text-emerald-800" id="enrollNamePreview">-</p>
                    <p class="text-[10px] text-emerald-600">สิทธิ์: ตัวจริง | พื้นที่: ในเขตบริการ</p>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1 mt-2">ยืนยันเอกสารมอบตัวครบถ้วน</label>
                    <label class="flex items-center gap-2 cursor-pointer mt-1">
                        <input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded border-slate-300">
                        <span class="text-slate-600 text-xs text-emerald-700 font-bold">เอกสารครบถ้วน และพร้อมบันทึกเป็นนักเรียนใหม่</span>
                    </label>
                </div>
            </div>
        `,
        didOpen: () => {
            document.getElementById('enrollSearch').addEventListener('keyup', (e) => {
                if (e.target.value.length > 3) {
                    document.getElementById('enrollPreview').classList.remove('hidden');
                    document.getElementById('enrollNamePreview').innerText = e.target.value;
                }
            });
        },
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> ยืนยันมอบตัว',
        confirmButtonColor: '#10b981', // emerald-500
        cancelButtonText: 'ยกเลิก'
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire('มอบตัวสำเร็จ', 'นักเรียนได้รับรหัสประจำตัวเรียบร้อยแล้ว', 'success');
        }
    });
}

function openAdmissionReceipt() {
    Swal.fire({
        title: 'ออกใบเสร็จรับเงิน',
        html: `
            <div class="text-left text-sm mt-3 space-y-3">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">รหัสนักเรียน / เลขบัตร ปชช.</label>
                    <input type="text" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" placeholder="ค้นหานักเรียน...">
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">รายการชำระเงิน</label>
                    <select class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                        <option>ค่าบำรุงการศึกษา (เทอม 1/2568)</option>
                        <option>ค่าสมาชิกสมาคมผู้ปกครองและครู</option>
                        <option>ค่าประกันอุบัติเหตุ</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">จำนวนเงิน (บาท)</label>
                        <input type="number" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value="2500" readonly>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">รูปแบบชำระเงิน</label>
                        <select class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                            <option>เงินสด</option>
                            <option>โอนผ่านธนาคาร</option>
                        </select>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-print"></i> บันทึกและพิมพ์',
        confirmButtonColor: '#4f46e5', // indigo-600
        cancelButtonText: 'ยกเลิก',
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'พร้อมพิมพ์ใบเสร็จ',
                text: 'ระบบออกใบเสร็จรับเงินแล้ว (ดึง PDF)',
                confirmButtonText: '<i class="fa-solid fa-download"></i> ดาวน์โหลด PDF',
                confirmButtonColor: '#4f46e5'
            });
        }
    });
}

function openNutritionSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('nutrition-system').classList.remove('hidden');
}
function closeNutritionSystem() {
    document.getElementById('nutrition-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

// ==========================================
// NUTRITION & HEALTH SYSTEM LOGIC
// ==========================================

function openNutritionCanteenCheck() {
    Swal.fire({
        title: 'บันทึกตรวจโรงอาหาร',
        html: `
            <div class="text-left text-sm mt-3 space-y-3">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">ร้านอาหารที่ตรวจ</label>
                    <select class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer">
                        <option>ร้านน้ำปั่น (ป้าศรี)</option>
                        <option>ร้านข้าวแกง (เจ๊นง)</option>
                        <option>ร้านก๋วยเตี๋ยว (ลุงชัย)</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <label class="flex items-center gap-2 cursor-pointer p-2 border border-slate-100 rounded-lg bg-slate-50">
                        <input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded border-slate-300">
                        <span class="text-xs text-slate-700">การแต่งกายผู้สัมผัสอาหาร</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 border border-slate-100 rounded-lg bg-slate-50">
                        <input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded border-slate-300">
                        <span class="text-xs text-slate-700">สุขาภิบาลบริเวณร้าน</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 border border-slate-100 rounded-lg bg-slate-50">
                        <input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded border-slate-300">
                        <span class="text-xs text-slate-700">ความสะอาดภาชนะ</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 border border-slate-100 rounded-lg bg-slate-50">
                        <input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded border-slate-300">
                        <span class="text-xs text-slate-700">คุณภาพวัตถุดิบ</span>
                    </label>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">ข้อเสนอแนะเพิ่มเติม</label>
                    <textarea class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" rows="2" placeholder="ระบุสิ่งที่ต้องปรับปรุง..."></textarea>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึกผลตรวจ',
        confirmButtonColor: '#10b981', // emerald-500
        cancelButtonText: 'ยกเลิก',
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire('บันทึกสำเร็จ', 'อัปเดตข้อมูลการตรวจโรงอาหารลงฐานข้อมูลแล้ว', 'success');
        }
    });
}

function openNutritionWaterCheck() {
    Swal.fire({
        title: 'บันทึกคุณภาพน้ำดื่ม',
        html: `
            <div class="text-left text-sm mt-3 space-y-3">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">จุดบริการน้ำดื่ม</label>
                    <select class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer">
                        <option>เครื่องกรองน้ำ อาคาร 1 (หน้าห้องพักครู)</option>
                        <option>เครื่องกรองน้ำ อาคาร 2 (ชั้น 1)</option>
                        <option>เครื่องกรองน้ำ โรงอาหาร</option>
                    </select>
                </div>
                <div class="p-3 bg-cyan-50 border border-cyan-100 rounded-lg">
                    <label class="block font-bold text-cyan-800 mb-1">สถานะไส้กรองรอบนี้</label>
                    <select class="w-full p-2.5 bg-white border border-cyan-200 rounded-lg outline-none cursor-pointer">
                        <option>ปกติ (ใช้งานต่อได้)</option>
                        <option value="replace">ต้องเปลี่ยนไส้กรอง</option>
                        <option>เครื่องชำรุดรอซ่อม</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">ผลตรวจน้ำด้วยชุดทดสอบเบื้องต้น</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="waterTest" checked class="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500">
                            <span class="text-sm text-slate-700">ผ่าน</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="waterTest" class="w-4 h-4 text-rose-600 border-slate-300 focus:ring-rose-500">
                            <span class="text-sm text-slate-700">ไม่ผ่าน <span class="text-[10px] text-rose-500">(จะอายัดจุดบริการนี้ทันที)</span></span>
                        </label>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึกผลประเมิน',
        confirmButtonColor: '#06b6d4', // cyan-500
        cancelButtonText: 'ยกเลิก',
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire('บันทึกสำเร็จ', 'อัปเดตสถานะจุดบริการน้ำดื่มแล้ว', 'success');
        }
    });
}

function openNutritionHealthCheck() {
    Swal.fire({
        title: 'บันทึกสุขภาพนักเรียน',
        html: `
            <div class="text-left text-sm mt-3 space-y-3">
                <div class="relative">
                    <label class="block font-bold text-slate-700 mb-1">ค้นหานักเรียน</label>
                    <input type="text" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-100 outline-none" placeholder="รหัสนักเรียน หรือ ชื่อ-นามสกุล...">
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-3">
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <label class="block font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 flex items-center gap-2"><i class="fa-solid fa-weight-scale text-indigo-500"></i> พัฒนาการ (BMI)</label>
                        <label class="block text-xs text-slate-500 mb-1">น้ำหนัก (กก.)</label>
                        <input type="number" class="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none mb-2" value="50">
                        <label class="block text-xs text-slate-500 mb-1">ส่วนสูง (ซม.)</label>
                        <input type="number" class="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none" value="160">
                    </div>
                    
                    <div class="p-3 bg-rose-50 rounded-xl border border-rose-100">
                        <label class="block font-bold text-rose-800 mb-2 border-b border-rose-200 pb-1 flex items-center gap-2"><i class="fa-solid fa-syringe text-rose-500"></i> วัคซีน/ภูมิคุ้มกัน</label>
                        <label class="flex items-center gap-2 cursor-pointer mb-2">
                            <input type="checkbox" checked class="w-4 h-4 text-rose-600 rounded border-slate-300">
                            <span class="text-xs text-slate-700">หัดเยอรมัน (MR)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer mb-2">
                            <input type="checkbox" checked class="w-4 h-4 text-rose-600 rounded border-slate-300">
                            <span class="text-xs text-slate-700">บาดทะยัก (Td)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="w-4 h-4 text-rose-600 rounded border-slate-300">
                            <span class="text-xs text-slate-700">คอตีบ (DTC)</span>
                        </label>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึกประวัติสุขภาพ',
        confirmButtonColor: '#e11d48', // rose-600
        cancelButtonText: 'ยกเลิก',
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire('บันทึกสำเร็จ', 'อัปเดตข้อมูลสุขภาพของนักเรียนเรียบร้อย', 'success');
        }
    });
}
function closeNutritionSystem() {
    document.getElementById('nutrition-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

function openFacilitiesSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('facilities-system').classList.remove('hidden');
}
function closeFacilitiesSystem() {
    document.getElementById('facilities-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

function openCommunitySystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('community-system').classList.remove('hidden');
}
function closeCommunitySystem() {
    document.getElementById('community-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

// ==========================================
// SARABAN SYSTEM (งานสารบรรณ)
// ==========================================
function openSarabanSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('saraban-system').classList.remove('hidden');

    // Ensure main menu is visible and others are hidden
    document.getElementById('saraban-main-menu').classList.remove('hidden');
    document.getElementById('saraban-request-view').classList.add('hidden');
    document.getElementById('saraban-inbox-view').classList.add('hidden');
    document.getElementById('saraban-cert-view').classList.add('hidden');

    // Set default date to today
    const dateInput = document.getElementById('docDate');
    if (dateInput && !dateInput.value) {
        dateInput.valueAsDate = new Date();
    }
}

function closeSarabanSystem() {
    document.getElementById('saraban-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

function openSarabanView(type) {
    document.getElementById('saraban-main-menu').classList.add('hidden');
    document.getElementById('saraban-request-view').classList.add('hidden');
    document.getElementById('saraban-inbox-view').classList.add('hidden');
    document.getElementById('saraban-cert-view').classList.add('hidden');

    if (type === 'request') {
        document.getElementById('saraban-request-view').classList.remove('hidden');
        loadRecentDocRequests();
    } else if (type === 'inbox') {
        document.getElementById('saraban-inbox-view').classList.remove('hidden');
    } else if (type === 'cert') {
        document.getElementById('saraban-cert-view').classList.remove('hidden');
    }
}

function closeSarabanView() {
    document.getElementById('saraban-main-menu').classList.remove('hidden');
    document.getElementById('saraban-request-view').classList.add('hidden');
    document.getElementById('saraban-inbox-view').classList.add('hidden');
    document.getElementById('saraban-cert-view').classList.add('hidden');
}

function openAmssSettings() {
    Swal.fire({
        title: 'ตั้งค่าการเชื่อมต่อ AMSS++',
        html: `
            <div class="text-left space-y-3 mt-3">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">URL ระบบ AMSS++ ของเขตพื้นที่</label>
                    <input type="url" id="amss-url" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="https://amss.area.go.th" value="https://smart.amss.go.th/area01">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">ชื่อผู้ใช้ (Username)</label>
                    <input type="text" id="amss-username" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="กรอก Username ของระบบ AMSS++">
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
                    <div class="relative">
                        <input type="password" id="amss-password" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 pr-10" placeholder="กรอก Password">
                        <button type="button" onclick="const f=document.getElementById('amss-password');f.type=f.type==='password'?'text':'password';this.querySelector('i').classList.toggle('fa-eye');this.querySelector('i').classList.toggle('fa-eye-slash');" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <i class="fa-solid fa-eye text-sm"></i>
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg mt-2">
                    <i class="fa-solid fa-circle-check text-blue-500"></i>
                    <span class="text-xs text-blue-800 font-medium">สถานะ: เชื่อมต่อสำเร็จล่าสุด วันนี้ 08:30 น.</span>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึกการตั้งค่า',
        confirmButtonColor: '#2563eb',
        cancelButtonText: 'ปิด'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('บันทึกสำเร็จ', 'อัปเดตการตั้งค่าการเชื่อมต่อ AMSS++ แล้ว', 'success');
        }
    });
}
let mockDocHistory = [
    { doc_number: '002/2568', type: 'หนังสือส่ง (ปกติ)', date: '02 ม.ค. 2568', title: 'ขออนุมัติจัดซื้อวัสดุสำนักงาน', from: 'งานพัสดุ', to: 'ผู้อำนวยการ', status: 'ออกแล้ว' },
    { doc_number: '001/2568', type: 'บันทึกข้อความ', date: '01 ม.ค. 2568', title: 'รายงานผลการปฏิบัติงาน', from: 'นายสมชาย', to: 'ผู้อำนวยการ', status: 'ออกแล้ว' }
];

/** Returns the next sequential doc number for a given Buddhist Era year and type */
function getNextDocNumber(buddhistYear, docTypeStr) {
    const normalizedType = (docTypeStr || '').includes('หนังสือส่ง') ? 'หนังสือส่ง' : (docTypeStr || '');
    const sameYearAndType = mockDocHistory.filter(d => {
        const parts = (d.doc_number || '').split('/');
        const isSameYear = parts.length === 2 && parts[1] === String(buddhistYear);
        const dNormType = (d.type || '').includes('หนังสือส่ง') ? 'หนังสือส่ง' : (d.type || '');
        return isSameYear && dNormType === normalizedType;
    });
    const maxNum = sameYearAndType.reduce((max, d) => {
        const num = parseInt((d.doc_number || '0').split('/')[0], 10) || 0;
        return num > max ? num : max;
    }, 0);
    return maxNum + 1;
}

let currentFilteredDocHistory = [];

function loadRecentDocRequests() {
    const yearSelect = document.getElementById('saraban-year-filter');
    if (yearSelect && yearSelect.options.length <= 1) {
        const termYears = mockTerms.map(t => parseInt(t.year, 10)).filter(y => !isNaN(y));
        const historyYears = mockDocHistory.map(d => parseInt((d.doc_number || '').split('/')[1] || '0', 10)).filter(y => y > 0);
        const years = [...new Set([...termYears, ...historyYears])].sort((a, b) => b - a);
        yearSelect.innerHTML = '<option value="">ทุกปีการศึกษา</option>' +
            years.map(y => `<option value="${y}">ปี ${y}</option>`).join('');
    }

    const typeFilter = document.getElementById('saraban-type-filter')?.value || '';
    const yearFilter = document.getElementById('saraban-year-filter')?.value || '';
    const searchFilter = document.getElementById('saraban-search-filter')?.value.toLowerCase() || '';

    const filteredData = mockDocHistory.filter(d => {
        let matchType = true;
        if (typeFilter) matchType = (d.type || '').includes(typeFilter);

        let matchYear = true;
        if (yearFilter) matchYear = (d.doc_number || '').endsWith('/' + yearFilter);

        let matchSearch = true;
        if (searchFilter) {
            matchSearch = (d.doc_number || '').toLowerCase().includes(searchFilter) ||
                (d.title || '').toLowerCase().includes(searchFilter);
        }

        return matchType && matchYear && matchSearch;
    });

    filteredData.sort((a, b) => {
        const partsA = (a.doc_number || '').split('/');
        const partsB = (b.doc_number || '').split('/');
        const yearA = parseInt(partsA[1] || '0', 10);
        const yearB = parseInt(partsB[1] || '0', 10);
        if (yearA !== yearB) return yearB - yearA;
        const numA = parseInt(partsA[0] || '0', 10);
        const numB = parseInt(partsB[0] || '0', 10);
        return numB - numA;
    });

    renderDocTableRaw(filteredData, false);
}

function renderDocTableRaw(data, showAll = false) {
    if (data) {
        currentFilteredDocHistory = data;
    } else {
        data = currentFilteredDocHistory;
    }

    const tbody = document.getElementById('docHistoryTable');
    const cardsContainer = document.getElementById('docHistoryCards');
    const showAllBtn = document.getElementById('saraban-show-all-btn-container');

    if (!data || data.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-400">ยังไม่มีข้อมูล</td></tr>';
        if (cardsContainer) cardsContainer.innerHTML = '<div class="text-center py-8 text-slate-400 text-sm">ยังไม่มีข้อมูล</div>';
        if (showAllBtn) showAllBtn.classList.add('hidden');
        return;
    }

    let displayData = data;
    if (!showAll && data.length > 10) {
        displayData = data.slice(0, 10);
    }

    if (showAllBtn) {
        if (data.length > 0) {
            showAllBtn.classList.remove('hidden');
        } else {
            showAllBtn.classList.add('hidden');
        }
    }

    const getRowHtml = (r, isCard) => {
        const canUpload = r.type === 'คำสั่ง' || r.type === 'ประกาศ';
        let actionBtn = '';
        if (canUpload) {
            if (r.fileName) {
                // Has file
                actionBtn = `<button onclick="manageDocFile('${r.doc_number}')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="จัดการไฟล์แนบ"><i class="fa-solid fa-file-pdf"></i></button>`;
            } else {
                // No file
                actionBtn = `<button onclick="manageDocFile('${r.doc_number}')" class="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="อัปโหลดไฟล์แนบ"><i class="fa-solid fa-upload"></i></button>`;
            }
        }

        // Link to budget if available
        let budgetLink = '';
        if (r.budgetProjectId) {
            budgetLink = `<button onclick="viewBudgetProject('${r.budgetProjectId}')" class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="ดูรายการงบประมาณ"><i class="fa-solid fa-link"></i></button>`;
        }

        if (isCard) {
            return `
            <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-xs font-bold text-slate-700">${r.doc_number || r.fullNumber || '-'}</div>
                        <div class="mt-1">${getDocTypeBadge(r.type || r.docType)}</div>
                    </div>
                    <div class="text-[10px] text-slate-400">${r.date || '-'}</div>
                </div>
                <div class="text-sm font-medium text-slate-800">${r.title || '-'}</div>
                <div class="flex justify-between items-center mt-1">
                    <div class="text-xs text-slate-500"><i class="fa-regular fa-user mr-1"></i>${r.from || r.requester || '-'}</div>
                    <div class="flex gap-1">${budgetLink}${actionBtn}</div>
                </div>
            </div>`;
        }

        return `<tr class="hover:bg-slate-50 transition">
            <td class="px-4 py-3 text-xs font-bold text-slate-700 whitespace-nowrap">${r.doc_number || r.fullNumber || '-'}</td>
            <td class="px-4 py-3 text-xs text-slate-600">${getDocTypeBadge(r.type || r.docType)}</td>
            <td class="px-4 py-3 text-xs text-slate-800 font-medium">${r.title || '-'}</td>
            <td class="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">${r.from || r.requester || '-'}</td>
            <td class="px-4 py-3 text-xs text-slate-500 text-right whitespace-nowrap">${r.date || '-'}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1">
                    ${budgetLink}
                    ${actionBtn}
                </div>
            </td>
        </tr>`;
    };

    if (tbody) tbody.innerHTML = displayData.map(r => getRowHtml(r, false)).join('');
    if (cardsContainer) cardsContainer.innerHTML = displayData.map(r => getRowHtml(r, true)).join('');
}

function getDocTypeBadge(type) {
    if ((type || '').includes('บันทึกข้อความ')) return `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">${type}</span>`;
    if ((type || '').includes('คำสั่ง')) return `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">${type}</span>`;
    if ((type || '').includes('หนังสือส่ง')) return `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">${type}</span>`;
    if ((type || '').includes('ประกาศ')) return `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">${type}</span>`;
    return `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">${type || '-'}</span>`;
}

async function manageDocFile(docNumber) {
    const doc = mockDocHistory.find(d => d.doc_number === docNumber);
    if (!doc) return;

    if (doc.fileName) {
        // Option to Delete or Replace
        Swal.fire({
            title: 'จัดการไฟล์เอกสาร',
            html: `
                <div class="mb-4">รุ่นปัจจุบัน: <span class="font-bold text-blue-600">${doc.fileName}</span></div>
                <div class="flex gap-2 justify-center">
                    <button id="btn-replace-file" class="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 transition"><i class="fa-solid fa-upload"></i> อัปโหลดทับไฟล์เดิม</button>
                    <button id="btn-delete-file" class="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg border border-rose-200 hover:bg-rose-100 transition"><i class="fa-solid fa-trash"></i> ลบไฟล์นี้</button>
                </div>
                <input type="file" id="hidden-file-input" accept=".pdf,.doc,.docx" class="hidden">
            `,
            showConfirmButton: false,
            showCloseButton: true,
            didOpen: () => {
                const fileInput = document.getElementById('hidden-file-input');
                document.getElementById('btn-replace-file').onclick = () => fileInput.click();

                fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        doc.fileName = file.name;
                        Swal.fire({
                            icon: 'success',
                            title: 'อัปโหลดสำเร็จ',
                            text: 'อัปเดตไฟล์เอกสารเรียบร้อยแล้ว',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            if (document.getElementById('docHistoryTable')) loadRecentDocRequests();
                            if (document.getElementById('modalDocHistoryTable')) filterModalDocHistory();
                        });
                    }
                };

                document.getElementById('btn-delete-file').onclick = () => {
                    Swal.fire({
                        title: 'ยืนยันการลบไฟล์?',
                        text: "หากลบแล้วจะไม่สามารถกู้คืนได้",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonText: 'ยกเลิก',
                        confirmButtonText: 'ลบไฟล์'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            delete doc.fileName;
                            Swal.fire({
                                icon: 'success',
                                title: 'ลบไฟล์สำเร็จ',
                                timer: 1500,
                                showConfirmButton: false
                            }).then(() => {
                                if (document.getElementById('docHistoryTable')) loadRecentDocRequests();
                                if (document.getElementById('modalDocHistoryTable')) filterModalDocHistory();
                            });
                        }
                    });
                };
            }
        });
    } else {
        // Option to Upload New
        const { value: file } = await Swal.fire({
            title: 'อัปโหลดไฟล์เอกสารย้อนหลัง',
            input: 'file',
            inputAttributes: {
                'accept': '.pdf,.doc,.docx',
                'aria-label': 'อัปโหลดไฟล์เอกสาร'
            },
            showCancelButton: true,
            confirmButtonText: 'อัปโหลด',
            cancelButtonText: 'ยกเลิก'
        });

        if (file) {
            doc.fileName = file.name;
            Swal.fire({
                icon: 'success',
                title: 'อัปโหลดสำเร็จ',
                text: 'อัปโหลดไฟล์เอกสารเรียบร้อยแล้ว',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                if (document.getElementById('docHistoryTable')) loadRecentDocRequests();
                if (document.getElementById('modalDocHistoryTable')) filterModalDocHistory();
            });
        }
    }
}

function viewBudgetProject(projectId) {
    if (!projectId) return;
    Swal.fire('เชื่อมโยงงบประมาณ', 'รายการนี้ผูกกับโครงการ/กิจกรรม: ' + projectId, 'info');
}

function updateDocTypeColor(selectEl) {
    const val = selectEl.value;
    selectEl.className = "w-full p-2.5 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer transition-colors";
    if (val === 'บันทึกข้อความ') selectEl.classList.add('bg-blue-50', 'text-blue-700');
    else if (val === 'คำสั่ง') selectEl.classList.add('bg-purple-50', 'text-purple-700');
    else if (val.includes('หนังสือส่ง')) selectEl.classList.add('bg-orange-50', 'text-orange-700');
    else if (val === 'ประกาศ') selectEl.classList.add('bg-emerald-50', 'text-emerald-700');
    else selectEl.classList.add('bg-slate-50', 'text-slate-700');

    // Manage visibility of specific fields
    const fileWrapper = document.getElementById('docFileUploadWrapper');
    const budgetWrapper = document.getElementById('docBudgetLinkWrapper');
    const budgetCheck = document.getElementById('docBudgetLinkCheck');
    const budgetInput = document.getElementById('docBudgetProjectInput');

    if (fileWrapper) {
        if (val === 'คำสั่ง' || val === 'ประกาศ') {
            fileWrapper.classList.remove('hidden');
        } else {
            fileWrapper.classList.add('hidden');
        }
    }

    if (budgetWrapper) {
        if (val === 'บันทึกข้อความ') {
            budgetWrapper.classList.remove('hidden');
        } else {
            budgetWrapper.classList.add('hidden');
            if (budgetCheck) budgetCheck.checked = false;
            if (budgetInput) budgetInput.classList.add('hidden');
        }
    }

    // Populate title suggestions
    const datalist = document.getElementById('docTitleSuggestions');
    if (datalist) {
        let mappedKey = val;
        if (val.includes('หนังสือส่ง')) mappedKey = 'หนังสือส่ง';
        const saved = JSON.parse(localStorage.getItem('SARABAN_TITLES_' + mappedKey) || '[]');
        let defaultTitles = [];

        if (saved.length === 0) {
            if (mappedKey === 'บันทึกข้อความ') defaultTitles = ['ขออนุมัติจัดซื้อวัสดุสำนักงาน', 'รายงานผลการปฏิบัติงาน', 'ขออนุมัติซ่อมแซมครุภัณฑ์', 'ขออนุมัติยืมเงินทดรองราชการ'];
            else if (mappedKey === 'คำสั่ง') defaultTitles = ['แต่งตั้งคณะกรรมการ', 'มอบหมายงาน', 'ไปราชการ'];
            else if (mappedKey === 'หนังสือส่ง') defaultTitles = ['เชิญประชุม', 'ขอความอนุเคราะห์', 'ส่งรายงาน'];
            else if (mappedKey === 'ประกาศ') defaultTitles = ['ผลการสอบ', 'วันหยุดราชการพิเศษ', 'รับสมัครบุคลากร'];
        } else {
            defaultTitles = saved;
        }

        datalist.innerHTML = defaultTitles.map(t => `<option value="${t}">`).join('');
    }
}

function configDocTitles() {
    if (!currentUser || currentUser.role !== 'admin') {
        Swal.fire('ปฏิเสธการเข้าถึง', 'เมนูนี้สำหรับผู้ดูแลระบบเท่านั้น', 'error');
        return;
    }

    const docType = document.getElementById('docType')?.value || 'บันทึกข้อความ';
    let mappedKey = docType;
    if (docType.includes('หนังสือส่ง')) mappedKey = 'หนังสือส่ง';

    const saved = JSON.parse(localStorage.getItem('SARABAN_TITLES_' + mappedKey) || '[]');
    let initialList = saved.length > 0 ? saved : [];

    if (saved.length === 0) {
        if (mappedKey === 'บันทึกข้อความ') initialList = ['ขออนุมัติจัดซื้อวัสดุสำนักงาน', 'รายงานผลการปฏิบัติงาน', 'ขออนุมัติซ่อมแซมครุภัณฑ์', 'ขออนุมัติยืมเงินทดรองราชการ'];
        else if (mappedKey === 'คำสั่ง') initialList = ['แต่งตั้งคณะกรรมการ', 'มอบหมายงาน', 'ไปราชการ'];
        else if (mappedKey === 'หนังสือส่ง') initialList = ['เชิญประชุม', 'ขอความอนุเคราะห์', 'ส่งรายงาน'];
        else if (mappedKey === 'ประกาศ') initialList = ['ผลการสอบ', 'วันหยุดราชการพิเศษ', 'รับสมัครบุคลากร'];
    }

    Swal.fire({
        title: `ตั้งค่าเรื่องที่ใช้บ่อย<br><span class="text-sm font-normal text-slate-500">ประเภท: ${mappedKey}</span>`,
        html: `
            <div class="text-left mt-2">
                <textarea id="config-titles-textarea" rows="8" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100" placeholder="พิมพ์รายชื่อเรื่อง บรรทัดละ 1 เรื่อง...">${initialList.join('\\n')}</textarea>
                <div class="text-xs text-slate-500 mt-2"><i class="fa-solid fa-circle-info mr-1"></i> พิมพ์ 1 เรื่องต่อบรรทัด</div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save mr-1"></i> บันทึก',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const val = document.getElementById('config-titles-textarea').value;
            const titles = val.split('\\n').map(t => t.trim()).filter(t => t);
            return titles;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('SARABAN_TITLES_' + mappedKey, JSON.stringify(result.value));
            Swal.fire('บันทึกสำเร็จ', 'อัปเดตรายการเรื่องที่ใช้บ่อยแล้ว', 'success');
            const typeSelect = document.getElementById('docType');
            if (typeSelect) updateDocTypeColor(typeSelect);
        }
    });
}

function openAllDocHistoryModal() {
    Swal.fire({
        title: '<div class="flex items-center gap-2"><div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg"><i class="fa-solid fa-list-ul"></i></div> <span class="text-xl font-bold text-slate-800">ประวัติออกเลขเอกสารทั้งหมด</span></div>',
        html: `
            <div class="text-left mt-4 mb-4">
                <div class="flex flex-wrap gap-2 mb-4">
                    <select id="modal-type-filter" onchange="filterModalDocHistory()"
                        class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none flex-1 min-w-[100px]">
                        <option value="">ประเภททั้งหมด</option>
                        <option value="บันทึกข้อความ">บันทึกข้อความ</option>
                        <option value="คำสั่ง">คำสั่ง</option>
                        <option value="หนังสือส่ง">หนังสือส่ง</option>
                        <option value="ประกาศ">ประกาศ</option>
                    </select>
                    <select id="modal-year-filter" onchange="filterModalDocHistory()"
                        class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none w-24">
                        <option value="">ทุกปีการศึกษา</option>
                        ${[...new Set([...mockTerms.map(t => parseInt(t.year, 10)).filter(y => !isNaN(y)), ...mockDocHistory.map(d => parseInt((d.doc_number || '').split('/')[1] || '0', 10)).filter(y => y > 0)])].sort((a, b) => b - a).map(y => `<option value="${y}">ปี ${y}</option>`).join('')}
                    </select>
                    <div class="relative flex-[2] min-w-[120px]">
                        <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                        <input type="text" id="modal-search-filter" oninput="filterModalDocHistory()" placeholder="ค้นหาเลขเดิม/เรื่อง..."
                            class="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none">
                    </div>
                </div>
                <div class="overflow-y-auto max-h-[50vh] custom-scrollbar border border-slate-100 rounded-2xl">
                    <table class="min-w-full text-sm text-left text-slate-500 relative">
                        <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th class="px-4 py-3 font-bold">เลขที่</th>
                                <th class="px-4 py-3 font-bold">ประเภท</th>
                                <th class="px-4 py-3 font-bold">เรื่อง</th>
                                <th class="px-4 py-3 font-bold">ผู้ขอ</th>
                                <th class="px-4 py-3 text-right font-bold w-24">เวลา</th>
                            </tr>
                        </thead>
                        <tbody id="modalDocHistoryTable" class="divide-y divide-slate-100">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        width: '800px',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: { popup: 'rounded-[2rem] p-4' },
        didOpen: () => {
            filterModalDocHistory();
        }
    });
}

function filterModalDocHistory() {
    const typeF = document.getElementById('modal-type-filter')?.value || '';
    const yearF = document.getElementById('modal-year-filter')?.value || '';
    const searchF = document.getElementById('modal-search-filter')?.value.toLowerCase() || '';

    const sortedData = [...mockDocHistory].sort((a, b) => {
        const yearA = parseInt((a.doc_number || '').split('/')[1] || '0', 10);
        const yearB = parseInt((b.doc_number || '').split('/')[1] || '0', 10);
        if (yearA !== yearB) return yearB - yearA;
        return parseInt((b.doc_number || '').split('/')[0] || '0', 10) - parseInt((a.doc_number || '').split('/')[0] || '0', 10);
    });

    const filtered = sortedData.filter(d => {
        const matchT = typeF ? (d.type || '').includes(typeF) : true;
        const matchY = yearF ? (d.doc_number || '').endsWith('/' + yearF) : true;
        const matchS = searchF ? ((d.doc_number || '').toLowerCase().includes(searchF) || (d.title || '').toLowerCase().includes(searchF)) : true;
        return matchT && matchY && matchS;
    });

    const tbody = document.getElementById('modalDocHistoryTable');
    if (!tbody) return;
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-400">ไม่พบข้อมูล</td></tr>';
        return;
    }
    tbody.innerHTML = filtered.map(r => `<tr class="hover:bg-slate-50 transition"><td class="px-4 py-3 text-xs font-bold text-slate-700 whitespace-nowrap">${r.doc_number || r.fullNumber || '-'}</td><td class="px-4 py-3 text-xs text-slate-600">${getDocTypeBadge(r.type || r.docType)}</td><td class="px-4 py-3 text-xs text-slate-800 font-medium">${r.title || '-'}</td><td class="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">${r.from || r.requester || '-'}</td><td class="px-4 py-3 text-xs text-slate-500 text-right whitespace-nowrap">${r.date || '-'}</td></tr>`).join('');
}

function submitDocRequest() {
    const docDate = document.getElementById('docDate')?.value;
    const docType = document.getElementById('docType')?.value;
    const title = document.getElementById('docTitle')?.value;
    const receiver = document.getElementById('docReceiver')?.value;
    const requester = currentUser ? currentUser.name : 'ผู้ใช้งาน';

    if (!docDate || !docType || !title || !receiver) {
        Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูล วันที่ เรื่อง และผู้รับ ให้ครบถ้วน', 'warning');
        return;
    }

    Swal.fire({
        title: 'กำลังดำเนินการออกเลข...',
        html: '<div class="text-sm text-slate-500 mt-2">กรุณารอสักครู่ ระบบกำลังบันทึกข้อมูล</div>',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            setTimeout(() => {
                const d = new Date(docDate);
                const buddhistYear = d.getFullYear() + 543;
                const newNum = getNextDocNumber(buddhistYear, docType);
                const paddedNum = String(newNum).padStart(3, '0');
                const newDocNumber = `${paddedNum}/${buddhistYear}`;

                // Format Thai date
                const thNum = d.getDate();
                const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
                const thMonth = months[d.getMonth()];
                const thDateStr = `${thNum} ${thMonth} ${buddhistYear}`;

                const budgetProjectId = document.getElementById('docBudgetLinkCheck')?.checked
                    ? document.getElementById('docBudgetProjectInput')?.value
                    : null;
                const fileInput = document.getElementById('docFileInput');
                const fileName = (docType === 'คำสั่ง' || docType === 'ประกาศ') && fileInput?.files?.length > 0
                    ? fileInput.files[0].name
                    : null;

                const newDoc = {
                    doc_number: newDocNumber,
                    type: docType,
                    date: thDateStr,
                    title: title,
                    from: requester,
                    to: receiver,
                    status: 'ออกแล้ว'
                };
                if (budgetProjectId) newDoc.budgetProjectId = budgetProjectId;
                if (fileName) newDoc.fileName = fileName;

                mockDocHistory.unshift(newDoc);

                loadRecentDocRequests();
                document.getElementById('genDocForm')?.reset();
                if (document.getElementById('docDate')) document.getElementById('docDate').valueAsDate = new Date();

                // Clear UI labels
                const fileLabel = document.getElementById('docFileLabel');
                if (fileLabel) fileLabel.textContent = 'คลิกเพื่อเลือกไฟล์';
                const typeSelect = document.getElementById('docType');
                if (typeSelect) updateDocTypeColor(typeSelect);

                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    html: `เลขที่เอกสารของคุณคือ:<br><span class="text-2xl font-black text-blue-600 mt-2 block">${newDocNumber}</span>`,
                    confirmButtonColor: '#2563eb'
                });
            }, 800);
        }
    });
}

window.simulateBatchCert = function () {
    const range = document.getElementById('certRange').value;
    if (!range) { Swal.fire('แจ้งเตือน', 'กรุณาระบุช่วงเลขที่เกียรติบัตร', 'warning'); return; }

    const btn = document.getElementById('btnGenCert');
    const barContainer = document.getElementById('certProgress');
    const percentText = document.getElementById('certPercent');
    const bar = document.getElementById('certBar');

    btn.classList.add('hidden');
    barContainer.classList.remove('hidden');

    let p = 0;
    const interval = setInterval(() => {
        p += Math.floor(Math.random() * 20) + 10;
        if (p >= 100) {
            p = 100;
            clearInterval(interval);
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'สร้างเกียรติบัตรสำเร็จ!',
                    text: 'ระบบได้เพิ่มเกียรติบัตรลงในคลัง Smart Download พร้อม QR Code เรียบร้อยแล้ว',
                    confirmButtonColor: '#9333ea'
                });
                barContainer.classList.add('hidden');
                btn.classList.remove('hidden');
                percentText.innerText = '0%';
                bar.style.width = '0%';
                document.getElementById('certBatchForm').reset();
            }, 500);
        }
        percentText.innerText = p + '%';
        bar.style.width = p + '%';
    }, 400);
};

function changeDocTab(tabName) {
    document.querySelectorAll('.doc-tab-btn').forEach(btn => {
        btn.className = 'doc-tab-btn flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 transition-all whitespace-nowrap';
    });
    const activeBtn = document.getElementById('btn-doc-' + tabName);
    if (activeBtn) {
        activeBtn.className = 'doc-tab-btn flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all bg-white text-blue-600 shadow-sm whitespace-nowrap';
    }
    console.log('Switched doc tab to:', tabName);
}

// ==========================================
// ACADEMIC NAVIGATION
// ==========================================
// ==========================================

// BUDGET NAVIGATION (uses functions in BUDGET SUBSYSTEM LOGIC section)
// ==========================================

// ==========================================
// HR NAVIGATION
// ==========================================
function openHRSubsystem(type) {
    const views = ['staffing', 'development', 'performance', 'discipline'];
    document.getElementById('hr-dashboard-view').classList.add('hidden');
    views.forEach(v => { const el = document.getElementById('hr-' + v + '-view'); if (el) el.classList.add('hidden'); });
    const target = document.getElementById('hr-' + type + '-view');
    if (target) {
        target.classList.remove('hidden');
        if (type === 'staffing') renderHRStaffingTable();
        else if (type === 'development') renderHRDevelopment();
        else if (type === 'performance') renderHRPerformanceTable();
        else if (type === 'discipline') initHRDiscipline();
    } else Swal.fire({ icon: 'info', title: 'กำลังพัฒนา', text: 'ระบบนี้กำลังอยู่ในช่วงการพัฒนา', confirmButtonColor: '#3b82f6' });
}
function closeHRSubsystem() {
    const views = ['staffing', 'development', 'performance', 'discipline'];
    views.forEach(v => { const el = document.getElementById('hr-' + v + '-view'); if (el) el.classList.add('hidden'); });
    document.getElementById('hr-dashboard-view').classList.remove('hidden');
}

// ==========================================
// GENERAL NAVIGATION (ฝ่ายทั่วไป)
// ==========================================
function openGeneralSubsystem(type) {
    const views = ['pr', 'admission', 'health', 'building', 'community'];
    document.getElementById('general-menu-view').classList.add('hidden');
    views.forEach(v => { const el = document.getElementById(v + '-system'); if (el) el.classList.add('hidden'); });
    const target = document.getElementById(type + '-system');
    if (target) target.classList.remove('hidden');
    else Swal.fire({ icon: 'info', title: 'กำลังพัฒนา', text: 'ระบบนี้กำลังอยู่ในช่วงการพัฒนา', confirmButtonColor: '#3b82f6' });
}
function closeGeneralSubsystem() {
    const views = ['pr', 'admission', 'health', 'building', 'community'];
    views.forEach(v => { const el = document.getElementById(v + '-system'); if (el) el.classList.add('hidden'); });
    document.getElementById('general-menu-view').classList.remove('hidden');
}
function openStudentAffairsSystem() {
    document.getElementById('general-menu-view').classList.add('hidden');
    document.getElementById('student-affairs-system').classList.remove('hidden');
    loadAffairsRecords();
}
function closeStudentAffairsSystem() {
    document.getElementById('student-affairs-system').classList.add('hidden');
    document.getElementById('general-menu-view').classList.remove('hidden');
}

// ==========================================
// STUDENT COUNCIL NAVIGATION
// ==========================================
function openStudentCouncilSubsystem(sysId) {
    const subsystems = ['morning_duty', 'scan', 'assembly', 'cleaning'];
        if (typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'student') {
        const subRole = currentUser.sub_role || 'normal';
        if (sysId === 'assembly') {
            if (subRole !== 'student_council' && subRole !== 'class_president' && subRole !== 'vice_class_president') {
                Swal.fire('ไม่มีสิทธิ์เข้าถึง', 'เมนูเช็คแถวหน้าเสาธงเข้าถึงได้เฉพาะสภานักเรียน, หัวหน้าห้อง, และรองหัวหน้าห้องเท่านั้น', 'error');
                return;
            }
        } else if (sysId === 'morning_duty' || sysId === 'cleaning') {
            if (subRole !== 'student_council') {
                Swal.fire('ไม่มีสิทธิ์เข้าถึง', 'เมนูนี้เข้าถึงได้เฉพาะสภานักเรียนเท่านั้น', 'error');
                return;
            }
        }
    }
    document.getElementById('student-council-dashboard-view').classList.add('hidden');
    subsystems.forEach(s => { const el = document.getElementById('student-council-' + s + '-view'); if (el) el.classList.add('hidden'); });
    const target = document.getElementById('student-council-' + sysId + '-view');
    if (target) {
        target.classList.remove('hidden');
        // Initialize specific views
        if (sysId === 'assembly') initAssemblyView();
        else if (sysId === 'cleaning') initCleaningView();
        else if (sysId === 'scan') initScanView();
    } else {
        Swal.fire('กำลังพัฒนา', 'ระบบนี้กำลังอยู่ระหว่างการพัฒนา', 'info');
        document.getElementById('student-council-dashboard-view').classList.remove('hidden');
    }
}
function closeStudentCouncilSubsystem(sysId) {
    const target = document.getElementById('student-council-' + sysId + '-view');
    if (target) target.classList.add('hidden');
    document.getElementById('student-council-dashboard-view').classList.remove('hidden');
}

// ==========================================
// ACADEMIC SCHEDULE LOGIC (จัดตารางสอน)
// ==========================================
let scheduleData = [
    { id: 's1', day: 1, period: 1, subject: 'ค21101', name: 'คณิตศาสตร์', teacher: 'ครูสมชาย', color: 'blue' },
    { id: 's2', day: 1, period: 2, subject: 'ค21101', name: 'คณิตศาสตร์', teacher: 'ครูสมชาย', color: 'blue' },
    { id: 's3', day: 1, period: 3, subject: 'ว21101', name: 'วิทยาศาสตร์', teacher: 'ครูสมศรี', color: 'green' },
    { id: 's4', day: 1, period: 5, subject: 'ท21101', name: 'ภาษาไทย', teacher: 'ครูมานี', color: 'orange' },
    { id: 's5', day: 2, period: 1, subject: 'ท21101', name: 'ภาษาไทย', teacher: 'ครูมานี', color: 'orange' },
    { id: 's6', day: 2, period: 3, subject: 'ส21101', name: 'สังคมศึกษา', teacher: 'ครูปิติ', color: 'indigo' },
    { id: 's7', day: 2, period: 4, subject: 'ส21101', name: 'สังคมศึกษา', teacher: 'ครูปิติ', color: 'indigo' },
    { id: 's8', day: 2, period: 6, subject: 'พ21101', name: 'สุขศึกษา', teacher: 'ครูชูใจ', color: 'teal' },
    { id: 's9', day: 2, period: 7, subject: 'กิจกรรม', name: 'ลูกเสือ/เนตรนารี', teacher: 'สนามกีฬา', color: 'red', colspan: 2 } // Mock colspan handling
];

const daysConfig = [
    { id: 1, name: 'จันทร์', color: 'yellow' },
    { id: 2, name: 'อังคาร', color: 'pink' },
    { id: 3, name: 'พุธ', color: 'emerald' },
    { id: 4, name: 'พฤหัสฯ', color: 'orange' },
    { id: 5, name: 'ศุกร์', color: 'sky' }
];

function renderScheduleGrid() {
    const gridEl = document.getElementById('scheduleGrid');
    if (!gridEl) return;

    let html = `
    <!-- Header Row -->
    <div class="grid grid-cols-9 gap-2 mb-2">
        <div class="h-10"></div>
        ${[1, 2, 3, 4].map(p => `
            <div class="flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-100 py-2">
                <span class="text-[10px] font-bold text-slate-400">คาบ ${p}</span><span class="text-xs font-bold text-slate-700">0${p + 7}:30-0${p + 8}:20</span>
            </div>
        `).join('')}
        <div class="flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-100 py-2 text-rose-500">
            <span class="text-[10px] font-bold">พักกลางวัน</span><span class="text-xs font-bold">11:50-12:50</span>
        </div>
        ${[5, 6, 7].map(p => `
            <div class="flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-100 py-2">
                <span class="text-[10px] font-bold text-slate-400">คาบ ${p}</span><span class="text-xs font-bold text-slate-700">${p + 7}:50-${p + 8}:40</span>
            </div>
        `).join('')}
    </div>`;

    daysConfig.forEach(day => {
        html += `<div class="grid grid-cols-9 gap-2 mb-2">
            <div class="flex items-center justify-center bg-${day.color}-100 text-${day.color}-700 font-bold rounded-xl border border-${day.color}-200 h-20">${day.name}</div>`;

        for (let p = 1; p <= 7; p++) {
            if (p === 5) { // Lunch break visually handled but we keep the grid logic separate
                html += `<div class="bg-slate-50 rounded-xl flex items-center justify-center"><i class="fa-solid fa-utensils text-slate-300 text-xl"></i></div>`;
            }
            let actualPeriod = p > 4 ? p : p; // Adjust if lunch break is a real period

            const item = scheduleData.find(d => d.day === day.id && d.period === p);
            if (item) {
                if (item.colspan) {
                    html += `<div draggable="true" ondragstart="drag(event, '${item.id}')" ondragover="allowDrop(event)" ondrop="drop(event, ${day.id}, ${p})" class="col-span-${item.colspan} bg-${item.color}-50 border border-${item.color}-100 rounded-xl p-2 flex flex-col justify-center items-center hover:shadow-md transition cursor-grab active:cursor-grabbing group">
                        <span class="text-sm font-bold text-slate-800">${item.subject}</span>
                        <span class="text-xs text-${item.color}-500 font-medium">${item.teacher}</span>
                    </div>`;
                    p += item.colspan - 1; // Skip next period
                } else {
                    html += `<div draggable="true" ondragstart="drag(event, '${item.id}')" ondragover="allowDrop(event)" ondrop="drop(event, ${day.id}, ${p})" class="bg-${item.color}-50 border border-${item.color}-100 rounded-xl p-2 flex flex-col justify-between hover:shadow-md transition cursor-grab active:cursor-grabbing group min-h-[5rem]">
                        <span class="text-xs font-bold text-slate-800">${item.subject}</span>
                        <div><span class="text-[10px] text-${item.color}-600 font-medium">${item.name}</span><br><span class="text-[10px] text-slate-500">${item.teacher}</span></div>
                    </div>`;
                }
            } else {
                html += `<div ondragover="allowDrop(event)" ondrop="drop(event, ${day.id}, ${p})" class="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-center text-slate-400 text-xs font-bold border-dashed hover:bg-slate-100 transition duration-200 min-h-[5rem]">ว่าง (Drop Here)</div>`;
            }
        }
        html += `</div>`;
    });
    gridEl.innerHTML = html;
}

// Global Drag State
let draggedItemId = null;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev, id) {
    draggedItemId = id;
    ev.dataTransfer.setData("text", id);
}

function drop(ev, toDay, toPeriod) {
    ev.preventDefault();
    if (!draggedItemId) return;

    // Check conflicts (is there already an item here?)
    const existingItem = scheduleData.find(d => d.day === toDay && d.period === toPeriod);
    const draggedItem = scheduleData.find(d => d.id === draggedItemId);

    if (existingItem) {
        // Swap them
        existingItem.day = draggedItem.day;
        existingItem.period = draggedItem.period;
    }

    draggedItem.day = toDay;
    draggedItem.period = toPeriod;

    renderScheduleGrid();
    draggedItemId = null;

    // Optional: save to backend
    // google.script.run.apiCall('updateSchedule', scheduleData);
}

function openScheduleSetupModal() {
    Swal.fire({
        title: 'จัดตารางสอนอัตโนมัติ',
        html: `
            <div class="text-left text-sm mb-4">กำหนดเงื่อนไขเพื่อจัดตารางสอนใหม่:</div>
            <select id="autoClass" class="w-full mb-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                <option>ม.1/1</option><option>ม.1/2</option><option>ม.2/1</option><option>ม.3/1</option>
            </select>
            <div class="flex items-center gap-2 mb-3">
                <input type="checkbox" id="avoidConflict" checked class="w-4 h-4 text-emerald-600 rounded">
                <label for="avoidConflict" class="text-sm font-bold text-slate-700">หลีกเลี่ยงคาบซ้ำซ้อนของครู (Teacher Conflict)</label>
            </div>
            <div class="text-xs text-slate-500 text-left bg-blue-50 p-3 rounded-lg border border-blue-100"><i class="fa-solid fa-info-circle mr-1"></i> ระบบจะทำการสร้างตารางเรียนอัตโนมัติ 35 คาบ/สัปดาห์ โดยอิงจากโครงสร้างหลักสูตร</div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-wand-magic-sparkles"></i> สร้างตารางอัตโนมัติ',
        confirmButtonColor: '#4f46e5',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            autoGenerateSchedule();
        }
    });
}

function autoGenerateSchedule() {
    showLoading('กำลังประมวลผลอัลกอริทึมจัดตารางสอน...');
    setTimeout(() => {
        hideLoading();
        // Mock Auto Generate: Shuffle the days
        scheduleData = scheduleData.map(item => {
            let newDay = Math.floor(Math.random() * 5) + 1;
            let newPeriod = Math.floor(Math.random() * 7) + 1;
            // Simplified logic: just randomly assign a day/period that isn't already taken
            return { ...item, day: newDay, period: newPeriod };
        });

        // Remove duplicates in same period
        const seen = new Set();
        scheduleData = scheduleData.filter(item => {
            const key = `${item.day}-${item.period}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        renderScheduleGrid();
        Swal.fire({
            icon: 'success',
            title: 'จัดตารางอัตโนมัติสำเร็จ',
            text: 'คุณสามารถลากและวาง (Drag & Drop) เพื่อปรับแต่งตารางได้ตามต้องการ',
            confirmButtonColor: '#10b981'
        });
    }, 1500);
}

function openAddSubjectModal() {
    Swal.fire('เพิ่มรายวิชา', 'ส่วนนี้จะเปิดฟอร์มเพื่อเพิ่มรายวิชาใหม่ลงตาราง', 'info');
}

// Initially Render
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderScheduleGrid, 1000); // Give time for DOM
});

// ==========================================
// HR SUBSYSTEMS LOGIC
// ==========================================

const MOCK_HR_STAFFING = [
    { subject: 'ภาษาไทย', required: 8, actual: 7, diff: -1 },
    { subject: 'คณิตศาสตร์', required: 8, actual: 8, diff: 0 },
    { subject: 'วิทยาศาสตร์และเทคโนโลยี', required: 10, actual: 12, diff: 2 },
    { subject: 'สังคมศึกษาฯ', required: 6, actual: 6, diff: 0 },
    { subject: 'ภาษาต่างประเทศ', required: 7, actual: 5, diff: -2 },
    { subject: 'สุขศึกษาและพลศึกษา', required: 4, actual: 4, diff: 0 },
    { subject: 'ศิลปะ', required: 3, actual: 3, diff: 0 },
    { subject: 'การงานอาชีพ', required: 3, actual: 4, diff: 1 }
];

function renderHRStaffingTable() {
    const tbody = document.getElementById('hr-staffing-table-body');
    if (!tbody) return;

    tbody.innerHTML = MOCK_HR_STAFFING.map(item => {
        let diffColor = 'slate';
        let statusText = 'พอดี';
        if (item.diff < 0) { diffColor = 'red'; statusText = `ขาด ${Math.abs(item.diff)}`; }
        else if (item.diff > 0) { diffColor = 'amber'; statusText = `เกิน ${item.diff}`; }
        else { diffColor = 'emerald'; statusText = 'ตามเกณฑ์'; }

        return `<tr class="hover:bg-slate-50 transition border-b border-slate-50">
            <td class="p-4 text-xs font-bold text-slate-700">${item.subject}</td>
            <td class="p-4 text-xs text-slate-600 text-center">${item.required}</td>
            <td class="p-4 text-xs font-bold text-slate-800 text-center">${item.actual}</td>
            <td class="p-4 text-xs font-bold text-${diffColor}-600 text-center">${item.diff > 0 ? '+' : ''}${item.diff}</td>
            <td class="p-4 text-center">
                <span class="text-[10px] bg-${diffColor}-50 text-${diffColor}-600 border border-${diffColor}-100 px-2 py-1 rounded-lg font-bold">
                    ${statusText}
                </span>
            </td>
        </tr>`;
    }).join('');
}

const MOCK_HR_VPA = [
    { name: 'นางวันทนี ศรีสวัสดิ์', position: 'ครูชำนาญการพิเศษ', status: 'ส่งแล้ว', date: '28 ก.ย. 66' },
    { name: 'นายสมศักดิ์ รักชาติ', position: 'ครูชำนาญการ', status: 'รอแก้ไข', date: '30 ก.ย. 66' },
    { name: 'น.ส.ใจดี เรียนเก่ง', position: 'ครู', status: 'ยังไม่ส่ง', date: '-' }
];

const MOCK_HR_TRAINING = [
    { topic: 'การใช้ AI ในการจัดการเรียนรู้', hours: 6, date: '15 ต.ค. 66', type: 'ภายนอก' },
    { topic: 'อบรมเชิงปฏิบัติการเครื่องมือวัดผล', hours: 12, date: '10-11 ก.ย. 66', type: 'ภายใน' }
];

function renderHRDevelopment() {
    const vpaList = document.getElementById('hr-vpa-list');
    if (vpaList) {
        vpaList.innerHTML = MOCK_HR_VPA.map(item => {
            let statusClass = item.status === 'ส่งแล้ว' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                item.status === 'รอแก้ไข' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100';
            return `<div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition hover:shadow-sm">
                <div>
                    <h4 class="text-xs font-bold text-slate-800">${item.name}</h4>
                    <p class="text-[10px] text-slate-500">${item.position}</p>
                </div>
                <div class="text-right">
                    <span class="text-[10px] px-2 py-0.5 rounded-md font-bold border ${statusClass}">${item.status}</span>
                    <p class="text-[9px] text-slate-400 mt-1">${item.date}</p>
                </div>
            </div>`;
        }).join('');
    }

    const trainingList = document.getElementById('hr-training-list');
    if (trainingList) {
        trainingList.innerHTML = MOCK_HR_TRAINING.map(item => {
            let iconText = item.type === 'ภายใน' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500';
            let iconBody = item.type === 'ภายใน' ? 'fa-school' : 'fa-building';
            return `<div class="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition bg-white">
                <div class="w-8 h-8 rounded-lg ${iconText} flex items-center justify-center shrink-0">
                    <i class="fa-solid ${iconBody} text-xs"></i>
                </div>
                <div>
                    <h4 class="text-xs font-bold text-slate-800 line-clamp-1">${item.topic}</h4>
                    <p class="text-[10px] text-slate-500 mt-0.5"><i class="fa-regular fa-clock mr-1"></i>${item.hours} ชั่วโมง | ${item.date}</p>
                </div>
            </div>`;
        }).join('');
    }
}

const MOCK_HR_PERFORMANCE = [
    { name: 'นางวันทนี ศรีสวัสดิ์', position: 'ครูเชี่ยวชาญ', score: 95.50, level: 'ดีเด่น' },
    { name: 'นายสมศักดิ์ รักชาติ', position: 'ครูชำนาญการพิเศษ', score: 88.00, level: 'ดีมาก' },
    { name: 'นางพรพรรณ ทองดี', position: 'ครูชำนาญการ', score: 82.50, level: 'ดี' },
    { name: 'น.ส.ใจดี เรียนเก่ง', position: 'ครู', score: 91.00, level: 'ดีเด่น' }
];

function renderHRPerformanceTable() {
    const tbody = document.getElementById('hr-performance-table-body');
    if (!tbody) return;

    tbody.innerHTML = MOCK_HR_PERFORMANCE.map(item => {
        let levelColor = item.level === 'ดีเด่น' ? 'emerald' :
            item.level === 'ดีมาก' ? 'blue' :
                item.level === 'ดี' ? 'amber' : 'slate';
        return `<tr class="hover:bg-slate-50 transition border-b border-slate-50">
            <td class="p-4">
                <div class="flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=${encodeURI(item.name)}&background=random&color=fff" class="w-8 h-8 rounded-full border border-slate-100">
                    <span class="text-xs font-bold text-slate-800">${item.name}</span>
                </div>
            </td>
            <td class="p-4 text-xs text-slate-600 font-medium">${item.position}</td>
            <td class="p-4 text-xs font-black text-slate-800 text-center">${item.score.toFixed(2)}</td>
            <td class="p-4 text-center">
                <span class="text-[10px] bg-${levelColor}-50 text-${levelColor}-600 border border-${levelColor}-100 px-2 py-1 rounded-lg font-bold">
                    ${item.level}
                </span>
            </td>
            <td class="p-4 text-center">
                <button class="text-[10px] text-slate-600 hover:text-slate-800 font-bold bg-white border border-slate-200 shadow-sm px-2 py-1 rounded hover:bg-slate-50 transition"><i class="fa-solid fa-pen mr-1"></i>ตรวจสอบ</button>
            </td>
        </tr>`;
    }).join('');
}

let hrClockInterval = null;
let MOCK_HR_ATTENDANCE = [
    { name: 'นางวันทนี ศรีสวัสดิ์', timeIn: '07:15:22', timeOut: '-', status: 'มาปกติ' },
    { name: 'นายสมศักดิ์ รักชาติ', timeIn: '08:05:10', timeOut: '-', status: 'มาสาย' },
    { name: 'น.ส.ใจดี เรียนเก่ง', timeIn: '-', timeOut: '-', status: 'ยังไม่ลงเวลา' }
];

function updateHRClock() {
    const clockEl = document.getElementById('hr-clock-time');
    if (clockEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString('th-TH');
    }
}

function initHRDiscipline() {
    const userNameEl = document.getElementById('hr-discipline-user-name');
    if (userNameEl) userNameEl.innerText = typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'ผู้ใช้งานระบบ (สาธิต)';

    const avatarEl = document.getElementById('hr-discipline-user-avatar');
    if (avatarEl) {
        let n = typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Admin';
        avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURI(n)}&background=f1f5f9&color=64748b`;
    }

    const dateEl = document.getElementById('hr-today-date');
    if (dateEl) dateEl.innerText = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

    if (hrClockInterval) clearInterval(hrClockInterval);
    hrClockInterval = setInterval(updateHRClock, 1000);
    updateHRClock();

    renderHRAttendanceTable();
}

function renderHRAttendanceTable() {
    const tbody = document.getElementById('hr-attendance-table-body');
    if (!tbody) return;

    tbody.innerHTML = MOCK_HR_ATTENDANCE.map(item => {
        let statusColor = item.status === 'มาปกติ' ? 'emerald' :
            item.status === 'มาสาย' ? 'amber' : 'slate';
        return `<tr class="hover:bg-slate-50 transition border-b border-slate-50">
            <td class="p-3 text-xs font-bold text-slate-700">${item.name}</td>
            <td class="p-3 text-xs font-mono text-slate-600 text-center bg-slate-50/50">${item.timeIn}</td>
            <td class="p-3 text-xs font-mono text-slate-400 text-center">${item.timeOut}</td>
            <td class="p-3 text-center">
                <span class="text-[10px] text-${statusColor}-600 bg-${statusColor}-50 px-2 py-0.5 rounded font-bold border border-${statusColor}-100">
                    ${item.status}
                </span>
            </td>
        </tr>`;
    }).join('');
}

function hrSimulateClockIn() {
    const btn = document.getElementById('hr-clock-btn');
    if (!btn) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('th-TH');
    const name = typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'ผู้ใช้งานระบบ (สาธิต)';

    let existing = MOCK_HR_ATTENDANCE.find(a => a.name === name);
    let action = 'in';

    if (existing && existing.timeIn !== '-') {
        if (existing.timeOut !== '-') {
            Swal.fire({ icon: 'info', title: 'ลงเวลาครบแล้ว', text: 'คุณได้ลงเวลาเข้าและออกงานในวันนี้เรียบร้อยแล้ว' });
            return;
        }
        existing.timeOut = timeStr;
        action = 'out';
    } else {
        if (existing) {
            existing.timeIn = timeStr;
            existing.status = 'มาปกติ';
        } else {
            MOCK_HR_ATTENDANCE.unshift({
                name: name,
                timeIn: timeStr,
                timeOut: '-',
                status: 'มาปกติ'
            });
            existing = MOCK_HR_ATTENDANCE[0];
        }
    }

    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-lg"></i> กำลังบันทึก...`;
    btn.classList.add('opacity-80', 'cursor-not-allowed');
    btn.disabled = true;

    setTimeout(() => {
        renderHRAttendanceTable();
        Swal.fire({
            icon: 'success',
            title: action === 'in' ? 'บันทึกเวลาเข้างานสำเร็จ' : 'บันทึกเวลาออกงานสำเร็จ',
            text: `เวลา ${timeStr}`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: 'top-end'
        });

        btn.disabled = false;
        btn.classList.remove('opacity-80', 'cursor-not-allowed');

        if (existing && existing.timeOut === '-') {
            btn.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket text-lg"></i> บันทึกเวลาออกงาน`;
            btn.className = "w-full bg-slate-600 hover:bg-slate-700 text-white py-3.5 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2 text-sm z-10 active:scale-95 duration-200 mt-2";
        } else if (existing && existing.timeOut !== '-') {
            btn.innerHTML = `<i class="fa-solid fa-check-double text-lg"></i> ลงเวลาเรียบร้อยแล้ว`;
            btn.className = "w-full bg-emerald-100 text-emerald-600 border border-emerald-200 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm z-10 cursor-not-allowed mt-2 opacity-80";
            btn.disabled = true;
        }
    }, 800);
}



// ==========================================
// ATTENDANCE LOGIC (เช็คชื่อนักเรียน)
// ==========================================
function submitAttendance() {
    Swal.fire({
        title: 'ยืนยันการบันทึก?',
        text: 'ระบบจะส่งข้อความแจ้งเตือนผู้ปกครองสำหรับนักเรียนที่ขาดและมาสาย',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            showLoading('กำลังบันทึกข้อมูล...');
            setTimeout(() => {
                hideLoading();
                Swal.fire('สำเร็จ', 'บันทึกข้อมูลการเช็คชื่อเรียบร้อยแล้ว', 'success');
                calculateAttendanceStats();
            }, 1000);
        }
    });
}

function calculateAttendanceStats() {
    // This function can be called after rendering to calculate initial stats
    setTimeout(() => {
        // Just mock updating stats
        const total = 42;
        let present = 38, late = 2, absent = 1, sick = 1;
        document.getElementById('stat-present') && (document.getElementById('stat-present').innerText = present);
        document.getElementById('stat-late') && (document.getElementById('stat-late').innerText = late);
        document.getElementById('stat-absent') && (document.getElementById('stat-absent').innerText = absent);
        document.getElementById('stat-leave') && (document.getElementById('stat-leave').innerText = sick);
    }, 500);
}
document.addEventListener('DOMContentLoaded', calculateAttendanceStats);

// ==========================================
// GRADING LOGIC (งานทะเบียนวัดผล)
// ==========================================
// Auto-calculate total and grade
document.addEventListener('input', function (e) {
    if (e.target.closest('#academic-evaluation-view tbody') && e.target.tagName === 'INPUT') {
        const row = e.target.closest('tr');
        if (row) {
            const inputs = row.querySelectorAll('input[type="number"]');
            if (inputs.length === 4) {
                const s1 = parseFloat(inputs[0].value) || 0;
                const s2 = parseFloat(inputs[1].value) || 0;
                const s3 = parseFloat(inputs[2].value) || 0;
                const s4 = parseFloat(inputs[3].value) || 0;
                const total = s1 + s2 + s3 + s4;

                // Max sum validation
                let totalDisplay = total;
                if (total > 100) totalDisplay = 100;

                const totalCell = row.querySelector('td:nth-child(7)');
                const gradeCell = row.querySelector('td:nth-child(8)');

                if (totalCell && gradeCell) {
                    totalCell.innerText = totalDisplay;
                    const grade = calculateGradeValue(totalDisplay);
                    gradeCell.innerText = grade.toFixed(1);

                    // Add some colors based on grade
                    if (grade >= 3) {
                        gradeCell.className = "py-3 px-4 text-center font-black text-emerald-600 bg-emerald-50/30";
                    } else if (grade >= 2) {
                        gradeCell.className = "py-3 px-4 text-center font-black text-blue-600 bg-blue-50/30";
                    } else if (grade > 0) {
                        gradeCell.className = "py-3 px-4 text-center font-black text-orange-600 bg-orange-50/30";
                    } else {
                        gradeCell.className = "py-3 px-4 text-center font-black text-red-600 bg-red-50/30";
                    }
                }
            }
        }
    }
});

function calculateGradeValue(score) {
    if (score >= 80) return 4.0;
    if (score >= 75) return 3.5;
    if (score >= 70) return 3.0;
    if (score >= 65) return 2.5;
    if (score >= 60) return 2.0;
    if (score >= 55) return 1.5;
    if (score >= 50) return 1.0;
    return 0.0;
}

function saveEvaluationData() {
    Swal.fire({
        title: 'บันทึกคะแนน?',
        text: 'ระบบจะทำการบันทึกข้อมูลคะแนนล่าสุด',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5'
    }).then((res) => {
        if (res.isConfirmed) {
            showLoading('กำลังบันทึก...');
            setTimeout(() => { hideLoading(); Swal.fire('สำเร็จ', 'บันทึกคะแนนเรียบร้อยแล้ว', 'success'); }, 800);
        }
    });
}

function exportPP5() {
    Swal.fire({
        title: 'ออกเอกสาร ปพ.5',
        text: 'กำลังสร้างไฟล์ PDF สำหรับวิชา ค21101...',
        icon: 'info',
        confirmButtonColor: '#4f46e5'
    }).then(() => {
        Swal.fire('สำเร็จ', 'ระบบสร้างไฟล์ ปพ.5 เรียบร้อยแล้ว', 'success');
    });
}

// Attach listeners to evaluation buttons manually since onclick isn't inline via previous diffs
document.addEventListener('DOMContentLoaded', () => {
    const evalButtons = document.querySelectorAll('#academic-evaluation-view button');
    if (evalButtons.length > 2) {
        // index 0: back, index 1: export, index 2: save
        evalButtons[1].onclick = exportPP5;
        evalButtons[2].onclick = saveEvaluationData;
    }
});

// ==========================================
// EXAMS LOGIC (ระบบสอบ)
// ==========================================
function openAddExamModal() {
    Swal.fire({
        title: 'สร้างข้อสอบใหม่',
        html: `
            < input type = "text" id = "examSubject" class="w-full p-2 border border-slate-200 rounded-lg mb-2" placeholder = "รหัสและชื่อวิชา (เช่น ค21101 คณิตศาสตร์)" >
            <select id="examType" class="w-full p-2 border border-slate-200 rounded-lg mb-2">
                <option>กลางภาค</option><option>ปลายภาค</option><option>เก็บคะแนน</option>
            </select>
            <input type="number" id="examTime" class="w-full p-2 border border-slate-200 rounded-lg mb-2" placeholder="เวลาสอบ (นาที) เช่น 60">
        `,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        confirmButtonColor: '#9333ea'
    }).then((r) => {
        if (r.isConfirmed) Swal.fire('สำเร็จ', 'เพิ่มรายการสอบเข้าคลังสำเร็จ', 'success');
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const examButtons = document.querySelectorAll('#academic-exams-view button');
    if (examButtons.length > 1) { // back button is [0]
        examButtons[1].onclick = openAddExamModal;
    }
});

// ==========================================
// CURRICULUM LOGIC (หลักสูตร)
// ==========================================
function openAddCurriculumModal() {
    Swal.fire({
        title: 'เพิ่มรายวิชาในโครงสร้าง',
        html: `
            <input type="text" class="w-full p-2 border border-slate-200 rounded-lg mb-2" placeholder="รหัสวิชา (เช่น ค21101)">
            <input type="text" class="w-full p-2 border border-slate-200 rounded-lg mb-2" placeholder="ชื่อรายวิชา (เช่น คณิตศาสตร์ 1)">
            <select class="w-full p-2 border border-slate-200 rounded-lg mb-2">
                <option>วิชาพื้นฐาน</option><option>วิชาเพิ่มเติม</option><option>กิจกรรมพัฒนาผู้เรียน</option>
            </select>
            <div class="grid grid-cols-2 gap-2">
                <input type="number" step="0.5" class="w-full p-2 border border-slate-200 rounded-lg" placeholder="หน่วยกิต (เช่น 1.5)">
                <input type="number" class="w-full p-2 border border-slate-200 rounded-lg" placeholder="ชั่วโมง/สัปดาห์ (เช่น 3)">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        confirmButtonColor: '#d97706'
    }).then((r) => {
        if (r.isConfirmed) Swal.fire('สำเร็จ', 'บันทึกโครงสร้างรายวิชาสำเร็จ', 'success');
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const currButtons = document.querySelectorAll('#academic-curriculum-view button');
    if (currButtons.length > 1) {
        currButtons[1].onclick = openAddCurriculumModal;
    }
});

// ==========================================
// SUPERVISION & CALENDAR LOGIC (นิเทศการสอน / ปฏิทิน)
// ==========================================
function openAddSupervisionModal() {
    Swal.fire({
        title: 'จัดตารางนิเทศ / ปฏิทินการศึกษา',
        html: `
            <div class="text-left text-xs text-slate-500 mb-1 font-bold">เลือกผู้รับการนิเทศ / ผู้รับผิดชอบ:</div>
            <select class="w-full p-2 border border-slate-200 rounded-lg mb-3">
                <option>นายสมชาย รักคณิต</option><option>นางสาวมานี มีสอน</option>
            </select>
            <div class="text-left text-xs text-slate-500 mb-1 font-bold">รายวิชา และ ชั้น:</div>
            <input type="text" class="w-full p-2 border border-slate-200 rounded-lg mb-3" placeholder="เช่น ค21101 ม.1/1">
            <div class="text-left text-xs text-slate-500 mb-1 font-bold">กำหนดการ (วัน/เวลา):</div>
            <input type="date" class="w-full p-2 border border-slate-200 rounded-lg mb-2">
            <select class="w-full p-2 border border-slate-200 rounded-lg">
                <option>คาบ 1 (08:30)</option><option>คาบ 2 (09:20)</option><option>คาบ 3 (10:10)</option><option>คาบ 4 (11:00)</option><option>คาบ 5 (12:50)</option><option>คาบ 6 (13:40)</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'เพิ่มลงปฏิทิน',
        confirmButtonColor: '#0d9488'
    }).then((r) => {
        if (r.isConfirmed) Swal.fire('สำเร็จ', 'บันทึกตารางนิเทศสำเร็จ', 'success');
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const supButtons = document.querySelectorAll('#academic-supervision-view button');
    if (supButtons.length > 1) {
        supButtons[1].onclick = openAddSupervisionModal;
    }

    // Wire up evaluation buttons in supervise view
    // Wire up evaluation buttons in supervise view
    const evalStartBtns = document.querySelectorAll('#academic-supervision-view .bg-teal-50');
    evalStartBtns.forEach(b => {
        b.onclick = () => {
            Swal.fire({
                title: 'ประเมินการจัดการเรียนรู้',
                text: 'เริ่มการบันทึกฟอร์มนิเทศการสอน',
                icon: 'info',
                confirmButtonColor: '#0d9488'
            });
        };
    });
});

// ==========================================
// GENERIC MODAL HELPERS
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// ==========================================
// SETTING SUBSYSTEMS LOGIC (switchSettingTab defined in SETTING MODULE ACTIONS section below)
// ==========================================

function executeDemoBackup() {
    const btn = document.getElementById('backup-btn');
    const container = document.getElementById('backup-progress-container');
    const bar = document.getElementById('backup-progress-bar');
    const pct = document.getElementById('backup-percentage');
    const status = document.getElementById('backup-status-text');

    if (!btn || !container) return;

    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังเตรียมการ...';

    container.classList.remove('hidden');
    bar.style.width = '0%';
    pct.innerText = '0%';

    let progress = 0;
    status.innerText = 'กำลังสำรองข้อมูล... โครงสร้างฐานข้อมูล';

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) progress = 100;

        bar.style.width = progress + '%';
        pct.innerText = progress + '%';

        if (progress > 30 && progress < 60) {
            status.innerText = 'กำลังสำรองข้อมูล... ตารางผู้ใช้งานและข้อมูลวิชาการ';
        } else if (progress >= 60 && progress < 90) {
            status.innerText = 'กำลังสำรองข้อมูล... แฟ้มภาพและเอกสารแนบ';
        } else if (progress >= 90) {
            status.innerText = 'กำลังตรวจสอบความสมบูรณ์ของไฟล์ Backup...';
        }

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                container.classList.add('hidden');
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
                btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> เริ่มสำรองข้อมูล';

                // Add new history record to top
                const tbody = document.getElementById('backup-history-list');
                const now = new Date();
                const timeStr = `${now.getDate()} ${now.toLocaleString('th-TH', { month: 'short' })} ${now.getFullYear() + 543} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`;

                if (tbody) {
                    const row = document.createElement('tr');
                    row.className = 'border-b border-slate-100 hover:bg-slate-50/50 transition bg-green-50/30';
                    row.innerHTML = `
                        <td class="p-4 font-medium text-slate-800">
                            <div class="flex items-center gap-2">
                                <i class="fa-regular fa-clock text-slate-400 text-xs"></i> ${timeStr}
                                <span class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                            </div>
                        </td>
                        <td class="p-4 text-slate-600"><span class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">Manual Backup</span></td>
                        <td class="p-4 text-slate-600">848 MB</td>
                        <td class="p-4">ผู้ใช้งานระบบ (สาธิต)</td>
                        <td class="p-4 text-center">
                            <button onclick="demoAlert('ดาวน์โหลดไฟล์ Backup')" class="text-blue-600 hover:text-blue-800 transition font-bold"><i class="fa-solid fa-download"></i></button>
                        </td>
                    `;
                    tbody.insertBefore(row, tbody.firstChild);

                    // remove highlight after few seconds
                    setTimeout(() => row.classList.remove('bg-green-50/30'), 3000);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'สำรองข้อมูลสำเร็จ',
                    text: 'ไฟล์มีขนาด 848 MB สามารถดาวน์โหลดได้ทันที',
                    confirmButtonColor: '#3b82f6'
                });
            }, 800);
        }
    }, 400);
}

// Common Demo Utilities
if (typeof window.confirmAction !== 'function') {
    window.confirmAction = function (actionName) {
        Swal.fire({
            title: 'ยืนยันการทำรายการ?',
            text: `คุณต้องการ ${actionName} ใช่หรือไม่ ระบบจะไม่สามารถย้อนกลับได้`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ดำเนินการ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'ดำเนินการสำเร็จ',
                    text: `${actionName} เรียบร้อยแล้ว`,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
            }
        });
    };
}

if (typeof window.demoAlert !== 'function') {
    window.demoAlert = function (msg) {
        Swal.fire({
            title: 'ระบบสาธิต (Demo)',
            text: msg,
            icon: 'info',
            confirmButtonColor: '#3b82f6'
        });
    };
}


// ==========================================
// ACADEMIC CALENDAR LOGIC (ปฏิทินวิชาการ)
// ==========================================

let mockAcademicCalendar = [
    // Academic events
    { id: 1, title: 'สอบกลางภาค 2/2568', date: '2026-01-19', endDate: '2026-01-23', type: 'exam', desc: 'สอบกลางภาคเรียนที่ 2 ทุกระดับชั้น' },
    { id: 2, title: 'ส่งคะแนนกลางภาค', date: '2026-01-26', endDate: '', type: 'activity', desc: 'ส่งคะแนนผ่านระบบ SGS' },
    { id: 3, title: 'ประชุมวิชาการ', date: '2026-02-05', endDate: '', type: 'meeting', desc: 'ห้องประชุม 1' },
    { id: 4, title: 'กิจกรรม Open House', date: '2026-02-14', endDate: '', type: 'activity', desc: 'ณ อาคารอเนกประสงค์' },
    { id: 5, title: 'สอบปลายภาค 2/2568', date: '2026-03-09', endDate: '2026-03-13', type: 'exam', desc: 'สอบปลายภาคเรียนที่ 2' },
    { id: 6, title: 'ส่งคะแนนปลายภาค', date: '2026-03-16', endDate: '', type: 'activity', desc: 'กำหนดส่งคะแนนผลสอบ' },
    { id: 7, title: 'ประชุมสรุปผลปีการศึกษา', date: '2026-03-25', endDate: '', type: 'meeting', desc: 'ห้องประชุมใหญ่' },
    // Academic events for semester 1/2569
    { id: 200, title: 'เปิดเรียน 1/2569', date: '2026-05-16', endDate: '', type: 'activity', desc: 'เปิดภาคเรียนที่ 1' },
    { id: 201, title: 'ประชุมผู้ปกครอง', date: '2026-05-23', endDate: '', type: 'meeting', desc: 'อาคารอเนกประสงค์' },
    { id: 202, title: 'สอบกลางภาค 1/2569', date: '2026-07-20', endDate: '2026-07-24', type: 'exam', desc: 'สอบกลางภาคเรียนที่ 1' },
    { id: 203, title: 'กิจกรรมวันแม่แห่งชาติ', date: '2026-08-11', endDate: '', type: 'activity', desc: 'กิจกรรมวันแม่แห่งชาติ' },
    { id: 204, title: 'สอบปลายภาค 1/2569', date: '2026-09-21', endDate: '2026-09-25', type: 'exam', desc: 'สอบปลายภาคเรียนที่ 1' }
];

let holidaysFetchedYears = {};

let currentCalendarView = 'grid'; // 'grid' or 'list'

function toggleCalendarView(view) {
    currentCalendarView = view;
    if (view === 'grid') {
        document.getElementById('btnCalGrid').className = 'flex-1 px-3 py-1.5 bg-white text-slate-800 shadow-sm rounded-lg text-sm font-bold transition';
        document.getElementById('btnCalList').className = 'flex-1 px-3 py-1.5 text-slate-500 hover:text-slate-800 rounded-lg text-sm font-bold transition';
        document.getElementById('academicCalendarGrid').classList.remove('hidden');
        document.getElementById('academicCalendarList').classList.add('hidden');
    } else {
        document.getElementById('btnCalList').className = 'flex-1 px-3 py-1.5 bg-white text-slate-800 shadow-sm rounded-lg text-sm font-bold transition';
        document.getElementById('btnCalGrid').className = 'flex-1 px-3 py-1.5 text-slate-500 hover:text-slate-800 rounded-lg text-sm font-bold transition';
        document.getElementById('academicCalendarList').classList.remove('hidden');
        document.getElementById('academicCalendarGrid').classList.add('hidden');
    }
    loadAcademicCalendar();
}

function getCalendarEventsFiltered() {
    const typeFilter = document.getElementById('acCalTypeFilter').value;
    const monthFilter = document.getElementById('acCalMonthFilter').value; // 'YYYY-MM'

    return mockAcademicCalendar.filter(ev => {
        let passType = (!typeFilter || ev.type === typeFilter);
        let passMonth = true;
        if (monthFilter) {
            const evMonth = ev.date.substring(0, 7);
            passMonth = (evMonth === monthFilter);
        }
        return passType && passMonth;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function loadAcademicCalendar() {
    let monthInput = document.getElementById('acCalMonthFilter');
    if (monthInput && !monthInput.value) {
        monthInput.value = new Date().toISOString().substring(0, 7);
    }

    // Check auto fetch once per year
    if (monthInput && monthInput.value) {
        const yStr = monthInput.value.split('-')[0];
        if (yStr && !holidaysFetchedYears[yStr]) {
            fetchPublicHolidays(true);
            holidaysFetchedYears[yStr] = true;
        }
    }

    if (currentCalendarView === 'grid') {
        renderCalendarGrid();
    } else {
        renderCalendarList();
    }
}

function renderCalendarList() {
    const container = document.getElementById('academicCalendarList');
    if (!container) return;

    const events = getCalendarEventsFiltered();

    if (events.length === 0) {
        container.innerHTML = '<div class="text-center py-10 text-slate-400">ไม่มีข้อมูล หรือ ไม่มีกำหนดการในเดือนนี้</div>';
        return;
    }

    container.innerHTML = events.map(ev => {
        let typeInfo = { color: 'blue', icon: 'fa-calendar', label: 'กิจกรรม' };
        if (ev.type === 'exam') typeInfo = { color: 'rose', icon: 'fa-pen-to-square', label: 'สอบ' };
        else if (ev.type === 'meeting') typeInfo = { color: 'amber', icon: 'fa-users', label: 'ประชุม' };
        else if (ev.type === 'holiday') typeInfo = { color: 'emerald', icon: 'fa-tree', label: 'วันหยุด' };

        const d = new Date(ev.date);
        const day = d.getDate();
        const monthShort = d.toLocaleDateString('th-TH', { month: 'short' });

        return `
        <div class="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition bg-white group animate-fade-in">
            <div class="shrink-0 w-16 h-16 bg-${typeInfo.color}-50 rounded-xl flex flex-col items-center justify-center border border-${typeInfo.color}-100">
                <span class="text-[10px] uppercase text-${typeInfo.color}-500 font-bold">${monthShort}</span>
                <span class="text-xl font-black leading-none mt-0.5 text-${typeInfo.color}-700">${day}</span>
            </div>
            <div class="flex-1 overflow-hidden">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] bg-${typeInfo.color}-100 text-${typeInfo.color}-700 px-2 py-0.5 rounded font-bold">${typeInfo.label}</span>
                    <h4 class="font-bold text-slate-800 text-base truncate">${ev.title}</h4>
                </div>
                <p class="text-xs text-slate-500 mb-2 truncate"><i class="fa-regular ${typeInfo.icon} mr-1"></i> ${ev.endDate ? `ถึง ${new Date(ev.endDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}` : d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} | ${ev.desc}</p>
            </div>
            <div class="flex sm:flex-col gap-2 justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button onclick="editAcCalendar(${ev.id})" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition flex items-center justify-center">
                    <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button onclick="deleteAcCalendar(${ev.id})" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center">
                    <i class="fa-solid fa-trash text-xs"></i>
                </button>
            </div>
        </div>`;
    }).join('');
}

function renderCalendarGrid() {
    const grid = document.getElementById('calendarDaysGrid');
    if (!grid) return;
    grid.innerHTML = '';

    let monthInput = document.getElementById('acCalMonthFilter')?.value;
    if (!monthInput) { monthInput = new Date().toISOString().substring(0, 7); }
    const [yearStr, monthStr] = monthInput.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    updatePlannerTitle(year, month);
    renderMiniCalendar(year, month);

    const d = new Date(yearStr, month - 1, 1);
    const lastDay = new Date(yearStr, month, 0).getDate();
    const startDayOfWeek = d.getDay(); // 0(Sun) to 6(Sat)

    const events = getCalendarEventsFiltered();
    let html = '';

    const weekdayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

    // Previous month blanks
    const prevMonthDays = new Date(yearStr, month - 1, 0).getDate();
    for (let i = 0; i < startDayOfWeek; i++) {
        const isFirstRow = true;
        const dayLabel = isFirstRow ? `<div class="text-[10px] font-bold text-slate-400 mb-2 uppercase">${weekdayNames[i]}</div>` : '';
        const prevDay = prevMonthDays - startDayOfWeek + i + 1;
        html += `<div class="min-h-[100px] md:min-h-[120px] bg-slate-50/30 border-r border-b border-slate-100 p-2 md:p-3 flex flex-col">
            ${dayLabel}
            <span class="text-lg md:text-xl font-bold text-slate-300 leading-none">${prevDay}</span>
        </div>`;
    }

    // Days
    for (let day = 1; day <= lastDay; day++) {
        const currentDateStr = `${yearStr}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(yearStr, month - 1, day).getDay();
        const isFirstRow = (day + startDayOfWeek) <= 7;
        const dayLabel = isFirstRow ? `<div class="text-[10px] font-bold text-slate-400 mb-2 uppercase">${weekdayNames[dayOfWeek]}</div>` : '';

        // Find events on this day
        const dayEvents = events.filter(ev => {
            if (!ev.endDate) return ev.date === currentDateStr;
            return currentDateStr >= ev.date && currentDateStr <= ev.endDate;
        });

        // Build events HTML
        let eventsHtml = '';
        const evCount = dayEvents.length;
        if (evCount > 0) {
            const maxShow = 2; // Only show up to 2 items so they can stretch
            const isSingle = (evCount === 1);
            const sizeClass = isSingle
                ? 'flex-1 text-[10px] md:text-xs p-1.5 md:p-2'
                : '1/2 h-1/2 flex-1 text-[9px] md:text-[10px] p-1';

            dayEvents.slice(0, maxShow).forEach(ev => {
                let dotColor = 'bg-sky-500';
                let textColor = 'text-sky-700';
                let bgColor = 'bg-[#e0f2fe]'; // light sky blue matched to image
                let extraClass = '';
                if (ev.type === 'exam') { dotColor = 'bg-purple-500'; textColor = 'text-purple-700'; bgColor = 'bg-purple-50'; }
                else if (ev.type === 'meeting') { dotColor = 'bg-amber-500'; textColor = 'text-amber-700'; bgColor = 'bg-amber-50'; }
                else if (ev.type === 'holiday') { dotColor = 'bg-white'; textColor = 'text-white'; bgColor = 'bg-rose-500'; extraClass = 'shadow-sm'; }

                eventsHtml += `<div onclick="toggleEventActionCard(event, ${ev.id})" class="${sizeClass} evt-clickable ${bgColor} ${textColor} ${extraClass} rounded cursor-pointer hover:opacity-80 font-bold leading-tight overflow-hidden flex flex-col relative" title="${ev.title}">
                    <div class="flex items-start gap-1 h-full">
                        <span class="w-1.5 h-1.5 ${dotColor} rounded-full flex-shrink-0 mt-1"></span>
                        <div class="flex-1 overflow-hidden h-full">
                            <div class="font-bold line-clamp-1 truncate block">${ev.title}</div>
                            ${isSingle && ev.desc && ev.desc !== ev.title ? `<div class="text-[9px] md:text-[10px] font-normal opacity-90 mt-0.5 line-clamp-2 leading-snug">${ev.desc}</div>` : ''}
                        </div>
                    </div>
                </div>`;
            });
            if (evCount > maxShow) {
                eventsHtml += `<div class="text-[9px] md:text-[10px] text-sky-600 font-bold px-1 py-0.5 cursor-pointer bg-sky-50 rounded shrink-0 mt-0.5 text-center transition hover:bg-sky-100" onclick="event.stopPropagation(); openAddAcCalendarModal('${currentDateStr}')">+${evCount - maxShow} events</div>`;
            }
        }

        const isToday = (currentDateStr === new Date().toLocaleString('sv').substring(0, 10));
        let numColor = isToday ? 'text-white' : ((dayOfWeek === 0 || dayOfWeek === 6) ? 'text-rose-600' : 'text-slate-800');
        let numBg = isToday ? 'bg-[#0ea5e9] w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center -ml-1 -mt-1' : '';

        // Weekend background tint
        let cellBgClass = 'bg-white';
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            cellBgClass = 'bg-rose-50/20'; // Very subtle red tint for weekends
        }

        // Holiday highlight
        const hasHoliday = dayEvents.some(e => e.type === 'holiday');
        if (hasHoliday) {
            cellBgClass = 'bg-rose-50/50 border-l-4 border-l-rose-500'; // Make holiday cells stand out
        }

        html += `
        <div onclick="openAddAcCalendarModal('${currentDateStr}')" class="min-h-[100px] md:min-h-[120px] border-r border-b border-slate-100 p-2 md:p-3 flex flex-col cursor-pointer hover:bg-slate-50 transition relative ${cellBgClass}">
            ${dayLabel}
            <div class="mb-2">
                <span class="text-lg md:text-xl font-bold ${numColor} ${numBg} leading-none inline-block">${day}</span>
            </div>
            <div class="flex-1 flex flex-col overflow-hidden gap-0.5">
                ${eventsHtml}
            </div>
        </div>`;
    }

    // Trailing blanks
    const totalCells = startDayOfWeek + lastDay;
    const trailing = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < trailing; i++) {
        const nextDay = i + 1;
        html += `<div class="min-h-[100px] md:min-h-[120px] bg-slate-50/30 border-r border-b border-slate-100 p-2 md:p-3 flex flex-col">
            <span class="text-lg md:text-xl font-bold text-slate-300 leading-none">${nextDay}</span>
        </div>`;
    }

    grid.innerHTML = html;
}

function updatePlannerTitle(year, month) {
    const monthNamesEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const titleStr = `${monthNamesEN[month - 1]} ${year}`;

    // Update newly injected HTML targets
    const mainTitleEl = document.getElementById('mainCalTitle');
    const miniTitleEl = document.getElementById('miniCalTitle');

    if (mainTitleEl) mainTitleEl.textContent = titleStr;
    if (miniTitleEl) miniTitleEl.textContent = titleStr;
}

function changeCalMonth(delta) {
    const input = document.getElementById('acCalMonthFilter');
    if (input) {
        let current = input.value;
        if (!current) current = new Date().toISOString().substring(0, 7);
        const [y, m] = current.split('-').map(Number);
        const newDate = new Date(y, m - 1 + delta, 1);
        input.value = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    }
    loadAcademicCalendar();
}

function fetchPublicHolidays(silent = false) {
    let monthInput = document.getElementById('acCalMonthFilter')?.value;
    if (!monthInput) monthInput = new Date().toISOString().substring(0, 7);
    const year = parseInt(monthInput.split('-')[0]);

    if (silent) {
        processHolidayFetch(year, true);
        return;
    }

    Swal.fire({
        title: `ดึงวันหยุดราชการ/ปี ${year}?`,
        text: "ระบบจะเชื่อมต่อ API เพื่อนำเข้าวันหยุดของประเทศไทยอัตโนมัติ",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        confirmButtonText: '<i class="fa-solid fa-cloud-arrow-down"></i> ดึงข้อมูล',
        cancelButtonText: 'ยกเลิก',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return processHolidayFetch(year, false);
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ icon: 'success', title: 'เสร็จสิ้น', text: `บันทึกข้อมูลวันหยุดเรียบร้อย`, confirmButtonColor: '#3b82f6' });
        }
    });
}

function processHolidayFetch(year, silent) {
    const fallbackHolidays = [
        { date: `${year}-01-01`, name: "New Year's Day", localName: "วันขึ้นปีใหม่" },
        { date: `${year}-02-12`, name: "Makha Bucha Day", localName: "วันมาฆบูชา" },
        { date: `${year}-04-06`, name: "Chakri Memorial Day", localName: "วันจักรี" },
        { date: `${year}-04-13`, name: "Songkran Festival", localName: "วันสงกรานต์" },
        { date: `${year}-04-14`, name: "Songkran Festival", localName: "วันสงกรานต์" },
        { date: `${year}-04-15`, name: "Songkran Festival", localName: "วันสงกรานต์" },
        { date: `${year}-05-01`, name: "National Labour Day", localName: "วันแรงงานแห่งชาติ" },
        { date: `${year}-05-04`, name: "Coronation Day", localName: "วันฉัตรมงคล" },
        { date: `${year}-05-11`, name: "Visakha Bucha Day", localName: "วันวิสาขบูชา" },
        { date: `${year}-06-03`, name: "HM Queen Suthida's Birthday", localName: "วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าสุทิดาฯ" },
        { date: `${year}-07-10`, name: "Asarnha Bucha Day", localName: "วันอาสาฬหบูชา" },
        { date: `${year}-07-11`, name: "Buddhist Lent Day", localName: "วันเข้าพรรษา" },
        { date: `${year}-07-28`, name: "HM King Maha Vajiralongkorn's Birthday", localName: "วันเฉลิมพระชนมพรรษา ร.10" },
        { date: `${year}-08-12`, name: "HM the Queen's Birthday", localName: "วันเฉลิมพระชนมพรรษา พระพันปีหลวง" },
        { date: `${year}-10-13`, name: "HM King Bhumibol Adulyadej Memorial Day", localName: "วันคล้ายวันสวรรคต ร.9" },
        { date: `${year}-10-23`, name: "Chulalongkorn Day", localName: "วันปิยมหาราช" },
        { date: `${year}-12-05`, name: "HM King Bhumibol Adulyadej's Birthday", localName: "วันคล้ายวันพระบรมราชสมภพ ร.9" },
        { date: `${year}-12-10`, name: "Constitution Day", localName: "วันรัฐธรรมนูญ" },
        { date: `${year}-12-31`, name: "New Year's Eve", localName: "วันสิ้นปี" }
    ];

    const fetchPromise = fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/TH`)
        .then(res => res.ok ? res.json() : [])
        .catch(() => []);

    return fetchPromise.then(apiHolidays => {
        // Merge API holidays with fallback to ensure no dropped dates (like lunar Buddhist holidays)
        const mergedHolidays = [...fallbackHolidays];
        apiHolidays.forEach(apiHol => {
            if (!mergedHolidays.find(f => f.date === apiHol.date)) {
                mergedHolidays.push(apiHol);
            }
        });

        let addedCount = 0;
        mergedHolidays.forEach(hol => {
            if (!mockAcademicCalendar.find(e => e.date === hol.date && (e.title === hol.localName || e.title === hol.name))) {
                const newId = (mockAcademicCalendar.length > 0) ? Math.max(...mockAcademicCalendar.map(x => x.id)) + 1 : 1;
                mockAcademicCalendar.push({
                    id: newId, title: hol.localName, date: hol.date, endDate: '', type: 'holiday', desc: hol.name
                });
                addedCount++;
            }
        });
        if (addedCount > 0) loadAcademicCalendar();
        return addedCount;
    });
}

function openAddAcCalendarModal(prefillDate = '') {
    Swal.fire({
        title: 'เพิ่มกิจกรรม/กำหนดการ',
        html: `
            <div class="text-left text-sm mt-3 space-y-3 p-1">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">ชื่อกิจกรรม</label>
                    <input type="text" id="evTitle" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="เช่น สอบกลางภาค...">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ประเภท</label>
                        <select id="evType" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="activity">กิจกรรม (ทั่วไป)</option>
                            <option value="exam">การสอบ (Exam)</option>
                            <option value="meeting">ประชุม (Meeting)</option>
                            <option value="holiday">วันหยุดราชการ (Holiday)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">วันที่เริ่มต้น</label>
                        <input type="date" id="evDate" value="${prefillDate}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">วันที่สิ้นสุด <span class="text-slate-400 font-normal">(ถ้ามี)</span></label>
                    <input type="date" id="evEndDate" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ความสำคัญ</label>
                        <select id="evPriority" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="normal" selected>ปกติ (Normal)</option>
                            <option value="high">สูง (High)</option>
                            <option value="low">ต่ำ (Low)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1 flex items-center gap-1">แจ้งเตือน <span class="text-[10px] text-green-600 bg-green-50 px-1 py-0.5 rounded font-bold"><i class="fa-brands fa-line"></i> Line OA</span></label>
                        <select id="evNotify" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green-100">
                            <option value="0">ไม่ต้องแจ้งเตือน</option>
                            <option value="1">ล่วงหน้า 1 วัน</option>
                            <option value="3">ล่วงหน้า 3 วัน</option>
                            <option value="7">ล่วงหน้า 7 วัน</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">รายละเอียด</label>
                    <input type="text" id="evDesc" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="สถานที่ห้องประชุม / หมายเหตุ...">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึกข้อมูล',
        confirmButtonColor: '#3b82f6',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const title = document.getElementById('evTitle').value;
            const type = document.getElementById('evType').value;
            const date = document.getElementById('evDate').value;
            const endDate = document.getElementById('evEndDate').value;
            const desc = document.getElementById('evDesc').value;
            const priority = document.getElementById('evPriority').value;
            const notify = document.getElementById('evNotify').value;

            if (!title || !date) {
                Swal.showValidationMessage('กรุณากรอกชื่อและวันที่เริ่มต้น');
                return false;
            }
            return { title, type, date, endDate, desc, priority, notify };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            const val = res.value;
            const newId = (mockAcademicCalendar.length > 0) ? Math.max(...mockAcademicCalendar.map(x => x.id)) + 1 : 1;
            mockAcademicCalendar.push({
                id: newId,
                title: val.title,
                type: val.type,
                date: val.date,
                endDate: val.endDate,
                desc: val.desc,
                priority: val.priority,
                notify: val.notify
            });
            loadAcademicCalendar();
            Swal.fire({ icon: 'success', title: 'สำเร็จ!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });
}

function deleteAcCalendar(id) {
    Swal.fire({
        title: 'ยืนยันการลบ?',
        text: 'เหตุการณ์นี้จะถูกลบออกจากปฏิทินอย่างถาวร',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ลบข้อมูล'
    }).then(res => {
        if (res.isConfirmed) {
            mockAcademicCalendar = mockAcademicCalendar.filter(x => x.id !== id);
            loadAcademicCalendar();
            Swal.fire({ icon: 'success', title: 'ลบสำเร็จ!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });
}

function editAcCalendar(id) {
    const ev = mockAcademicCalendar.find(x => x.id === id);
    if (!ev) return;

    Swal.fire({
        title: 'แก้ไขข้อมูล',
        html: `
            <div class="text-left text-sm mt-3 space-y-3 p-1">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">ชื่อกิจกรรม</label>
                    <input type="text" id="evTitleEdit" value="${ev.title}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ประเภท</label>
                        <select id="evTypeEdit" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="activity" ${ev.type === 'activity' ? 'selected' : ''}>กิจกรรม (ทั่วไป)</option>
                            <option value="exam" ${ev.type === 'exam' ? 'selected' : ''}>การสอบ (Exam)</option>
                            <option value="meeting" ${ev.type === 'meeting' ? 'selected' : ''}>ประชุม (Meeting)</option>
                            <option value="holiday" ${ev.type === 'holiday' ? 'selected' : ''}>วันหยุดราชการ (Holiday)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">วันที่เริ่มต้น</label>
                        <input type="date" id="evDateEdit" value="${ev.date}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">วันที่สิ้นสุด <span class="text-slate-400 font-normal">(ถ้ามี)</span></label>
                    <input type="date" id="evEndDateEdit" value="${ev.endDate}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ความสำคัญ</label>
                        <select id="evPriorityEdit" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="normal" ${!ev.priority || ev.priority === 'normal' ? 'selected' : ''}>ปกติ (Normal)</option>
                            <option value="high" ${ev.priority === 'high' ? 'selected' : ''}>สูง (High)</option>
                            <option value="low" ${ev.priority === 'low' ? 'selected' : ''}>ต่ำ (Low)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1 flex items-center gap-1">แจ้งเตือน <span class="text-[10px] text-green-600 bg-green-50 px-1 py-0.5 rounded font-bold"><i class="fa-brands fa-line"></i> Line OA</span></label>
                        <select id="evNotifyEdit" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green-100">
                            <option value="0" ${!ev.notify || ev.notify === '0' ? 'selected' : ''}>ไม่ต้องแจ้งเตือน</option>
                            <option value="1" ${ev.notify === '1' ? 'selected' : ''}>ล่วงหน้า 1 วัน</option>
                            <option value="3" ${ev.notify === '3' ? 'selected' : ''}>ล่วงหน้า 3 วัน</option>
                            <option value="7" ${ev.notify === '7' ? 'selected' : ''}>ล่วงหน้า 7 วัน</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">รายละเอียด</label>
                    <input type="text" id="evDescEdit" value="${ev.desc || ''}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> อัปเดตข้อมูล',
        confirmButtonColor: '#3b82f6',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const title = document.getElementById('evTitleEdit').value;
            const type = document.getElementById('evTypeEdit').value;
            const date = document.getElementById('evDateEdit').value;
            const endDate = document.getElementById('evEndDateEdit').value;
            const desc = document.getElementById('evDescEdit').value;
            const priority = document.getElementById('evPriorityEdit').value;
            const notify = document.getElementById('evNotifyEdit').value;

            if (!title || !date) {
                Swal.showValidationMessage('กรุณากรอกชื่อและวันที่เริ่มต้น');
                return false;
            }
            return { title, type, date, endDate, desc, priority, notify };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            const val = res.value;
            const idx = mockAcademicCalendar.findIndex(x => x.id === id);
            if (idx !== -1) {
                mockAcademicCalendar[idx] = {
                    id: id,
                    title: val.title,
                    type: val.type,
                    date: val.date,
                    endDate: val.endDate,
                    desc: val.desc,
                    priority: val.priority,
                    notify: val.notify
                };
            }
            loadAcademicCalendar();
            Swal.fire({ icon: 'success', title: 'แก้ไขสำเร็จ!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });
}

// ==========================================
// ACADEMIC SUBSYSTEM LOGIC
// ==========================================

function openAcademicSubsystem(type) {
    const views = ['assignment', 'schedule', 'attendance', 'evaluation', 'exams', 'curriculum', 'supervision'];
    const dashboard = document.getElementById('academic-dashboard-view');
    if (dashboard) dashboard.classList.add('hidden');

    views.forEach(v => {
        const el = document.getElementById('academic-' + v + '-view');
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById('academic-' + type + '-view');
    if (target) {
        target.classList.remove('hidden');
    }

    // Call specific render functions if needed
    if (type === 'assignment') {
        if (typeof loadPendingApprovals === 'function') loadPendingApprovals();
    } else if (type === 'schedule') {
        if (typeof renderScheduleGrid === 'function') renderScheduleGrid();
    } else if (type === 'curriculum') {
        // init curriculum
    } else if (type === 'attendance') {
        // init attendance
    } else if (type === 'evaluation') {
        // init evaluation
    } else if (type === 'exams') {
        // init exams
    } else if (type === 'supervision') {
        // init supervision
    }
}

function closeAcademicSubsystem() {
    const views = ['assignment', 'schedule', 'attendance', 'evaluation', 'exams', 'curriculum', 'supervision'];
    views.forEach(v => {
        const el = document.getElementById('academic-' + v + '-view');
        if (el) el.classList.add('hidden');
    });
    const dashboard = document.getElementById('academic-dashboard-view');
    if (dashboard) dashboard.classList.remove('hidden');

    // Refresh main planner if applicable
    if (typeof loadAcademicCalendar === 'function') loadAcademicCalendar();
}

// Mock Data for Academic Subsystems
// Mock Data for Academic Subsystems
let mockAcademicAssignments = [
    { id: 1, type: 'AC_PLAN', title: 'แผนการจัดการเรียนรู้ ม.1', docId: 'PLN-2567-001', sender: 'นางสมศรี ใจดี', date: '2024-05-10', status: 'pending', year: '2567', term: '1' },
    { id: 2, type: 'AC_RESEARCH', title: 'วิจัยในชั้นเรียน วิทยาศาสตร์', docId: 'RS-2567-042', sender: 'นายทองดี มีชัย', date: '2024-05-12', status: 'pending', year: '2567', term: '1' },
    { id: 3, type: 'AC_RECORD', title: 'บันทึกหลังสอน สัปดาห์ที่ 4', docId: 'RC-2567-088', sender: 'คุณครู สมหมาย', date: '2024-05-15', status: 'approved', note: 'ครบถ้วนสมบูรณ์', year: '2567', term: '1' },
    { id: 4, type: 'AC_PLAN', title: 'แผนการสอน สังคม ม.3', docId: 'PLN-2567-012', sender: 'นางวิไล ถนอม', date: '2024-05-08', status: 'rejected', note: 'โปรดแก้ไขตัวชี้วัด', year: '2567', term: '1' }
];
let mockAcademicCurriculum = [];
let mockAcademicExams = [];

// ==========================================
// ACADEMIC INTERACTIVE LOGIC (ASSIGNMENT)
// ==========================================

let currentAssignmentTab = 'pending';

function switchTab(tabName) {
    currentAssignmentTab = tabName;
    ['pending', 'history', 'dashboard'].forEach(t => {
        const btn = document.getElementById('btn-tab-' + t);
        const view = document.getElementById('view-' + t);
        if (btn) {
            if (t === tabName) {
                btn.className = 'tab-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white text-sky-600 shadow-sm whitespace-nowrap';
            } else {
                btn.className = 'tab-btn flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 transition-all whitespace-nowrap';
            }
        }
        if (view) {
            if (t === tabName) {
                view.classList.remove('hidden');
                view.classList.add('block');
            } else {
                view.classList.remove('block');
                view.classList.add('hidden');
            }
        }
    });

    if (tabName === 'dashboard') {
        updateAssignmentDashboard();
    } else {
        filterDocs();
    }
}

function getTypeInfo(type) {
    if (type === 'AC_PLAN') return { icon: '<i class="fa-solid fa-book-open"></i>', color: 'text-blue-600', bg: 'bg-blue-100', label: 'แผนการสอน' };
    if (type === 'AC_RESEARCH') return { icon: '<i class="fa-solid fa-microscope"></i>', color: 'text-purple-600', bg: 'bg-purple-100', label: 'งานวิจัย' };
    if (type === 'AC_RECORD') return { icon: '<i class="fa-solid fa-clipboard-check"></i>', color: 'text-orange-600', bg: 'bg-orange-100', label: 'บันทึกสอน' };
    return { icon: '<i class="fa-solid fa-file"></i>', color: 'text-slate-600', bg: 'bg-slate-100', label: 'เอกสาร' };
}

function loadPendingApprovals() {
    filterDocs();

    // Update badges
    const pendingCount = mockAcademicAssignments.filter(a => a.status === 'pending').length;
    const historyCount = mockAcademicAssignments.filter(a => a.status !== 'pending').length;

    const pBadge = document.getElementById('badge-pending');
    if (pBadge) { pBadge.textContent = pendingCount; pBadge.classList.toggle('hidden', pendingCount === 0); }

    const hBadge = document.getElementById('badge-history');
    if (hBadge) { hBadge.textContent = historyCount; hBadge.classList.toggle('hidden', historyCount === 0); }
}

function filterDocs() {
    const yearFilter = document.getElementById('filterYear')?.value || 'All';
    const termFilter = document.getElementById('filterTerm')?.value || 'All';
    const searchStr = (document.getElementById('searchInput')?.value || '').toLowerCase();

    let filtered = mockAcademicAssignments.filter(item => {
        let matchYear = (yearFilter === 'All' || item.year === yearFilter);
        let matchTerm = (termFilter === 'All' || item.term === termFilter);
        let matchSearch = item.title.toLowerCase().includes(searchStr) || item.sender.toLowerCase().includes(searchStr);
        let matchTab = currentAssignmentTab === 'pending' ? item.status === 'pending' : item.status !== 'pending';
        return matchYear && matchTerm && matchSearch && matchTab;
    });

    renderAssignmentList(filtered, currentAssignmentTab);
}

function renderAssignmentList(items, tab) {
    const container = document.getElementById(tab === 'pending' ? 'list-pending' : 'list-history');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-slate-400 text-sm">ไม่มีข้อมูลในหมวดหมู่นี้</div>`;
        return;
    }

    let html = '';
    items.forEach(item => {
        const typeInfo = getTypeInfo(item.type);

        let statusBadge = '';
        if (item.status === 'pending') statusBadge = '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold">รอตรวจ</span>';
        else if (item.status === 'approved') statusBadge = '<span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold">ผ่าน</span>';
        else if (item.status === 'rejected') statusBadge = '<span class="px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold">แก้ไข</span>';

        if (tab === 'pending') {
            html += `
            <div class="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-slate-50 hover:bg-slate-50 transition text-sm">
                <div class="col-span-2 hidden md:block text-slate-500 text-xs">${item.year}/${item.term}</div>
                <div class="col-span-3 md:col-span-2 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full ${typeInfo.bg} ${typeInfo.color} flex items-center justify-center text-xs flex-shrink-0">${typeInfo.icon}</div>
                    <span class="text-xs font-bold text-slate-700 truncate hidden sm:block">${typeInfo.label}</span>
                </div>
                <div class="col-span-4 md:col-span-3">
                    <p class="font-bold text-sky-700 truncate text-xs sm:text-sm">${item.title}</p>
                    <p class="text-[10px] text-slate-400 truncate">${item.docId} | ${item.date}</p>
                </div>
                <div class="col-span-3 md:col-span-2 text-center text-slate-600 text-xs truncate">${item.sender}</div>
                <div class="col-span-2 text-center hidden md:block">${statusBadge}</div>
                <div class="col-span-2 text-center md:col-span-1 flex justify-center">
                    <button class="bg-sky-50 hover:bg-sky-100 text-sky-600 px-3 py-1.5 rounded-lg text-xs font-bold transition">ตรวจ</button>
                </div>
            </div>`;
        } else {
            html += `
            <div class="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-slate-50 hover:bg-slate-50 transition text-sm">
                <div class="col-span-2 hidden md:block text-slate-500 text-xs">${item.year}/${item.term}</div>
                <div class="col-span-3 md:col-span-2 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full ${typeInfo.bg} ${typeInfo.color} flex items-center justify-center text-xs flex-shrink-0">${typeInfo.icon}</div>
                </div>
                <div class="col-span-4 md:col-span-3">
                    <p class="font-bold text-slate-700 truncate text-xs sm:text-sm">${item.title}</p>
                    <p class="text-[10px] text-slate-400 truncate">${item.date}</p>
                </div>
                <div class="col-span-3 md:col-span-2 text-center text-slate-600 text-xs truncate">${item.sender}</div>
                <div class="col-span-2 text-center hidden md:block text-[10px] text-slate-500">${item.note || '-'}</div>
                <div class="col-span-2 text-center md:col-span-1">${statusBadge}</div>
            </div>`;
        }
    });

    container.innerHTML = html;
}

function updateAssignmentDashboard() {
    const elApp = document.getElementById('stat-approved');
    const elPen = document.getElementById('stat-pending');
    const elRej = document.getElementById('stat-reject');

    if (elApp) elApp.textContent = mockAcademicAssignments.filter(a => a.status === 'approved').length;
    if (elPen) elPen.textContent = mockAcademicAssignments.filter(a => a.status === 'pending').length;
    if (elRej) elRej.textContent = mockAcademicAssignments.filter(a => a.status === 'rejected').length;
}

// ==========================================
// ACADEMIC INTERACTIVE LOGIC (SCHEDULE)
// ==========================================

function openScheduleSetupModal() {
    Swal.fire({
        title: 'จัดตารางสอนอัตโนมัติ',
        html: `
            <div class="text-left text-sm mt-2 text-slate-600 space-y-3">
                <p>ระบบจะทำการคำนวณและจัดตารางสอนให้กับบุคลากรทั้งหมด <b>45 ท่าน</b> สำหรับ <b>24 ห้องเรียน</b> ตามโครงสร้างหลักสูตร</p>
                <div class="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i> <b>ข้อควรระวัง:</b> ตารางสอนเดิมของภาคเรียนนี้อาจถูกเขียนทับ
                </div>
            </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-wand-magic-sparkles mr-1"></i> เริ่มจัดตาราง',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#4f46e5'
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire({
                title: 'กำลังคำนวณตารางสอน...',
                html: 'ประมวลผลเงื่อนไขรายวิชาและเวลาว่างของครู',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                }
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'จัดตารางสอนสำเร็จ',
                    text: 'ตารางสอน 850 คาบ ถูกจัดวางสมบูรณ์และไม่มีการชนเวลา'
                });
            });
        }
    });
}

function openAddSubjectModal() {
    Swal.fire({
        title: 'เพิ่มรายวิชาในหลักสูตร',
        html: `
            <div class="text-left text-sm mt-3 space-y-3 px-1">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">รหัสวิชา</label>
                    <input type="text" id="swalSubjectCode" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-200" placeholder="เช่น ค21101">
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">ชื่อรายวิชา</label>
                    <input type="text" id="swalSubjectName" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-200" placeholder="เช่น คณิตศาสตร์ 1">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ประเภท</label>
                        <select id="swalSubjectType" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-200">
                            <option value="พื้นฐาน">รายวิชาพื้นฐาน</option>
                            <option value="เพิ่มเติม">รายวิชาเพิ่มเติม</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">หน่วยกิต</label>
                        <input type="number" id="swalSubjectCredit" step="0.5" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-200" value="1.0">
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'บันทึกรายวิชา',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const code = document.getElementById('swalSubjectCode').value;
            const name = document.getElementById('swalSubjectName').value;
            if (!code || !name) Swal.showValidationMessage('กรุณากรอกรหัสและชื่อวิชาให้ครบถ้วน');
            return { code, name };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire({ icon: 'success', title: 'เพิ่มรายวิชาเรียบร้อย', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });
}

function submitAttendance() {
    Swal.fire({
        icon: 'question',
        title: 'ยืนยันบันทึกการเข้าเรียน?',
        text: 'การตรวจสอบเวลาเรียนคาบนี้ถือว่าเสร็จสิ้น',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: 'ข้อมูลการเข้าเรียนถูกจัดเก็บในระบบแล้ว', confirmButtonColor: '#e11d48' });
        }
    });
}

function processUpload() {
    closeUploadModal();
    Swal.fire({
        icon: 'success',
        title: 'ส่งงานเรียบร้อย!',
        text: 'ภาระงานของคุณถูกส่งเข้าระบบตรวจรับงานวิชาการแล้ว',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#2563eb'
    });
}

function renderScheduleGrid() {
    const grid = document.getElementById('scheduleGrid');
    if (!grid) return;

    // Create a mock grid for schedule (mostly view-only html)
    let gridHtml = `
    <div class="grid grid-cols-[80px_1fr] border border-slate-200 rounded-xl overflow-hidden text-sm min-w-[800px]">
        <div class="bg-slate-50 font-bold text-slate-500 p-3 text-center border-r border-b border-slate-200">&nbsp;</div>
        <div class="grid grid-cols-8 bg-slate-50 border-b border-slate-200">
            ${[1, 2, 3, 4, 5, 6, 7, 8].map(i =>
        '<div class="p-3 text-center border-r border-slate-200 font-bold text-slate-600 last:border-r-0 text-xs flex flex-col items-center justify-center">คาบ ' + i + '<div class="text-[9px] text-slate-400 font-normal mt-0.5">08:30 - 09:20</div></div>'
    ).join('')}
        </div>
    `;

    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
    days.forEach((day, idx) => {
        gridHtml += `
        <div class="bg-slate-50 font-bold text-slate-700 p-3 flex flex-col items-center justify-center border-r border-b border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">${day}</div>
        <div class="grid grid-cols-8 border-b border-slate-200 group hover:bg-slate-50/50 transition duration-150 relative">
            ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => {
            // mock some lessons
            if (idx === 0 && i === 1) return '<div class="p-2 border-r border-slate-100 last:border-r-0"><div class="h-full bg-blue-50 border border-blue-200 rounded-lg p-2 text-center text-xs text-blue-800 hover:bg-blue-100 cursor-pointer transition"><p class="font-bold">ค21101</p><p class="text-[10px] text-blue-600 truncate">ม.1/1</p></div></div>';
            if (idx === 0 && i === 2) return '<div class="p-2 border-r border-slate-100 last:border-r-0"><div class="h-full bg-blue-50 border border-blue-200 rounded-lg p-2 text-center text-xs text-blue-800 hover:bg-blue-100 cursor-pointer transition"><p class="font-bold">ค21101</p><p class="text-[10px] text-blue-600 truncate">ม.1/1</p></div></div>';
            if (idx === 1 && i === 4) return '<div class="p-2 border-r border-slate-100 last:border-r-0"><div class="h-full bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center text-xs text-emerald-800 hover:bg-emerald-100 cursor-pointer transition"><p class="font-bold">ว21101</p><p class="text-[10px] text-emerald-600 truncate">ม.1/1</p></div></div>';
            if (idx === 2 && i === 6) return '<div class="p-2 border-r border-slate-100 last:border-r-0"><div class="h-full bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-xs text-amber-800 hover:bg-amber-100 cursor-pointer transition"><p class="font-bold">ส21101</p><p class="text-[10px] text-amber-600 truncate">ม.1/1</p></div></div>';
            if (idx === 4 && i === 7) return '<div class="p-2 border-r border-slate-100 last:border-r-0"><div class="h-full bg-rose-50 border border-rose-200 rounded-lg p-2 text-center text-xs text-rose-800 hover:bg-rose-100 cursor-pointer transition"><p class="font-bold">ลูกเสือ</p><p class="text-[10px] text-rose-600 truncate">ม.1/1</p></div></div>';

            return '<div class="p-2 border-r border-slate-100 last:border-r-0"></div>';
        }).join('')}
        </div>
        `;
    });

    gridHtml += '</div>';
    grid.innerHTML = gridHtml;
}

// ==========================================
// BUDGET SUBSYSTEM LOGIC
// ==========================================

function openBudgetSubsystem(type) {
    const views = ['planning', 'finance', 'procurement', 'audit'];
    document.getElementById('budget-dashboard-view').classList.add('hidden');
    views.forEach(v => {
        const el = document.getElementById('budget-' + v + '-view');
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById('budget-' + type + '-view');
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-fade-in');

        // Load specific data based on type
        if (type === 'planning') renderBudgetPlanning();
        if (type === 'finance') renderBudgetFinance();
        if (type === 'procurement') renderBudgetProcurement();
        if (type === 'audit') renderBudgetAudit();
    }
}

function closeBudgetSubsystem() {
    const views = ['planning', 'finance', 'procurement', 'audit'];
    views.forEach(v => {
        const el = document.getElementById('budget-' + v + '-view');
        if (el) el.classList.add('hidden');
    });
    const dashboard = document.getElementById('budget-dashboard-view');
    if (dashboard) {
        dashboard.classList.remove('hidden');
        dashboard.classList.add('animate-fade-in');
    }
}

// --- MOCK DATA ---
let mockBudgetProjects = [
    { id: 'PJ001', name: 'โครงการปรับปรุงห้องคอมพิวเตอร์', owner: 'ครูสมปอง', amount: 150000, status: 'approved' },
    { id: 'PJ002', name: 'โครงการจัดซื้อหนังสือห้องสมุด', owner: 'ครูสมหญิง', amount: 30000, status: 'pending' },
    { id: 'PJ003', name: 'โครงการกีฬาสีประจำปี', owner: 'ครูสมชาย', amount: 80000, status: 'rejected' }
];

let mockBudgetLedger = [
    { date: '2026-03-01', type: 'income', detail: 'เงินอุดหนุนรายหัว', ref: 'REC-69001', amount: 500000, balance: 500000 },
    { date: '2026-03-05', type: 'expense', detail: 'จ่ายค่าวัสดุสำนักงาน', ref: 'PAY-69001', amount: 15000, balance: 485000 },
    { date: '2026-03-08', type: 'income', detail: 'ค่าบำรุงการศึกษา', ref: 'REC-69002', amount: 120000, balance: 605000 }
];

let mockProcurements = [
    { id: 'PR69-001', item: 'กระดาษ A4 100 ริม', date: '2026-03-02', amount: 12000, status: 'completed' },
    { id: 'PR69-002', item: 'คอมพิวเตอร์ตั้งโต๊ะ 5 เครื่อง', date: '2026-03-06', amount: 100000, status: 'processing' },
    { id: 'PR69-003', item: 'ซ่อมแซมหลังคาอาคาร 2', date: '2026-03-07', amount: 45000, status: 'pending' }
];

let mockDonations = [
    { date: '2026-02-15', donor: 'ศิษย์เก่า รุ่น 45', amount: 50000, purpose: 'ทุนการศึกษา', receipt: 'issued' },
    { date: '2026-03-01', donor: 'บจก. ใจดี การช่าง', amount: 20000, purpose: 'ซ่อมแซมโรงอาหาร', receipt: 'issued' },
    { date: '2026-03-08', donor: 'ผู้ปกครอง ด.ช. รักเรียน', amount: 5000, purpose: 'ทั่วไป', receipt: 'pending' }
];

// --- RENDER FUNCTIONS ---
function renderBudgetPlanning() {
    const tbody = document.getElementById('budget-planning-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    mockBudgetProjects.forEach(pj => {
        let statusBadge = '';
        if (pj.status === 'approved') statusBadge = '<span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">อนุมัติแล้ว</span>';
        else if (pj.status === 'pending') statusBadge = '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">รอพิจารณา</span>';
        else statusBadge = '<span class="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">ไม่อนุมัติ</span>';

        tbody.innerHTML += `
        < tr class="hover:bg-slate-50 border-b border-slate-100" >
                <td class="p-3 text-sm text-slate-700">${pj.id}</td>
                <td class="p-3 text-sm font-medium text-slate-800">${pj.name}</td>
                <td class="p-3 text-sm text-slate-600">${pj.owner}</td>
                <td class="p-3 text-sm text-right text-slate-700 font-medium">${pj.amount.toLocaleString()} ฿</td>
                <td class="p-3 text-sm text-center">${statusBadge}</td>
                <td class="p-3 text-sm text-center">
                    <button class="text-blue-600 hover:text-blue-800 p-1"><i class="fa-solid fa-file-lines"></i></button>
                    ${pj.status === 'pending' ? `<button class="text-slate-400 hover:text-rose-600 p-1 ml-1" onclick="deleteBudgetProject('${pj.id}')"><i class="fa-solid fa-trash"></i></button>` : ''}
                </td>
            </tr >
        `;
    });
}

function renderBudgetFinance() {
    const tbody = document.getElementById('budget-finance-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    mockBudgetLedger.forEach(lg => {
        const isInc = lg.type === 'income';
        const typeBadge = isInc
            ? '<span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-medium text-xs"><i class="fa-solid fa-arrow-down mr-1"></i> รายรับ</span>'
            : '<span class="px-2 py-1 bg-rose-100 text-rose-700 rounded font-medium text-xs"><i class="fa-solid fa-arrow-up mr-1"></i> รายจ่าย</span>';
        const amountClass = isInc ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';
        const amountPrefix = isInc ? '+' : '-';

        tbody.innerHTML += `
        < tr class="hover:bg-slate-50 border-b border-slate-100" >
                <td class="p-3 text-sm text-slate-600">${lg.date}</td>
                <td class="p-3 text-sm">${typeBadge}</td>
                <td class="p-3 text-sm text-slate-800">${lg.detail} <div class="text-[10px] text-slate-400">Ref: ${lg.ref}</div></td>
                <td class="p-3 text-sm text-right ${amountClass}">${amountPrefix}${lg.amount.toLocaleString()} ฿</td>
                <td class="p-3 text-sm text-right text-slate-700 font-bold">${lg.balance.toLocaleString()} ฿</td>
            </tr >
        `;
    });
}

function renderBudgetProcurement() {
    const tbody = document.getElementById('budget-procurement-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    mockProcurements.forEach(pr => {
        let statusBadge = '';
        if (pr.status === 'completed') statusBadge = '<span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">เสร็จสิ้น (รับของ)</span>';
        else if (pr.status === 'processing') statusBadge = '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">กำลังดำเนินการ</span>';
        else statusBadge = '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">รออนุมัติจัดซื้อ</span>';

        tbody.innerHTML += `
        < tr class="hover:bg-slate-50 border-b border-slate-100" >
                <td class="p-3 text-sm font-medium text-slate-700">${pr.id}</td>
                <td class="p-3 text-sm text-slate-800">${pr.item}</td>
                <td class="p-3 text-sm text-slate-600">${pr.date}</td>
                <td class="p-3 text-sm text-right text-slate-700">${pr.amount.toLocaleString()} ฿</td>
                <td class="p-3 text-sm text-center">${statusBadge}</td>
                <td class="p-3 text-sm text-center">
                    <button class="text-blue-600 hover:text-blue-800 p-1"><i class="fa-solid fa-print"></i></button>
                    ${pr.status === 'processing' ? `<button class="text-emerald-600 hover:text-emerald-800 p-1 ml-1" title="ตรวจรับพัสดุ"><i class="fa-solid fa-box-open"></i></button>` : ''}
                </td>
            </tr >
        `;
    });
}

function renderBudgetAudit() {
    const list = document.getElementById('budget-donation-list');
    if (!list) return;
    list.innerHTML = '';
    mockDonations.forEach((dn) => {
        const rcColor = dn.receipt === 'issued' ? 'emerald' : 'amber';
        const rcText = dn.receipt === 'issued' ? '+' + dn.amount.toLocaleString() : 'รอออกใบเสร็จ';

        list.innerHTML += `
        < div class="flex items-center justify-between border-b border-slate-100 pb-3" >
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 text-sm">${dn.donor}</p>
                        <p class="text-[10px] text-slate-500">${dn.date} • ${dn.purpose}</p>
                    </div>
                </div>
                <p class="font-bold text-${rcColor}-600 text-sm">${rcText}</p>
            </div >
        `;
    });
}

// --- INTERACTION FUNCTIONS ---
function requestBudget() {
    Swal.fire({
        title: 'เสนอโครงการ/ขอรับจัดสรรงบ',
        html: `
        < div class="space-y-3 text-left" >
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">ชื่อโครงการ</label>
                    <input type="text" id="swal-pj-name" class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="ระบุชื่อโครงการ">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">ผู้รับผิดชอบ</label>
                    <input type="text" id="swal-pj-owner" class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" value="${typeof currentUser !== 'undefined' && currentUser ? currentUser.name : ''}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">จำนวนงบประมาณที่ขอ (บาท)</label>
                    <input type="number" id="swal-pj-amount" class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="ตัวอย่าง: 50000">
                </div>
            </div >
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-paper-plane"></i> ส่งคำขอ',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const name = document.getElementById('swal-pj-name').value;
            const owner = document.getElementById('swal-pj-owner').value;
            const amount = document.getElementById('swal-pj-amount').value;
            if (!name || !amount) {
                Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            }
            return { name, owner, amount: parseInt(amount) };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const id = 'PJ' + Math.floor(100 + Math.random() * 900);
            mockBudgetProjects.unshift({
                id: id,
                name: result.value.name,
                owner: result.value.owner,
                amount: result.value.amount,
                status: 'pending'
            });
            renderBudgetPlanning();
            Swal.fire('สำเร็จ!', 'ส่งคำขอรับการจัดสรรเรียบร้อยแล้ว', 'success');
        }
    });
}

function deleteBudgetProject(id) {
    Swal.fire({
        title: 'ยืนยันการลบ?',
        text: 'ต้องการลบคำขอโครงการนี้ใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e11d48',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            mockBudgetProjects = mockBudgetProjects.filter(p => p.id !== id);
            renderBudgetPlanning();
            Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });
}

function addFinanceRecord() {
    Swal.fire({
        title: 'บันทึก รับ/จ่าย เงิน',
        html: `
        < div class="space-y-3 text-left mt-2" >
                <div class="grid grid-cols-2 gap-3">
                    <button type="button" id="btnRecIncome" class="w-full py-2 border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-bold rounded-lg" onclick="document.getElementById('swal-fin-type').value='income'; this.classList.add('border-emerald-500','bg-emerald-50','text-emerald-700'); this.classList.remove('border-slate-200','text-slate-500'); document.getElementById('btnRecExpense').classList.remove('border-rose-500','bg-rose-50','text-rose-700'); document.getElementById('btnRecExpense').classList.add('border-slate-200','text-slate-500');">รายรับ</button>
                    <button type="button" id="btnRecExpense" class="w-full py-2 border-2 border-slate-200 text-slate-500 font-bold rounded-lg" onclick="document.getElementById('swal-fin-type').value='expense'; this.classList.add('border-rose-500','bg-rose-50','text-rose-700'); this.classList.remove('border-slate-200','text-slate-500'); document.getElementById('btnRecIncome').classList.remove('border-emerald-500','bg-emerald-50','text-emerald-700'); document.getElementById('btnRecIncome').classList.add('border-slate-200','text-slate-500');">รายจ่าย</button>
                    <input type="hidden" id="swal-fin-type" value="income">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">รายการ</label>
                    <input type="text" id="swal-fin-detail" class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200" placeholder="เช่น ค่าวัสดุ, ค่าบำรุง">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">จำนวนเงิน (บาท)</label>
                    <input type="number" id="swal-fin-amount" class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200" placeholder="0.00">
                </div>
            </div >
        `,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const type = document.getElementById('swal-fin-type').value;
            const detail = document.getElementById('swal-fin-detail').value;
            const amount = parseFloat(document.getElementById('swal-fin-amount').value);
            if (!detail || !amount) Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            return { type, detail, amount };
        }
    }).then(result => {
        if (result.isConfirmed) {
            const val = result.value;
            const lastBalance = mockBudgetLedger.length > 0 ? mockBudgetLedger[mockBudgetLedger.length - 1].balance : 0;
            const newBalance = val.type === 'income' ? lastBalance + val.amount : lastBalance - val.amount;
            const ref = (val.type === 'income' ? 'REC-' : 'PAY-') + Math.floor(10000 + Math.random() * 90000);

            mockBudgetLedger.push({
                date: new Date().toISOString().split('T')[0],
                type: val.type,
                detail: val.detail,
                ref: ref,
                amount: val.amount,
                balance: newBalance
            });
            renderBudgetFinance();
            Swal.fire({ icon: 'success', title: 'บันทึกบัญชีเรียบร้อย', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });
}

function addProcurement() {
    Swal.fire({
        title: 'สร้างรายการจัดซื้อจัดจ้าง',
        html: `
        < div class="space-y-3 text-left mt-2 px-1" >
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">รายการพัสดุ/รายการจ้าง</label>
                    <input type="text" id="swal-pr-item" class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200" placeholder="ชื่อวัสดุ หรือโครงการ">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">วงเงินที่คาดว่าจะซื้อ/จ้าง (บาท)</label>
                    <input type="number" id="swal-pr-amount" class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200" placeholder="0.00">
                </div>
            </div >
        `,
        showCancelButton: true,
        confirmButtonText: 'สร้างรายการ',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const item = document.getElementById('swal-pr-item').value;
            const amount = parseFloat(document.getElementById('swal-pr-amount').value);
            if (!item || !amount) Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
            return { item, amount };
        }
    }).then(res => {
        if (res.isConfirmed) {
            const id = 'PR69-' + Math.floor(100 + Math.random() * 900);
            mockProcurements.unshift({
                id: id,
                item: res.value.item,
                amount: res.value.amount,
                date: new Date().toISOString().split('T')[0],
                status: 'pending'
            });
            renderBudgetProcurement();
            Swal.fire({ icon: 'success', title: 'สร้างรายการสำเร็จ!', text: 'รายการถูกส่งเข้าสู่กระบวนการพัสดุแล้ว' });
        }
    });
}

function openAuditReport() {
    Swal.fire({
        title: 'สรุปรายงานการตรวจสอบภายใน',
        html: `
        < div class="text-left text-sm text-slate-600 mt-2 space-y-2" >
                <p>ผลการตรวจสอบประจำไตรมาสที่ 1/2569</p>
                <div class="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                    <i class="fa-solid fa-check-circle mr-2"></i> การเบิกจ่ายงบประมาณเป็นไปตามระเบียบ 100%
                </div>
                <div class="p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                    <i class="fa-solid fa-info-circle mr-2"></i> การจัดทำทะเบียนคุมทรัพย์สินครบถ้วนสมบูรณ์
                </div>
                <div class="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100">
                    <i class="fa-solid fa-exclamation-triangle mr-2"></i> ข้อเสนอแนะ: ควรเร่งรัดการเบิกจ่ายงบเรียนฟรี 15 ปี
                </div>
            </div >
        `,
        confirmButtonText: 'ปิด'
    });
}

function renderMiniCalendar(yearNum, monthNum) {
    const miniGrid = document.getElementById('miniCalendarGrid');
    const eventList = document.getElementById('leftEventList');
    if (!miniGrid || !eventList) return;

    let year, month;
    if (yearNum && monthNum) {
        year = yearNum;
        month = monthNum;
    } else {
        const d = new Date();
        year = d.getFullYear();
        month = d.getMonth() + 1;
    }

    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDay = new Date(year, month, 0).getDate();
    const todayStr = new Date().toLocaleString('sv').substring(0, 10);

    let gridHtml = '';

    // blanks
    for (let i = 0; i < firstDay; i++) {
        gridHtml += `<div class="p-1"></div>`;
    }

    // days
    for (let d = 1; d <= lastDay; d++) {
        const dtStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month - 1, d).getDay();
        const isToday = (dtStr === todayStr);
        const hasEv = mockAcademicCalendar.some(ev => (ev.endDate && dtStr >= ev.date && dtStr <= ev.endDate) || (!ev.endDate && ev.date === dtStr));
        const hasHoliday = mockAcademicCalendar.some(ev => ev.type === 'holiday' && ((ev.endDate && dtStr >= ev.date && dtStr <= ev.endDate) || (!ev.endDate && ev.date === dtStr)));

        let classes = 'w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded-full mx-auto cursor-pointer hover:bg-slate-100 transition';
        if (isToday) {
            classes += ' bg-[#0ea5e9] text-white hover:bg-sky-600 shadow-sm';
        } else if (hasHoliday) {
            classes += ' bg-rose-500 text-white hover:bg-rose-600 shadow-sm z-10 relative';
        } else if (hasEv) {
            classes += ' bg-slate-100 text-slate-800';
        } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            classes += ' text-rose-600 bg-rose-50/30'; // red tone for weekends
        } else {
            classes += ' text-slate-600';
        }

        gridHtml += `<div><div class="${classes}">${d}</div></div>`;
    }

    miniGrid.innerHTML = gridHtml;

    // Build sidebar event list
    const monthEvents = getCalendarEventsFiltered();

    // Group events by date
    const eventsByDate = {};
    monthEvents.forEach(ev => {
        const dStr = ev.date; // simplified ignoring ranges for left panel overview
        if (!eventsByDate[dStr]) eventsByDate[dStr] = [];
        eventsByDate[dStr].push(ev);
    });

    if (Object.keys(eventsByDate).length === 0) {
        eventList.innerHTML = `<div class="text-sm text-slate-500">No events</div>`;
        return;
    }

    let listHtml = '';
    Object.keys(eventsByDate).sort().forEach(dateStr => {
        const [y, m, d] = dateStr.split('-');
        const monthNamesEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formatTitle = `${monthNamesEN[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;

        listHtml += `
        <div class="mb-4">
            <h4 class="text-xs font-bold text-teal-700 mb-2">${formatTitle}</h4>
            <div class="space-y-3 pl-2 border-l-2 border-slate-100 ml-1">
        `;

        eventsByDate[dateStr].forEach(ev => {
            let dotColor = 'bg-slate-300';
            let titleColor = 'text-slate-800';
            let bgClass = '';
            if (ev.type === 'holiday') { dotColor = 'bg-rose-500'; titleColor = 'text-rose-600'; bgClass = 'bg-rose-50/50 p-1 rounded'; }

            listHtml += `
                <div class="relative ${bgClass}">
                    <div class="absolute -left-[11px] top-1.5 w-2 h-2 ${dotColor} rounded-full ring-4 ring-white"></div>
                    <div class="pl-3 py-0.5">
                        <div class="text-xs font-bold ${titleColor} leading-tight">${ev.title}</div>
                        ${ev.desc && ev.desc !== ev.title ? `<div class="text-[10px] text-slate-500 mt-0.5">${ev.desc}</div>` : ''}
                    </div>
                </div>
            `;
        });

        listHtml += `</div></div>`;
    });

    eventList.innerHTML = listHtml;
}

// ==========================================
// SETTING MODULE ACTIONS
// ==========================================
function switchSettingTab(tabId, element) {
    // Hide all sections
    document.querySelectorAll('.setting-section').forEach(el => el.classList.add('hidden'));

    // Show target section
    const target = document.getElementById('setting-section-' + tabId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-fade-in');
    }

    // Update nav buttons
    document.querySelectorAll('.setting-nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-600', 'font-bold');
        btn.classList.add('text-slate-600', 'hover:bg-slate-50', 'font-medium');
    });

    if (element) {
        element.classList.add('bg-blue-50', 'text-blue-600', 'font-bold');
        element.classList.remove('text-slate-600', 'hover:bg-slate-50', 'font-medium');
    }

    // Re-render module toggles when switching to roles tab
    if (tabId === 'roles' && typeof renderModuleToggles === 'function') {
        renderModuleToggles();
    }

    // Render system logs if switching to logs tab
    if (tabId === 'logs' && typeof renderSystemLogs === 'function') {
        renderSystemLogs();
    }
}

function demoAlert(message) {
    Swal.fire({
        icon: 'info',
        title: 'จำลองการทำงาน',
        text: message,
        confirmButtonColor: '#3b82f6'
    });
}

function confirmAction(actionName) {
    Swal.fire({
        title: 'ยืนยันการทำรายการ',
        text: 'คุณต้องการ ' + actionName + ' ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#e5e7eb',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: '<span class="text-slate-700">ยกเลิก</span>'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'ดำเนินการ ' + actionName + ' เรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        }
    });
}

// ==========================================
// USER MANAGEMENT LOGIC
// ==========================================

// Department → default module access mapping
const DEPT_MODULE_MAP = {
    'academic_dept': ['academic', 'admission'],
    'budget_dept': ['budget'],
    'hr_dept': ['hr'],
    'general_dept': ['general', 'clerk', 'facilities', 'community', 'nutrition'],
    'student_dept': ['student_affairs', 'council']
};

const DEPT_LABELS = {
    'academic_dept': 'กลุ่มบริหารงานวิชาการ',
    'budget_dept': 'กลุ่มบริหารงานงบประมาณ',
    'hr_dept': 'กลุ่มบริหารงานบุคคล',
    'general_dept': 'กลุ่มบริหารงานทั่วไป',
    'student_dept': 'กลุ่มกิจการนักเรียน'
};

let mockUsers = [
    { id: 1, name: 'สมปอง ทดสอบ', username: 'kru', position: 'ครูประจำชั้น ม.2/1', role: 'teacher', department: 'academic_dept', customModuleAccess: [], status: 'active', color: 'green' },
    { id: 2, name: 'ผู้ดูแล ระบบ', username: 'admin', position: 'นักจัดการงานทั่วไป', role: 'admin', department: '', customModuleAccess: [], status: 'active', color: 'purple' },
    { id: 3, name: 'ผู้อำนวยการ ท่านหนึ่ง', username: 'director', position: 'ผู้อำนวยการสถานศึกษา', role: 'director', department: '', customModuleAccess: [], status: 'active', color: 'amber' }
];

// Get effective module access for a user
function getUserModuleAccess(user) {
    if (user.role === 'admin' || user.role === 'director') return null; // null = full access to all
    const deptModules = (user.department && DEPT_MODULE_MAP[user.department]) ? DEPT_MODULE_MAP[user.department] : [];
    const custom = user.customModuleAccess || [];
    return [...new Set([...deptModules, ...custom])];
}

// Check permission: 'full' | 'view_own' | 'none'
function checkPermission(user, moduleId) {
    if (!user) return 'none';
    if (user.role === 'admin') return 'full';
    if (user.role === 'director') return 'full';
    const access = getUserModuleAccess(user);
    if (access === null) return 'full';
    return access.includes(moduleId) ? 'full' : 'view_own';
}

const parseRole = (role) => {
    switch (role) {
        case 'admin': return { label: 'ผู้ดูแลระบบ', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' };
        case 'director': return { label: 'ผู้บริหาร', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' };
        case 'teacher': return { label: 'ครูผู้สอน', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
        case 'staff': return { label: 'บุคลากร', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
        case 'clerk': return { label: 'ธุรการ', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' };
        case 'student_council': return { label: 'สภานักเรียน', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100' };
        case 'student': return { label: 'นักเรียน', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100' };
        case 'general': return { label: 'บุคคลทั่วไป', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
        default: return { label: role, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
    }
};

function renderSettingsUsers() {
    const tbody = document.getElementById('setting-users-tbody');
    if (!tbody) return;

    const searchStr = (document.getElementById('setting-user-search') ? document.getElementById('setting-user-search').value.toLowerCase() : '');
    const filterRole = (document.getElementById('setting-user-filter') ? document.getElementById('setting-user-filter').value : '');

    const filtered = mockUsers.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(searchStr) || u.username.toLowerCase().includes(searchStr);
        const matchRole = filterRole === '' || u.role === filterRole;
        return matchSearch && matchRole;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium border-b border-slate-100">ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไข</td></tr>';
        return;
    }

    filtered.forEach(u => {
        const roleInfo = parseRole(u.role);
        const initial = u.name.substring(0, 2);

        const deptLabel = u.department ? (DEPT_LABELS[u.department] || u.department) : '';
        const effectiveModules = getUserModuleAccess(u);
        const moduleCount = effectiveModules === null ? 'ทั้งหมด' : effectiveModules.length;
        tbody.innerHTML += `
        <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition">
                <td class="p-4 font-medium text-slate-800">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-${u.color}-100 text-${u.color}-600 flex items-center justify-center font-bold text-xs shrink-0">
                            ${initial}
                        </div>
                        <div>
                            <p>${u.name}</p>
                            ${u.position ? `<p class="text-[10px] text-slate-500 font-normal truncate mt-0.5">${u.position}</p>` : ''}
                            ${deptLabel ? `<p class="text-[10px] text-blue-600 font-normal mt-0.5"><i class="fa-solid fa-building-user mr-1"></i>${deptLabel}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td class="p-4 text-slate-600">${u.username}</td>
                <td class="p-4">
                    <span class="px-2.5 py-1 ${roleInfo.bg} ${roleInfo.text} rounded-lg text-xs font-bold border ${roleInfo.border}">
                        ${roleInfo.label}
                    </span>
                    <p class="text-[10px] text-slate-400 mt-1">เข้าถึง ${moduleCount} ระบบ</p>
                </td>
                <td class="p-4">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full flex-shrink-0 ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}"></div>
                        <span class="text-slate-600 text-xs">${u.status === 'active' ? 'ใช้งานปกติ' : 'ระงับการใช้งาน'}</span>
                    </div>
                </td>
                <td class="p-4 text-center">
                    <div class="flex justify-center gap-2">
                        <button onclick="demoAlert('รีเซ็ตรหัสผ่านให้ ${u.name}')"
                            class="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition flex items-center justify-center" title="รีเซ็ตรหัสผ่าน">
                            <i class="fa-solid fa-key text-xs"></i>
                        </button>
                        <button onclick="openEditUserModal(${u.id})"
                            class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center" title="แก้ไข">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="toggleUserStatus(${u.id})"
                            class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center" title="ระงับ/เปิดใช้งาน">
                            <i class="fa-solid fa-ban text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function _buildModuleAccessCheckboxes(selectedDept, customModules) {
    const allModules = defaultToggles;
    const auto = (selectedDept && DEPT_MODULE_MAP[selectedDept]) ? DEPT_MODULE_MAP[selectedDept] : [];
    return allModules.map(m => {
        const isAuto = auto.includes(m.id);
        const isCustom = customModules && customModules.includes(m.id);
        const checked = isAuto || isCustom;
        return `
            <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5 transition ${isAuto ? 'opacity-60' : ''}">
                <input type="checkbox" class="custom-access-cb w-4 h-4 accent-blue-600" data-module="${m.id}" ${checked ? 'checked' : ''} ${isAuto ? 'disabled title="กำหนดอัตโนมัติตามกลุ่มงาน"' : ''}>
                <span class="text-sm text-slate-700">${m.name} ${isAuto ? '<span class="text-[10px] text-slate-400">(อัตโนมัติ)</span>' : ''}</span>
            </label>`;
    }).join('');
}

function openAddUserModal() {
    const deptOptions = Object.keys(DEPT_LABELS).map(k => `<option value="${k}">${DEPT_LABELS[k]}</option>`).join('');

    Swal.fire({
        title: 'เพิ่มผู้ใช้งานใหม่',
        width: 560,
        html: `
        <div class="text-left text-sm mt-3 space-y-3 p-1 font-sans">
            <div>
                <label class="block font-bold text-slate-700 mb-1">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
                <input type="text" id="addUserName" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="เช่น นายสมชาย ใจดี" required>
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">Username <span class="text-red-500">*</span></label>
                <input type="text" id="addUserUsername" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="ภาษาอังกฤษหรือตัวเลข" required>
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">Password <span class="text-red-500">*</span></label>
                <input type="password" id="addUserPassword" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="รหัสผ่านเริ่มต้น" required>
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">ตำแหน่ง (ระบุเอง) <span class="text-red-500">*</span></label>
                <input type="text" id="addUserPosition" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="เช่น ครูประจำชั้น ม.1, หัวหน้างานวิชาการ" required>
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">สิทธิ์การเข้าถึงระบบ <span class="text-red-500">*</span></label>
                <select id="addUserRole" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                    <option value="teacher">ครูผู้สอน</option>
                    <option value="staff">บุคลากร</option>
                    <option value="clerk">ธุรการ</option>
                    <option value="director">ผู้บริหาร</option>
                    <option value="student_council">สภานักเรียน</option>
                    <option value="admin">ผู้ดูแลระบบ</option>
                    <option value="student">นักเรียน</option>
                    <option value="general">บุคคลทั่วไป</option>
                </select>
            </div>
            <div id="addUser-dept-section">
                <label class="block font-bold text-slate-700 mb-1">กลุ่มงาน (หน่วยงานที่สังกัด)</label>
                <select id="addUserDept" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer" onchange="updateAddUserModuleList()">
                    <option value="">-- ไม่ระบุ / ผู้ดูแลระบบ --</option>
                    ${deptOptions}
                </select>
                <p class="text-xs text-slate-400 mt-1">ระบบย่อยจะถูกเปิดอัตโนมัติตามกลุ่มงานที่เลือก</p>
            </div>
            <div id="addUser-access-section">
                <label class="block font-bold text-slate-700 mb-1">สิทธิ์การเข้าถึงระบบย่อย (เพิ่มเติม)</label>
                <div id="addUser-module-list" class="border border-slate-200 rounded-lg p-2 max-h-40 overflow-y-auto grid grid-cols-2 gap-1 bg-white">
                    ${_buildModuleAccessCheckboxes('', [])}
                </div>
                <p class="text-xs text-slate-400 mt-1">รายการที่เป็นสีเทา = กำหนดจากกลุ่มงานอัตโนมัติ | รายการอื่น = กำหนดเพิ่มเติมได้</p>
            </div>
        </div>
        `,
        didOpen: () => {
            // When role changes, show/hide dept section for admin
            document.getElementById('addUserRole').addEventListener('change', function () {
                const isAdmin = this.value === 'admin';
                document.getElementById('addUser-dept-section').style.opacity = isAdmin ? '0.4' : '1';
                document.getElementById('addUser-access-section').style.opacity = isAdmin ? '0.4' : '1';
            });
        },
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึกข้อมูล',
        confirmButtonColor: '#3b82f6',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const name = document.getElementById('addUserName').value;
            const username = document.getElementById('addUserUsername').value;
            const password = document.getElementById('addUserPassword').value;
            const position = document.getElementById('addUserPosition').value;
            const role = document.getElementById('addUserRole').value;
            const department = document.getElementById('addUserDept').value;

            if (!name || !username || !password || !position) {
                Swal.showValidationMessage('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน');
                return false;
            }

            // Collect custom (non-auto) modules that are checked
            const autoDept = department ? (DEPT_MODULE_MAP[department] || []) : [];
            const customModuleAccess = [];
            document.querySelectorAll('.custom-access-cb:not([disabled])').forEach(cb => {
                if (cb.checked) customModuleAccess.push(cb.dataset.module);
            });

            return { name, username, password, position, role, department, customModuleAccess };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            const val = res.value;
            const colors = ['blue', 'purple', 'emerald', 'amber', 'rose', 'cyan', 'indigo', 'pink', 'teal'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const newId = (mockUsers.length > 0) ? Math.max(...mockUsers.map(x => x.id)) + 1 : 1;
            mockUsers.push({
                id: newId,
                name: val.name,
                username: val.username,
                position: val.position,
                role: val.role,
                department: val.department,
                customModuleAccess: val.customModuleAccess,
                status: 'active',
                color: randomColor
            });

            renderSettingsUsers();
            Swal.fire({
                icon: 'success',
                title: 'สร้างบัญชีผู้ใช้สำเร็จ!',
                html: 'เพิ่ม <b>' + val.name + '</b> (' + val.username + ') เข้าสู่ระบบแล้ว',
                confirmButtonColor: '#3b82f6'
            });
        }
    });
}

// Called when department changes in Add User modal - rebuilds module checkboxes
function updateAddUserModuleList() {
    const dept = document.getElementById('addUserDept').value;
    const container = document.getElementById('addUser-module-list');
    if (container) container.innerHTML = _buildModuleAccessCheckboxes(dept, []);
}

function toggleUserStatus(id) {
    const u = mockUsers.find(x => x.id === id);
    if (!u) return;
    const action = u.status === 'active' ? 'ระงับ' : 'เปิดใช้งาน';
    Swal.fire({
        icon: 'warning',
        title: `${action}ผู้ใช้งาน?`,
        html: `ต้องการ${action} <b>${u.name}</b> ใช่หรือไม่?`,
        showCancelButton: true,
        confirmButtonText: action,
        confirmButtonColor: u.status === 'active' ? '#ef4444' : '#22c55e',
        cancelButtonText: 'ยกเลิก'
    }).then(res => {
        if (res.isConfirmed) {
            u.status = u.status === 'active' ? 'suspended' : 'active';
            renderSettingsUsers();
            Swal.fire({ icon: 'success', title: `${action}แล้ว`, timer: 1200, showConfirmButton: false });
        }
    });
}

function openEditUserModal(id) {
    const u = mockUsers.find(x => x.id === id);
    if (!u) return;
    const deptOptions = Object.keys(DEPT_LABELS).map(k =>
        `<option value="${k}" ${u.department === k ? 'selected' : ''}>${DEPT_LABELS[k]}</option>`
    ).join('');

    const roleOptions = [
        ['teacher', 'ครูผู้สอน'], ['staff', 'บุคลากร'], ['clerk', 'ธุรการ'],
        ['director', 'ผู้บริหาร'], ['student_council', 'สภานักเรียน'], ['admin', 'ผู้ดูแลระบบ'],
        ['student', 'นักเรียน'], ['general', 'บุคคลทั่วไป']
    ].map(([val, label]) => `<option value="${val}" ${u.role === val ? 'selected' : ''}>${label}</option>`).join('');

    Swal.fire({
        title: 'แก้ไขผู้ใช้งาน',
        width: 560,
        html: `
        <div class="text-left text-sm mt-3 space-y-3 p-1 font-sans">
            <div>
                <label class="block font-bold text-slate-700 mb-1">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
                <input type="text" id="editUserName" value="${u.name}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" required>
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">ตำแหน่ง</label>
                <input type="text" id="editUserPosition" value="${u.position || ''}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">สิทธิ์การเข้าถึงระบบ</label>
                <select id="editUserRole" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">${roleOptions}</select>
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">กลุ่มงาน (หน่วยงานที่สังกัด)</label>
                <select id="editUserDept" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" onchange="updateEditUserModuleList()">
                    <option value="" ${!u.department ? 'selected' : ''}>-- ไม่ระบุ / ผู้ดูแลระบบ --</option>
                    ${deptOptions}
                </select>
            </div>
            <div>
                <label class="block font-bold text-slate-700 mb-1">สิทธิ์การเข้าถึงระบบย่อย (เพิ่มเติม)</label>
                <div id="editUser-module-list" class="border border-slate-200 rounded-lg p-2 max-h-40 overflow-y-auto grid grid-cols-2 gap-1 bg-white">
                    ${_buildModuleAccessCheckboxes(u.department, u.customModuleAccess || [])}
                </div>
            </div>
        </div>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึก',
        confirmButtonColor: '#3b82f6',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const name = document.getElementById('editUserName').value;
            if (!name) { Swal.showValidationMessage('กรุณาระบุชื่อ'); return false; }
            const department = document.getElementById('editUserDept').value;
            const customModuleAccess = [];
            document.querySelectorAll('.custom-access-cb:not([disabled])').forEach(cb => {
                if (cb.checked) customModuleAccess.push(cb.dataset.module);
            });
            return {
                name,
                position: document.getElementById('editUserPosition').value,
                role: document.getElementById('editUserRole').value,
                department,
                customModuleAccess
            };
        }
    }).then(res => {
        if (res.isConfirmed) {
            Object.assign(u, res.value);
            renderSettingsUsers();
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', timer: 1200, showConfirmButton: false });
        }
    });
}

function updateEditUserModuleList() {
    const dept = document.getElementById('editUserDept').value;
    const container = document.getElementById('editUser-module-list');
    if (container) container.innerHTML = _buildModuleAccessCheckboxes(dept, []);
}

// Initial Render
renderSettingsUsers();

// ==========================================
// TERMS MANAGEMENT LOGIC
// ==========================================
let mockTerms = [
    { id: 1, term: 1, year: 2567, startDate: '16 พ.ค. 67', endDate: '10 ต.ค. 67', isActive: true },
    { id: 2, term: 2, year: 2566, startDate: '1 พ.ย. 66', endDate: '31 มี.ค. 67', isActive: false },
    { id: 3, term: 1, year: 2566, startDate: '16 พ.ค. 66', endDate: '10 ต.ค. 66', isActive: false }
];

function renderTerms() {
    const tbody = document.getElementById('setting-terms-tbody');
    const activeDisplay = document.getElementById('active-term-display');
    const activeDates = document.getElementById('active-term-dates');

    if (!tbody) return;

    tbody.innerHTML = '';

    let activeFound = null;

    mockTerms.sort((a, b) => b.year - a.year || b.term - a.term).forEach(t => {
        if (t.isActive) activeFound = t;

        const statusHtml = t.isActive
            ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[11px] font-bold border border-green-200"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div> ปัจจุบัน</span>`
            : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200">จบปีการศึกษา</span>`;

        const setActiveBtn = t.isActive ? '' : `<button onclick="setActiveTerm(${t.id})" class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition flex items-center justify-center" title="ตั้งเป็นปีปัจจุบัน"><i class="fa-solid fa-check text-xs"></i></button>`;
        const deleteBtn = t.isActive ? '' : `<button onclick="deleteTerm(${t.id})" class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center" title="ลบภาคเรียน"><i class="fa-solid fa-trash text-xs"></i></button>`;
        const actionHtml = `
            <div class="flex justify-center gap-1.5">
                ${setActiveBtn}
                <button onclick="openEditTermModal(${t.id})" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center" title="แก้ไขภาคเรียน"><i class="fa-solid fa-pen text-xs"></i></button>
                ${deleteBtn}
            </div>`;

        tbody.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition opacity-${t.isActive ? '100' : '75'}">
                <td class="p-4 font-${t.isActive ? 'bold' : 'medium'} text-slate-800">${t.term} / ${t.year}</td>
                <td class="p-4 text-slate-${t.isActive ? '600' : '500'}">${t.startDate} - ${t.endDate}</td>
                <td class="p-4 text-center">${statusHtml}</td>
                <td class="p-4 text-center">${actionHtml}</td>
            </tr>
        `;
    });

    if (activeFound) {
        if (activeDisplay) activeDisplay.innerHTML = `${activeFound.term}/${activeFound.year} <span class="text-lg font-medium text-blue-200 mb-1">(เทอม ${activeFound.term})</span>`;
        if (activeDates) activeDates.innerHTML = `วันที่เริ่มต้น: ${activeFound.startDate}<br>วันที่สิ้นสุด: ${activeFound.endDate}`;

        // Update dashboard stats if they exist
        const dashTermElements = document.querySelectorAll('.grid h3.text-2xl.font-black');
        dashTermElements.forEach(el => {
            // Find the year element by checking next sibling
            if (el.nextElementSibling && el.nextElementSibling.innerText.includes('ภาคเรียนที่')) {
                el.innerText = activeFound.year;
                el.nextElementSibling.innerText = `ภาคเรียนที่ ${activeFound.term}`;
            }
        });
    }
}

function setActiveTerm(id) {
    mockTerms.forEach(t => t.isActive = false);
    const target = mockTerms.find(t => t.id === id);
    if (target) target.isActive = true;
    renderTerms();
    Swal.fire({
        icon: 'success',
        title: 'อัปเดตสำเร็จ',
        text: 'ตั้งค่าปีการศึกษาปัจจุบันเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
    });
}

function openAddTermModal() {
    Swal.fire({
        title: 'เพิ่มปีการศึกษาใหม่',
        html: `
            <div class="text-left text-sm mt-3 space-y-3 p-1 font-sans">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">เทอม <span class="text-red-500">*</span></label>
                        <select id="addTermNum" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3 (ฤดูร้อน)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ปีการศึกษา <span class="text-red-500">*</span></label>
                        <input type="number" id="addTermYear" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="เช่น 2568" required>
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">วันที่เริ่มต้น <span class="text-red-500">*</span></label>
                    <input type="text" id="addTermStart" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="เช่น 16 พ.ค. 68" required>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">วันที่สิ้นสุด <span class="text-red-500">*</span></label>
                    <input type="text" id="addTermEnd" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="เช่น 10 ต.ค. 68" required>
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึก',
        confirmButtonColor: '#3b82f6',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const term = parseInt(document.getElementById('addTermNum').value);
            const year = parseInt(document.getElementById('addTermYear').value);
            const start = document.getElementById('addTermStart').value;
            const end = document.getElementById('addTermEnd').value;

            if (!year || !start || !end) {
                Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
                return false;
            }
            return { term, year, startDate: start, endDate: end };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            const val = res.value;
            const newId = (mockTerms.length > 0) ? Math.max(...mockTerms.map(x => x.id)) + 1 : 1;
            mockTerms.push({
                id: newId,
                term: val.term,
                year: val.year,
                startDate: val.startDate,
                endDate: val.endDate,
                isActive: false
            });
            renderTerms();
            Swal.fire('สำเร็จ', 'เพิ่มปีการศึกษาใหม่แล้ว', 'success');
        }
    });
}

function openEditTermModal(id) {
    const term = mockTerms.find(t => t.id === id);
    if (!term) return;

    Swal.fire({
        title: 'แก้ไขปีการศึกษา',
        html: `
            <div class="text-left text-sm mt-3 space-y-3 p-1 font-sans">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">เทอม <span class="text-red-500">*</span></label>
                        <select id="editTermNum" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="1" ${term.term == 1 ? 'selected' : ''}>1</option>
                            <option value="2" ${term.term == 2 ? 'selected' : ''}>2</option>
                            <option value="3" ${term.term == 3 ? 'selected' : ''}>3 (ฤดูร้อน)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">ปีการศึกษา <span class="text-red-500">*</span></label>
                        <input type="number" id="editTermYear" value="${term.year}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" required>
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">วันที่เริ่มต้น <span class="text-red-500">*</span></label>
                    <input type="text" id="editTermStart" value="${term.startDate}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" required>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">วันที่สิ้นสุด <span class="text-red-500">*</span></label>
                    <input type="text" id="editTermEnd" value="${term.endDate}" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" required>
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save"></i> บันทึก',
        confirmButtonColor: '#3b82f6',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            const termNum = parseInt(document.getElementById('editTermNum').value);
            const year = parseInt(document.getElementById('editTermYear').value);
            const start = document.getElementById('editTermStart').value;
            const end = document.getElementById('editTermEnd').value;
            if (!year || !start || !end) {
                Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
                return false;
            }
            return { term: termNum, year, startDate: start, endDate: end };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            const idx = mockTerms.findIndex(t => t.id === id);
            if (idx !== -1) {
                mockTerms[idx] = { ...mockTerms[idx], ...res.value };
                renderTerms();
                Swal.fire({ icon: 'success', title: 'แก้ไขสำเร็จ', text: 'อัปเดตข้อมูลภาคเรียนเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
            }
        }
    });
}

function deleteTerm(id) {
    const term = mockTerms.find(t => t.id === id);
    if (!term) return;
    if (term.isActive) {
        Swal.fire({ icon: 'warning', title: 'ไม่สามารถลบได้', text: 'ไม่สามารถลบภาคเรียนที่กำลังใช้งานอยู่ กรุณาตั้งภาคเรียนอื่นเป็นปัจจุบันก่อน', confirmButtonColor: '#3b82f6' });
        return;
    }

    Swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบ',
        html: `ต้องการลบภาคเรียน <b>${term.term}/${term.year}</b> ใช่หรือไม่?<br><span class="text-red-600 text-xs">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>`,
        showCancelButton: true,
        confirmButtonText: 'ลบภาคเรียน',
        confirmButtonColor: '#ef4444',
        cancelButtonText: 'ยกเลิก'
    }).then((res) => {
        if (res.isConfirmed) {
            mockTerms = mockTerms.filter(t => t.id !== id);
            renderTerms();
            Swal.fire({ icon: 'success', title: 'ลบสำเร็จ', timer: 1200, showConfirmButton: false });
        }
    });
}

// Initial Render Term List
renderTerms();

// ==========================================
// STUDENT PROMOTION LOGIC
// ==========================================

let promotionHistory = JSON.parse(localStorage.getItem('promotionHistory') || '[]');

function initPromotionPage() {
    const select = document.getElementById('promote-term-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- เลือกปีการศึกษา --</option>';
    if (mockTerms.length === 0) {
        document.getElementById('promote-term-warning').style.display = 'block';
        return;
    }
    document.getElementById('promote-term-warning').style.display = 'none';
    mockTerms.sort((a, b) => b.year - a.year || b.term - a.term).forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `ภาคเรียน ${t.term}/${t.year} ${t.isActive ? '(ปัจจุบัน)' : ''}`;
        if (t.isActive) opt.setAttribute('selected', true);
        select.appendChild(opt);
    });
    loadPromotionPreview();
    renderPromotionHistory();
}

function loadPromotionPreview() {
    const preview = document.getElementById('promotion-preview');
    const body = document.getElementById('promotion-preview-body');
    const countBadge = document.getElementById('promote-count-badge');
    if (!preview || !body) return;

    const MAX_LEVEL = 6; // ม.6 หรือ ป.6 - ปรับตามระดับโรงเรียน
    const students = studentsData.length > 0 ? studentsData : DEMO_STUDENTS;
    if (students.length === 0) {
        preview.classList.add('hidden');
        return;
    }

    preview.classList.remove('hidden');
    countBadge.textContent = `${students.length} คน`;

    const rows = students.map(s => {
        const current = parseInt(s.class_level) || 1;
        const next = current >= MAX_LEVEL ? 'จบการศึกษา' : `ม.${current + 1}`;
        return `<div class="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
            <span class="font-medium text-slate-800">${s.student_name}</span>
            <span class="flex items-center gap-2 text-slate-500">
                <span class="text-xs bg-slate-100 px-1.5 py-0.5 rounded">ม.${current}</span>
                <i class="fa-solid fa-arrow-right text-blue-500 text-xs"></i>
                <span class="text-xs ${current >= MAX_LEVEL ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'} px-1.5 py-0.5 rounded font-bold">${next}</span>
            </span>
        </div>`;
    }).join('');
    body.innerHTML = rows;
}

function executePromotion() {
    const termId = document.getElementById('promote-term-select').value;
    if (!termId) {
        Swal.fire({ icon: 'warning', title: 'กรุณาเลือกภาคเรียน', text: 'กรุณาเลือกปีการศึกษาที่ต้องการเลื่อนชั้น', confirmButtonColor: '#3b82f6' });
        return;
    }
    const term = mockTerms.find(t => t.id == termId);
    const students = studentsData.length > 0 ? studentsData : DEMO_STUDENTS;
    if (students.length === 0) {
        Swal.fire({ icon: 'info', title: 'ไม่มีข้อมูลนักเรียน', confirmButtonColor: '#3b82f6' });
        return;
    }

    Swal.fire({
        icon: 'warning',
        title: 'ยืนยันการเลื่อนชั้น',
        html: `เลื่อนชั้นนักเรียนทั้งหมด <b>${students.length} คน</b><br>สำหรับภาคเรียน <b>${term.term}/${term.year}</b><br><span class="text-xs text-slate-500">ระบบจะสำรองข้อมูลอัตโนมัติก่อนดำเนินการ</span>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-arrow-up-from-bracket"></i> ยืนยันเลื่อนชั้น',
        confirmButtonColor: '#2563eb',
        cancelButtonText: 'ยกเลิก'
    }).then(res => {
        if (!res.isConfirmed) return;

        // Backup before promotion
        const backup = {
            timestamp: new Date().toISOString(),
            termId: term.id,
            termLabel: `${term.term}/${term.year}`,
            students: JSON.parse(JSON.stringify(students))
        };
        localStorage.setItem('promotionBackup', JSON.stringify(backup));

        const MAX_LEVEL = 6;
        const promoted = [], graduated = [];
        students.forEach(s => {
            const current = parseInt(s.class_level) || 1;
            if (current >= MAX_LEVEL) {
                s.status = 'graduated';
                graduated.push(s.student_name);
            } else {
                s.class_level = String(current + 1);
                promoted.push(s.student_name);
            }
        });

        // Save promotion history
        promotionHistory.unshift({
            date: new Date().toLocaleDateString('th-TH'),
            termLabel: `${term.term}/${term.year}`,
            promotedCount: promoted.length,
            graduatedCount: graduated.length
        });
        localStorage.setItem('promotionHistory', JSON.stringify(promotionHistory));

        // Enable rollback button
        const rollbackBtn = document.getElementById('rollback-btn');
        if (rollbackBtn) rollbackBtn.disabled = false;

        renderPromotionHistory();
        loadPromotionPreview();

        Swal.fire({
            icon: 'success',
            title: 'เลื่อนชั้นสำเร็จ!',
            html: `เลื่อนชั้น <b>${promoted.length} คน</b> | จบการศึกษา <b>${graduated.length} คน</b><br><small class="text-slate-500">ข้อมูลถูกสำรองไว้แล้ว สามารถย้อนกลับได้</small>`,
            confirmButtonColor: '#3b82f6'
        });
    });
}

function rollbackPromotion() {
    const backup = JSON.parse(localStorage.getItem('promotionBackup') || 'null');
    if (!backup) {
        Swal.fire({ icon: 'info', title: 'ไม่พบข้อมูลสำรอง', text: 'ไม่มีข้อมูลสำรองสำหรับการย้อนกลับ', confirmButtonColor: '#3b82f6' });
        return;
    }

    Swal.fire({
        icon: 'warning',
        title: 'ย้อนกลับการเลื่อนชั้น?',
        html: `กู้คืนข้อมูลนักเรียนจากการเลื่อนชั้นภาคเรียน <b>${backup.termLabel}</b><br><span class="text-xs text-red-500">ข้อมูลปัจจุบันจะถูกแทนที่ด้วยข้อมูลเดิม</span>`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-rotate-left"></i> ย้อนกลับ',
        confirmButtonColor: '#ef4444',
        cancelButtonText: 'ยกเลิก'
    }).then(res => {
        if (!res.isConfirmed) return;
        // Restore student data
        backup.students.forEach(bs => {
            const s = studentsData.find(x => x.student_id === bs.student_id) ||
                DEMO_STUDENTS.find(x => x.student_id === bs.student_id);
            if (s) Object.assign(s, bs);
        });
        localStorage.removeItem('promotionBackup');
        const rollbackBtn = document.getElementById('rollback-btn');
        if (rollbackBtn) rollbackBtn.disabled = true;
        loadPromotionPreview();
        Swal.fire({ icon: 'success', title: 'ย้อนกลับสำเร็จ!', text: 'กู้คืนข้อมูลนักเรียนเรียบร้อยแล้ว', confirmButtonColor: '#3b82f6' });
    });
}

function renderPromotionHistory() {
    const container = document.getElementById('promotion-history-list');
    if (!container) return;
    if (promotionHistory.length === 0) {
        container.innerHTML = '<p class="text-center text-slate-400 py-4">ยังไม่มีประวัติการเลื่อนชั้น</p>';
        return;
    }
    container.innerHTML = promotionHistory.map(h => `
        <div class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><i class="fa-solid fa-arrow-up-from-bracket text-sm"></i></div>
                <div>
                    <p class="font-medium text-slate-800 text-sm">เลื่อนชั้น ภาคเรียน ${h.termLabel}</p>
                    <p class="text-xs text-slate-500">${h.date} · เลื่อนชั้น ${h.promotedCount} คน · จบการศึกษา ${h.graduatedCount} คน</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================
// BACKUP SYSTEM LOGIC (GOOGLE DRIVE)
// ==========================================

let googleDriveFolderId = ''; // Retained for backwards compatibility if needed elsewhere

function loadFolderIds() {
    const savedConfig = localStorage.getItem('schoolSystemFolderConfig');
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            if (document.getElementById('setting-folder-root')) document.getElementById('setting-folder-root').value = config.root || '';
            if (document.getElementById('setting-folder-academic')) document.getElementById('setting-folder-academic').value = config.academic || '';
            if (document.getElementById('setting-folder-budget')) document.getElementById('setting-folder-budget').value = config.budget || '';
            if (document.getElementById('setting-folder-hr')) document.getElementById('setting-folder-hr').value = config.hr || '';
            if (document.getElementById('setting-folder-general')) document.getElementById('setting-folder-general').value = config.general || '';
            if (document.getElementById('setting-folder-council')) document.getElementById('setting-folder-council').value = config.council || '';
            if (document.getElementById('setting-folder-backup')) document.getElementById('setting-folder-backup').value = config.backup || '';
            return config;
        } catch (e) {
            console.error('Failed to parse folder config', e);
        }
    }
    return null;
}

function saveFolderIds() {
    const config = {
        root: document.getElementById('setting-folder-root')?.value.trim() || '',
        academic: document.getElementById('setting-folder-academic')?.value.trim() || '',
        budget: document.getElementById('setting-folder-budget')?.value.trim() || '',
        hr: document.getElementById('setting-folder-hr')?.value.trim() || '',
        general: document.getElementById('setting-folder-general')?.value.trim() || '',
        council: document.getElementById('setting-folder-council')?.value.trim() || '',
        backup: document.getElementById('setting-folder-backup')?.value.trim() || ''
    };

    localStorage.setItem('schoolSystemFolderConfig', JSON.stringify(config));

    Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: 'บันทึก Folder ID ของแต่ละฝ่ายงานเรียบร้อยแล้ว',
        confirmButtonColor: '#3b82f6'
    });
}

function executeDemoBackup() {
    const config = loadFolderIds();
    if (!config || !config.backup) {
        Swal.fire({
            icon: 'warning',
            title: 'ยังไม่ได้ตั้งค่า Google Drive',
            text: 'กรุณาระบุ Folder ID "สำรองข้อมูล" ด้านบนก่อนทำการสำรองข้อมูล',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }

    const progressContainer = document.getElementById('backup-progress-container');
    const progressBar = document.getElementById('backup-progress-bar');
    const percentageText = document.getElementById('backup-percentage');
    const statusText = document.getElementById('backup-status-text');
    const btn = document.getElementById('backup-btn');

    if (!progressContainer || !progressBar || !btn) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังเตรียมการ...';
    progressContainer.classList.remove('hidden');

    const steps = [
        { p: 10, text: 'กำลังเชื่อมต่อ Google Drive...' },
        { p: 30, text: 'กำลังบีบอัดฐานข้อมูล...' },
        { p: 60, text: 'กำลังอัปโหลดไฟล์ System_DB.zip...' },
        { p: 85, text: 'กำลังอัปโหลดไฟล์แนบและรูปภาพ...' },
        { p: 100, text: 'เสร็จสมบูรณ์' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(interval);

            // Finish
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> เริ่มสำรองข้อมูล';

                // Add to history
                addBackupHistoryRow();

                Swal.fire({
                    icon: 'success',
                    title: 'สำรองข้อมูลสำเร็จ',
                    html: `ไฟล์ถูกอัปโหลดไปยัง Google Drive Folder ID: <br><b class="text-blue-600">${config.backup}</b>`,
                    confirmButtonColor: '#3b82f6'
                });
            }, 1000);
            return;
        }

        const step = steps[currentStep];
        progressBar.style.width = step.p + '%';
        percentageText.innerText = step.p + '%';
        statusText.innerText = step.text;

        currentStep++;
    }, 800);
}

function addBackupHistoryRow() {
    const list = document.getElementById('backup-history-list');
    if (!list) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    const newRow = document.createElement('tr');
    newRow.className = 'border-b border-slate-100 hover:bg-slate-50/50 transition bg-blue-50/30';
    newRow.innerHTML = `
        <td class="p-4 font-medium text-slate-800">
            <div class="flex items-center gap-2">
                <i class="fa-regular fa-clock text-blue-500 text-xs"></i>
                ${dateStr} <span class="text-slate-500 ml-1">${timeStr}</span>
            </div>
            <div class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <i class="fa-brands fa-google-drive"></i> ไปยัง G-Drive
            </div>
        </td>
        <td class="p-4 text-slate-600">
            <span class="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs border border-green-200">Manual Backup</span>
        </td>
        <td class="p-4 text-slate-600">849 MB</td>
        <td class="p-4">
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                    ผด
                </div>
                ผู้ดูแล ระบบ
            </div>
        </td>
        <td class="p-4 text-center">
            <button onclick="demoAlert('เปิดโฟลเดอร์ Google Drive')" class="text-blue-500 hover:text-blue-700 transition" title="เปิดใน Google Drive">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
        </td>
        `;

    // Insert at the top
    list.insertBefore(newRow, list.firstChild);
}


// Load dynamic data into the academic dashboard
function loadAcademicDashboard() {
    // 1. Update quick stats (mocking dynamic calculation from other subsystems)
    const totalStudents = 2450;
    const avgGrade = 2.84;

    // Calculate pending approvals from mock evaluation data if available
    let pendingApprovalsCount = 14;
    let pendingApprovalsHtml = '';

    // Mock pending approvals
    const mockApprovals = [
        { code: 'ว30101', name: 'วิทยาศาสตร์พื้นฐาน', teacher: 'ครูสมศรี เรียนดี', date: '10 ม.ค. 67, 14:30 น.', status: 'pending', icon: 'ว' },
        { code: 'ค31101', name: 'คณิตศาสตร์ 1', teacher: 'ครูสมชาย ขยัน', date: '09 ม.ค. 67, 09:15 น.', status: 'pending', icon: 'ค' },
        { code: 'อ30101', name: 'ภาษาอังกฤษ', teacher: 'ครูเจนจิรา ฟอร์ยู', date: '08 ม.ค. 67, 16:00 น.', status: 'approved', icon: 'อ' }
    ];

    document.getElementById('dashTotalStudents').innerText = totalStudents.toLocaleString();
    document.getElementById('dashAvgGrade').innerText = avgGrade;
    document.getElementById('dashPendingApproval').innerHTML = `${pendingApprovalsCount}<span class="text-sm font-medium text-slate-400 ml-1">วิชา</span>`;

    // 2. Render approvals list
    const approvalsContainer = document.getElementById('academicDashboardApprovalsList');
    if (approvalsContainer) {
        approvalsContainer.innerHTML = mockApprovals.map(req => {
            if (req.status === 'pending') {
                return `
                <div class="p-4 px-6 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold">${req.icon}</div>
                        <div>
                            <p class="font-bold text-slate-800 text-sm gap-2 flex items-center">${req.code} ${req.name} <span class="bg-amber-100 text-amber-600 text-[9px] px-2 py-0.5 rounded-md">รออนุมัติ</span></p>
                            <p class="text-[11px] text-slate-500 mt-0.5">${req.teacher} | ส่งเมื่อ: ${req.date}</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition flex items-center justify-center" title="อนุมัติ" onclick="Swal.fire('สำเร็จ', 'อนุมัติผลการเรียนสำเร็จ', 'success')"><i class="fa-solid fa-check"></i></button>
                        <button class="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition flex items-center justify-center" title="ตีกลับ" onclick="Swal.fire('สำเร็จ', 'ตีกลับให้แก้ไขเรียบร้อยแล้ว', 'success')"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>`;
            } else {
                return `
                <div class="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition opacity-60">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold">${req.icon}</div>
                        <div>
                            <p class="font-bold text-slate-600 text-sm gap-2 flex items-center">${req.code} ${req.name} <span class="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-md">อนุมัติแล้ว</span></p>
                            <p class="text-[11px] text-slate-400 mt-0.5">${req.teacher} | อนุมัติเมื่อ: ${req.date}</p>
                        </div>
                    </div>
                </div>`;
            }
        }).join('');
    }

    // 3. Ensure the calendar is loaded on the dashboard
    loadAcademicCalendar();
}

// ==========================================
// NOTIFICATIONS & TO-DO TRACKING
// ==========================================

function getPendingTasks() {
    let tasks = [];

    // 1. Check for Pending User Registrations (from localStorage)
    const pendingRegList = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
    if (pendingRegList.length > 0) {
        tasks.push({
            id: 'task-reg',
            type: 'registration',
            icon: '<i class="fa-solid fa-user-plus text-indigo-500"></i>',
            title: 'มีผู้สมัครขอใช้งานใหม่',
            description: `รอการอนุมัติจำนวน ${pendingRegList.length} รายการ`,
            time: 'ล่าสุด',
            action: `switchPage('page-setting', document.querySelector('[onclick*="page-setting"]'))` // Assuming setting page handles this
        });
    }

    // 2. Check for Pending Academic Documents (using DEMO_ACADEMIC_DOCS)
    if (typeof DEMO_ACADEMIC_DOCS !== 'undefined') {
        const pendingDocs = DEMO_ACADEMIC_DOCS.filter(doc => doc.status === 'Pending');
        if (pendingDocs.length > 0) {
            tasks.push({
                id: 'task-doc',
                type: 'document',
                icon: '<i class="fa-solid fa-file-signature text-amber-500"></i>',
                title: 'เอกสารรออนุมัติ',
                description: `มีเอกสารวิชาการรออนุมัติ ${pendingDocs.length} รายการ`,
                time: 'ล่าสุด',
                action: `switchPage('page-academic', document.querySelector('[onclick*="page-academic"]'))`
            });
        }
    }

    // Add more task tracking logic here in the future
    return tasks;
}

function updateNotificationBadge() {
    const tasks = getPendingTasks();
    const count = tasks.length;

    const badgeMobile = document.getElementById('notif-badge-mobile');
    const badgeDesktop = document.getElementById('notif-badge-desktop');

    if (count > 0) {
        if (badgeMobile) badgeMobile.classList.remove('hidden');
        if (badgeDesktop) badgeDesktop.classList.remove('hidden');
    } else {
        if (badgeMobile) badgeMobile.classList.add('hidden');
        if (badgeDesktop) badgeDesktop.classList.add('hidden');
    }
}

function showNotifications() {
    const panel = document.getElementById('notifications-panel');
    if (!panel) return;

    // Toggle visibility
    if (panel.classList.contains('hidden')) {
        // Show panel
        panel.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('opacity-0'), 10);

        // Render content
        renderNotificationsList();
    } else {
        // Hide panel
        panel.classList.add('opacity-0');
        setTimeout(() => panel.classList.add('hidden'), 200);
    }
}

function renderNotificationsList() {
    const list = document.getElementById('notifications-list');
    const countText = document.getElementById('notif-count-text');
    if (!list || !countText) return;

    const tasks = getPendingTasks();
    countText.innerText = `${tasks.length} รายการ`;

    if (tasks.length === 0) {
        list.innerHTML = `
            <div class="p-4 text-center text-slate-400 text-xs py-8">
                <i class="fa-solid fa-check-circle text-2xl text-slate-200 mb-2 block"></i>
                ยอดเยี่ยม! ไม่มีงานค้างในขณะนี้
            </div>
        `;
        return;
    }

    list.innerHTML = tasks.map(task => `
        <button onclick="showNotifications(); ${task.action}" class="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-50 transition flex gap-3 group">
            <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition">
                ${task.icon}
            </div>
            <div>
                <p class="text-sm font-bold text-slate-800">${task.title}</p>
                <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">${task.description}</p>
                <p class="text-[10px] text-slate-400 mt-1"><i class="fa-regular fa-clock"></i> ${task.time}</p>
            </div>
        </button>
    `).join('');
}

// ==========================================
// SYSTEM MODULE TOGGLES LOGIC (v2 - Group-Level)
// ==========================================

// Work group definitions - กลุ่มงาน (ระดับบน)
const defaultWorkGroups = [
    { id: 'academic_dept', name: 'กลุ่มบริหารงานวิชาการ', icon: 'fa-graduation-cap', color: 'blue', isEnabled: true },
    { id: 'budget_dept', name: 'กลุ่มบริหารงานงบประมาณ', icon: 'fa-wallet', color: 'amber', isEnabled: true },
    { id: 'hr_dept', name: 'กลุ่มบริหารงานบุคคล', icon: 'fa-id-card', color: 'emerald', isEnabled: true },
    { id: 'general_dept', name: 'กลุ่มบริหารงานทั่วไป', icon: 'fa-building', color: 'purple', isEnabled: true },
    { id: 'student_dept', name: 'กลุ่มกิจการนักเรียน', icon: 'fa-users', color: 'indigo', isEnabled: true },
    { id: 'portal_dept', name: 'สำหรับนักเรียน', icon: 'fa-star', color: 'violet', isEnabled: true }
];

// Module definitions with groupId - ระบบย่อย (ระดับล่าง)
const defaultToggles = [
    // ระบบวิชาการ
    { id: 'academic-assignment', name: 'ระบบส่งงาน', icon: 'fa-list-check', color: 'sky', groupId: 'academic_dept', isEnabled: true },
    { id: 'academic-schedule', name: 'จัดตารางสอน', icon: 'fa-calendar-week', color: 'emerald', groupId: 'academic_dept', isEnabled: true },
    { id: 'academic-attendance', name: 'เช็คชื่อนักเรียน', icon: 'fa-clipboard-user', color: 'rose', groupId: 'academic_dept', isEnabled: true },
    { id: 'academic-evaluation', name: 'งานทะเบียนวัดผล', icon: 'fa-book-open-reader', color: 'indigo', groupId: 'academic_dept', isEnabled: true },
    { id: 'academic-exams', name: 'ระบบสอบ', icon: 'fa-file-pen', color: 'purple', groupId: 'academic_dept', isEnabled: true },
    { id: 'academic-curriculum', name: 'หลักสูตรสถานศึกษา', icon: 'fa-sitemap', color: 'amber', groupId: 'academic_dept', isEnabled: true },
    { id: 'academic-supervision', name: 'นิเทศการสอน', icon: 'fa-chalkboard-user', color: 'teal', groupId: 'academic_dept', isEnabled: true },

    // งานงบประมาณ
    { id: 'budget-planning', name: 'งานวางแผนฯ', icon: 'fa-map', color: 'purple', groupId: 'budget_dept', isEnabled: true },
    { id: 'budget-finance', name: 'งานการเงินและบัญชี', icon: 'fa-file-invoice-dollar', color: 'blue', groupId: 'budget_dept', isEnabled: true },
    { id: 'budget-procurement', name: 'งานพัสดุและสินทรัพย์', icon: 'fa-boxes-stacked', color: 'emerald', groupId: 'budget_dept', isEnabled: true },
    { id: 'budget-audit', name: 'งานตรวจสอบฯ', icon: 'fa-magnifying-glass-chart', color: 'rose', groupId: 'budget_dept', isEnabled: true },

    // งานบุคคล
    { id: 'hr-planning', name: 'การวางแผนและการสรรหา', icon: 'fa-user-plus', color: 'sky', groupId: 'hr_dept', isEnabled: true },
    { id: 'hr-development', name: 'การส่งเสริมความก้าวหน้า', icon: 'fa-arrow-trend-up', color: 'indigo', groupId: 'hr_dept', isEnabled: true },
    { id: 'hr-evaluation', name: 'ประเมินและเลื่อนเงินเดือน', icon: 'fa-clipboard-check', color: 'emerald', groupId: 'hr_dept', isEnabled: true },
    { id: 'hr-welfare', name: 'วินัยและสวัสดิการ', icon: 'fa-scale-balanced', color: 'rose', groupId: 'hr_dept', isEnabled: true },

    // งานทั่วไป & กิจการนักเรียน
    { id: 'general-saraban', name: 'งานสารบรรณ', icon: 'fa-file-signature', color: 'rose', groupId: 'general_dept', isEnabled: true },
    { id: 'general-student-care', name: 'ระบบดูแลช่วยเหลือ', icon: 'fa-hand-holding-heart', color: 'pink', groupId: 'student_dept', isEnabled: true },
    { id: 'general-student-affairs', name: 'กิจการนักเรียน', icon: 'fa-users', color: 'indigo', groupId: 'student_dept', isEnabled: true },
    { id: 'general-pr', name: 'ประชาสัมพันธ์', icon: 'fa-bullhorn', color: 'amber', groupId: 'general_dept', isEnabled: true },
    { id: 'general-admission', name: 'รับนักเรียน', icon: 'fa-user-plus', color: 'teal', groupId: 'general_dept', isEnabled: true },
    { id: 'general-nutrition', name: 'โภชนาการและอนามัย', icon: 'fa-utensils', color: 'orange', groupId: 'general_dept', isEnabled: true },
    { id: 'general-facilities', name: 'อาคารสถานที่', icon: 'fa-school-flag', color: 'slate', groupId: 'general_dept', isEnabled: true },
    { id: 'general-community', name: 'ความสัมพันธ์ชุมชน', icon: 'fa-handshake', color: 'cyan', groupId: 'general_dept', isEnabled: true },

    // สำหรับนักเรียน
    { id: 'portal-exam', name: 'ประกาศผลสอบ', icon: 'fa-file-invoice', color: 'rose', groupId: 'portal_dept', isEnabled: true },
    { id: 'portal-timetable', name: 'ตารางเรียน', icon: 'fa-calendar-week', color: 'blue', groupId: 'portal_dept', isEnabled: true },
    { id: 'portal-attendance', name: 'เช็คเวลาเรียน', icon: 'fa-clipboard-check', color: 'emerald', groupId: 'portal_dept', isEnabled: true },
    { id: 'portal-behavior', name: 'คะแนนพฤติกรรม', icon: 'fa-star-half-stroke', color: 'amber', groupId: 'portal_dept', isEnabled: true }
];

function loadWorkGroups() {
    const saved = localStorage.getItem('schoolSystemWorkGroups');
    if (saved) { try { return JSON.parse(saved); } catch (e) { } }
    return defaultWorkGroups;
}

function loadModuleToggles() {
    const saved = localStorage.getItem('schoolSystemModuleToggles');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Merge with defaults to add new modules if any
            return defaultToggles.map(def => {
                const found = parsed.find(p => p.id === def.id);
                return found ? { ...def, isEnabled: found.isEnabled } : def;
            });
        } catch (e) {
            console.error('Failed to parse toggles', e);
        }
    }
    return defaultToggles;
}

function renderModuleToggles() {
    const container = document.getElementById('module-toggles-container');
    if (!container) return;

    const groups = loadWorkGroups();
    const toggles = loadModuleToggles();
    container.innerHTML = '';

    groups.forEach(g => {
        const groupModules = toggles.filter(t => t.groupId === g.id);
        const allEnabled = groupModules.every(m => m.isEnabled);
        const someEnabled = groupModules.some(m => m.isEnabled);

        // Build subsystem toggles HTML
        const subTogglesHtml = groupModules.map(t => `
            <div class="flex items-center justify-between py-2 pl-4 pr-2 rounded-lg hover:bg-slate-50 transition">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-${t.color}-100 text-${t.color}-500 flex items-center justify-center text-sm">
                        <i class="fa-solid ${t.icon}"></i>
                    </div>
                    <div>
                        <p class="font-medium text-slate-700 text-sm">${t.name}</p>
                        <p class="text-xs ${t.isEnabled ? 'text-green-600' : 'text-slate-400'}">${t.isEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</p>
                    </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="toggle-${t.id}" class="sr-only peer module-toggle-cb" data-group="${g.id}" ${t.isEnabled ? 'checked' : ''} onchange="syncGroupToggle('${g.id}')">
                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        `).join('');

        container.innerHTML += `
            <div class="col-span-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <!-- Group Header -->
                <div class="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-${g.color}-100 text-${g.color}-600 flex items-center justify-center">
                            <i class="fa-solid ${g.icon}"></i>
                        </div>
                        <div>
                            <p class="font-bold text-slate-800 text-sm">${g.name}</p>
                            <p class="text-xs text-slate-500">${groupModules.length} ระบบย่อย</p>
                        </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="group-toggle-${g.id}" class="sr-only peer group-toggle-cb" ${allEnabled ? 'checked' : ''} ${(!allEnabled && someEnabled) ? 'data-indeterminate="true"' : ''} onchange="toggleGroupModules('${g.id}', this.checked)">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${g.color}-600"></div>
                    </label>
                </div>
                <!-- Subsystems -->
                <div class="p-2 space-y-1">
                    ${subTogglesHtml}
                </div>
            </div>
        `;
    });

    // Apply indeterminate state for partially checked groups
    groups.forEach(g => {
        const groupModules = toggles.filter(t => t.groupId === g.id);
        const allEnabled = groupModules.every(m => m.isEnabled);
        const someEnabled = groupModules.some(m => m.isEnabled);
        const groupCb = document.getElementById(`group-toggle-${g.id}`);
        if (groupCb && !allEnabled && someEnabled) {
            groupCb.indeterminate = true;
        }
    });
}

// When group master toggle changes, cascade to all child modules
function toggleGroupModules(groupId, isChecked) {
    const cbs = document.querySelectorAll(`.module-toggle-cb[data-group="${groupId}"]`);
    cbs.forEach(cb => { cb.checked = isChecked; });
    // Also update group toggle indeterminate
    const groupCb = document.getElementById(`group-toggle-${groupId}`);
    if (groupCb) groupCb.indeterminate = false;
}

// When individual module toggle changes, sync the group toggle state
function syncGroupToggle(groupId) {
    const cbs = document.querySelectorAll(`.module-toggle-cb[data-group="${groupId}"]`);
    const all = Array.from(cbs);
    const allChecked = all.every(cb => cb.checked);
    const someChecked = all.some(cb => cb.checked);
    const groupCb = document.getElementById(`group-toggle-${groupId}`);
    if (groupCb) {
        groupCb.checked = allChecked;
        groupCb.indeterminate = !allChecked && someChecked;
    }
}

function saveModuleToggles() {
    // Read work group states
    const groups = loadWorkGroups();
    const newGroups = groups.map(g => {
        const cb = document.getElementById(`group-toggle-${g.id}`);
        return { ...g, isEnabled: cb ? (cb.checked || cb.indeterminate) : g.isEnabled };
    });

    // Read module states
    const currentToggles = loadModuleToggles();
    const newToggles = currentToggles.map(t => {
        const checkbox = document.getElementById(`toggle-${t.id}`);
        return { ...t, isEnabled: checkbox ? checkbox.checked : t.isEnabled };
    });

    localStorage.setItem('schoolSystemWorkGroups', JSON.stringify(newGroups));
    localStorage.setItem('schoolSystemModuleToggles', JSON.stringify(newToggles));
    applyModuleToggles();
    renderModuleToggles();

    Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: 'ตั้งค่าเปิด-ปิดระบบย่อยเรียบร้อยแล้ว',
        confirmButtonColor: '#3b82f6'
    });
}

function applyModuleToggles() {
    const toggles = loadModuleToggles();

    toggles.forEach(t => {
        // Target elements that match the module (e.g. data-module="academic")
        const elements = document.querySelectorAll(`[data-module="${t.id}"]`);
        elements.forEach(el => {
            if (t.isEnabled) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    });
}

// Note: applyModuleToggles() and renderModuleToggles() are called after pages load in index.html

// Close notification panel if clicked outside
document.addEventListener('click', function (event) {
    const panel = document.getElementById('notifications-panel');
    const bellButtons = document.querySelectorAll('button[onclick="showNotifications()"]');

    if (!panel || panel.classList.contains('hidden')) return;

    let isClickInside = panel.contains(event.target);
    bellButtons.forEach(btn => {
        if (btn.contains(event.target)) isClickInside = true;
    });

    if (!isClickInside) {
        panel.classList.add('opacity-0');
        setTimeout(() => panel.classList.add('hidden'), 200);
    }
});


// --- Calendar Popovers: Month Picker ---
let currentPickerYear = new Date().getFullYear();

function toggleMonthPicker(btnElement) {
    const popover = document.getElementById('monthPickerPopover');
    if (!popover) return;
    if (popover.classList.contains('hidden')) {
        const rect = btnElement.getBoundingClientRect();
        popover.style.top = (rect.bottom + window.scrollY + 8) + 'px';
        popover.style.left = (rect.left + window.scrollX) + 'px';

        let currentMonthInput = document.getElementById('acCalMonthFilter');
        let selectedYear = new Date().getFullYear();
        let selectedMonthIndex = new Date().getMonth();
        if (currentMonthInput && currentMonthInput.value) {
            const [y, m] = currentMonthInput.value.split('-');
            selectedYear = parseInt(y);
            selectedMonthIndex = parseInt(m) - 1;
        }
        currentPickerYear = selectedYear;
        renderMonthPickerGrid(selectedMonthIndex, selectedYear);

        popover.classList.remove('hidden');
    } else {
        popover.classList.add('hidden');
    }
}

function renderMonthPickerGrid(selectedMonthIndex, selectedYear) {
    const yrDisp = document.getElementById('pickerYearDisplay');
    if (yrDisp) yrDisp.innerText = currentPickerYear;

    const grid = document.getElementById('pickerMonthGrid');
    if (!grid) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let html = '';
    months.forEach((m, idx) => {
        let isSelected = (currentPickerYear === selectedYear && idx === selectedMonthIndex);
        let btnCls = isSelected
            ? 'bg-white text-sky-600 font-bold shadow-sm'
            : 'text-white hover:bg-white/20 font-medium';
        html += `<button onclick="selectPickerMonth(${idx})" class="py-2.5 rounded-lg text-sm transition ${btnCls}">${m}</button>`;
    });
    grid.innerHTML = html;
}

function changePickerYear(offset) {
    currentPickerYear += offset;
    let currentMonthInput = document.getElementById('acCalMonthFilter');
    let selectedYear = new Date().getFullYear();
    let selectedMonthIndex = new Date().getMonth();
    if (currentMonthInput && currentMonthInput.value) {
        const [y, m] = currentMonthInput.value.split('-');
        selectedYear = parseInt(y);
        selectedMonthIndex = parseInt(m) - 1;
    }
    renderMonthPickerGrid(selectedMonthIndex, selectedYear);
}

function selectPickerMonth(monthIdx) {
    const mStr = (monthIdx + 1).toString().padStart(2, '0');
    const yStr = currentPickerYear.toString();
    const currentMonthInput = document.getElementById('acCalMonthFilter');
    if (currentMonthInput) {
        currentMonthInput.value = `${yStr}-${mStr}`;
        if (!holidaysFetchedYears[yStr]) {
            fetchPublicHolidays(true);
            holidaysFetchedYears[yStr] = true;
        }
        loadAcademicCalendar();
    }
    const pop = document.getElementById('monthPickerPopover');
    if (pop) pop.classList.add('hidden');
}


// --- Calendar Popovers: Event Action Card ---
let currentActionEventId = null;

function toggleEventActionCard(e, id) {
    e.stopPropagation();
    currentActionEventId = id;
    const popover = document.getElementById('eventActionCard');
    if (!popover) return;

    // Auto adjust if too close to bottom
    let yPos = e.pageY + 10;
    if (yPos + 100 > window.innerHeight + window.scrollY) {
        yPos = e.pageY - 100;
    }

    popover.style.top = yPos + 'px';
    popover.style.left = e.pageX + 'px';
    popover.classList.remove('hidden');
}

function viewActionCardEvent() {
    const pop = document.getElementById('eventActionCard');
    if (pop) pop.classList.add('hidden');

    if (!currentActionEventId) return;
    const ev = mockAcademicCalendar.find(x => x.id === currentActionEventId);
    if (!ev) return;

    Swal.fire({
        title: ev.title,
        html: `<div class="text-left text-sm space-y-3 mt-4">
                 <p><i class="fa-regular fa-calendar text-slate-400 w-5"></i> <b>วันที่:</b> ${ev.date} ${ev.endDate ? 'ถึง ' + ev.endDate : ''}</p>
                 <p><i class="fa-solid fa-align-left text-slate-400 w-5"></i> <b>รายละเอียด:</b> ${ev.desc || '-'}</p>
               </div>`,
        confirmButtonColor: '#0ea5e9',
        confirmButtonText: 'ปิด'
    });
}

function editActionCardEvent() {
    const pop = document.getElementById('eventActionCard');
    if (pop) pop.classList.add('hidden');

    if (currentActionEventId) {
        editAcCalendar(currentActionEventId);
    }
}

// Hide popovers on outside click
document.addEventListener('click', function (e) {
    const monthBtn = e.target.closest('#mainCalTitle, #miniCalTitle');
    const monthPopover = e.target.closest('#monthPickerPopover');
    if (!monthBtn && !monthPopover) {
        const p = document.getElementById('monthPickerPopover');
        if (p) p.classList.add('hidden');
    }

    const evCard = e.target.closest('#eventActionCard');
    const evDot = e.target.closest('.evt-clickable');
    if (!evCard && !evDot) {
        const p2 = document.getElementById('eventActionCard');
        if (p2) p2.classList.add('hidden');
    }
});

// ==========================================
// USER PROFILE EDIT
// ==========================================

function openProfileEditModal() {
    if (!currentUser) return;
    document.getElementById('profile-edit-name').value = currentUser.name || currentUser.username;
    document.getElementById('profile-edit-line-id').value = currentUser.line_id || '';
    document.getElementById('profile-edit-password').value = '';
    document.getElementById('profile-edit-confirm-password').value = '';

    // Reset avatar preview
    const avatarImg = document.getElementById('profile-edit-avatar-img');
    const avatarText = document.getElementById('profile-edit-avatar');
    document.getElementById('profile-edit-avatar-upload').value = '';
    document.getElementById('profile-edit-avatar-base64').value = '';

    if (currentUser.profile_image) {
        avatarImg.src = currentUser.profile_image;
        avatarImg.classList.remove('hidden');
        avatarText.classList.add('hidden');
    } else {
        avatarImg.classList.add('hidden');
        avatarText.classList.remove('hidden');
        avatarText.innerText = (currentUser.name || currentUser.username).charAt(0).toUpperCase();
    }

    document.getElementById('modalProfileEdit').classList.remove('hidden');
    document.getElementById('modalProfileEdit').classList.add('flex');
}

function closeProfileEditModal() {
    document.getElementById('modalProfileEdit').classList.add('hidden');
    document.getElementById('modalProfileEdit').classList.remove('flex');
}

function previewProfileImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profile-edit-avatar-img').src = e.target.result;
            document.getElementById('profile-edit-avatar-img').classList.remove('hidden');
            document.getElementById('profile-edit-avatar').classList.add('hidden');
            document.getElementById('profile-edit-avatar-base64').value = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function togglePasswordVisibility(id, btn) {
    const input = document.getElementById(id);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        icon.classList.add('text-blue-500');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        icon.classList.remove('text-blue-500');
    }
}

function saveUserProfile() {
    if (!currentUser) return;

    const newName = document.getElementById('profile-edit-name').value.trim();
    const newLineId = document.getElementById('profile-edit-line-id').value.trim();
    const newPassword = document.getElementById('profile-edit-password').value;
    const confirmPassword = document.getElementById('profile-edit-confirm-password').value;
    const newAvatarBase64 = document.getElementById('profile-edit-avatar-base64').value;

    if (!newName) {
        Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: 'กรุณากรอกชื่อ-สกุล' });
        return;
    }

    if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
            Swal.fire({ icon: 'error', title: 'ข้อผิดพลาด', text: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน' });
            return;
        }
    }

    // Add loading state
    const btn = document.getElementById('btn-save-profile-edit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...';
    btn.disabled = true;

    // Check what changed for the log
    let changes = [];
    if (currentUser.name !== newName) changes.push(`ชื่อ (จาก "${currentUser.name || currentUser.username}" เป็น "${newName}")`);
    if (newPassword) changes.push('รหัสผ่าน');
    if ((currentUser.line_id || '') !== newLineId) changes.push(`LINE ID`);
    if (newAvatarBase64) changes.push('รูปโปรไฟล์');

    // update local state
    currentUser.name = newName;
    currentUser.line_id = newLineId;
    if (newPassword) currentUser.password = newPassword; // note: in actual system this should call an API
    if (newAvatarBase64) currentUser.profile_image = newAvatarBase64;

    if (typeof SESSION_KEY !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    }

    // System Log
    if (changes.length > 0) {
        addSystemLog('UPDATE_PROFILE', `อัปเดตข้อมูลโปรไฟล์: ${changes.join(', ')}`);
    }

    // Update UI
    const initial = newName.charAt(0).toUpperCase();
    if (document.getElementById('header-avatar')) document.getElementById('header-avatar').innerText = initial;
    if (document.getElementById('user-name-display')) document.getElementById('user-name-display').innerText = newName;

    // Update sidebar and desktop header profile picture
    const span = document.getElementById('sidebar-avatar');
    const img = document.getElementById('sidebar-avatar-img');
    const desktopSpan = document.getElementById('header-avatar-desktop');
    const desktopImg = document.getElementById('header-avatar-img-desktop');

    if (currentUser.profile_image) {
        if (img) {
            img.src = currentUser.profile_image;
            img.classList.remove('hidden');
        }
        if (desktopImg) {
            desktopImg.src = currentUser.profile_image;
            desktopImg.classList.remove('hidden');
        }
        if (span) span.classList.add('hidden');
        if (desktopSpan) desktopSpan.classList.add('hidden');
    } else {
        if (img) img.classList.add('hidden');
        if (desktopImg) desktopImg.classList.add('hidden');
        if (span) {
            span.classList.remove('hidden');
            span.innerText = initial;
        }
        if (desktopSpan) {
            desktopSpan.classList.remove('hidden');
            desktopSpan.innerText = initial;
        }
    }

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        closeProfileEditModal();
        Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
    }, 500);
}

// ==========================================
// SYSTEM LOGS
// ==========================================

function addSystemLog(actionInfo, details) {
    const user = typeof currentUser !== 'undefined' && currentUser ? (currentUser.name || currentUser.username) : 'System';
    const timestamp = new Date().toLocaleString('th-TH');

    const logEntry = {
        timestamp: timestamp,
        user: user,
        action: actionInfo,
        details: details
    };

    // In demo mode, fetch from localStorage, append, and save
    if (typeof IS_DEMO_MODE !== 'undefined' && IS_DEMO_MODE) {
        let logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
        logs.unshift(logEntry);
        // Keep only last 100 logs
        if (logs.length > 100) logs = logs.slice(0, 100);
        localStorage.setItem('system_logs', JSON.stringify(logs));
        console.log('[System Log]', logEntry);
    } else {
        // Here you would call the backend API
        // google.script.run.withSuccessHandler(...).addLog(logEntry);
        console.log('[System Log API Call]', logEntry);
    }
}

function renderSystemLogs() {
    const listBody = document.getElementById('system-logs-list');
    const emptyState = document.getElementById('system-logs-empty');
    if (!listBody || !emptyState) return;

    // In demo mode fetch from localstorage, else from mock/api
    let logs = [];
    if (typeof IS_DEMO_MODE !== 'undefined' && IS_DEMO_MODE) {
        logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
    } else {
        // mock for live system if no API, or use a call
        logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
    }

    if (logs.length === 0) {
        listBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    let html = '';

    logs.forEach(log => {
        let actionColor = 'text-slate-600 bg-slate-100';
        let actionIcon = '<i class="fa-solid fa-clock-rotate-left"></i>';

        if (log.action === 'UPDATE_PROFILE') {
            actionColor = 'text-blue-700 bg-blue-50';
            actionIcon = '<i class="fa-solid fa-user-pen"></i>';
        } else if (log.action.includes('DELETE')) {
            actionColor = 'text-rose-700 bg-rose-50';
            actionIcon = '<i class="fa-solid fa-trash-can"></i>';
        } else if (log.action.includes('CREATE') || log.action.includes('ADD')) {
            actionColor = 'text-emerald-700 bg-emerald-50';
            actionIcon = '<i class="fa-solid fa-plus"></i>';
        }

        html += `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition">
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">
                    <i class="fa-regular fa-calendar text-[10px] mr-1"></i> ${log.timestamp}
                </td>
                <td class="py-3 px-4 font-bold text-slate-700">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex justify-center items-center text-[10px]">
                            ${log.user.charAt(0).toUpperCase()}
                        </div>
                        ${log.user}
                    </div>
                </td>
                <td class="py-3 px-4">
                    <span class="px-2.5 py-1 ${actionColor} rounded-lg text-xs font-bold inline-flex items-center gap-1.5">
                        ${actionIcon} ${log.action}
                    </span>
                </td>
                <td class="py-3 px-4 text-slate-600 break-words line-clamp-2" title="${log.details}">
                    ${log.details}
                </td>
            </tr>
        `;
    });

    listBody.innerHTML = html;
}

// ==========================================
// DEPARTMENT PROGRESS DETAIL MODAL
// ==========================================

const deptProgressData = {
    academic: {
        name: '\u0e1d\u0e48\u0e32\u0e22\u0e27\u0e34\u0e0a\u0e32\u0e01\u0e32\u0e23',
        icon: 'fa-graduation-cap',
        color: 'indigo',
        overall: 85,
        tasks: [
            { name: '\u0e2a\u0e48\u0e07\u0e41\u0e1c\u0e19\u0e01\u0e32\u0e23\u0e2a\u0e2d\u0e19', done: 108, total: 118, pct: 92 },
            { name: '\u0e2a\u0e48\u0e07\u0e27\u0e34\u0e08\u0e31\u0e22\u0e43\u0e19\u0e0a\u0e31\u0e49\u0e19\u0e40\u0e23\u0e35\u0e22\u0e19', done: 89, total: 118, pct: 75 },
            { name: '\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e2b\u0e25\u0e31\u0e07\u0e01\u0e32\u0e23\u0e2a\u0e2d\u0e19', done: 94, total: 118, pct: 80 },
            { name: '\u0e2a\u0e48\u0e07\u0e1c\u0e25\u0e01\u0e32\u0e23\u0e1b\u0e23\u0e30\u0e40\u0e21\u0e34\u0e19\u0e1c\u0e25', done: 104, total: 118, pct: 88 },
        ]
    },
    general: {
        name: '\u0e1a\u0e23\u0e34\u0e2b\u0e32\u0e23\u0e17\u0e31\u0e48\u0e27\u0e44\u0e1b',
        icon: 'fa-building-columns',
        color: 'sky',
        overall: 73,
        tasks: [
            { name: '\u0e23\u0e30\u0e1a\u0e1a\u0e14\u0e39\u0e41\u0e25\u0e0a\u0e48\u0e27\u0e22\u0e40\u0e2b\u0e25\u0e37\u0e2d\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19 (SDQ/EQ)', done: 2082, total: 2450, pct: 85 },
            { name: '\u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e1a\u0e49\u0e32\u0e19\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19', done: 1470, total: 2450, pct: 60 },
            { name: '\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e2a\u0e32\u0e23\u0e1a\u0e23\u0e23\u0e13', done: 950, total: 1000, pct: 95 },
        ]
    },
    budget: {
        name: '\u0e07\u0e1a\u0e1b\u0e23\u0e30\u0e21\u0e32\u0e13',
        icon: 'fa-sack-dollar',
        color: 'emerald',
        overall: 68,
        tasks: [
            { name: '\u0e2a\u0e48\u0e07\u0e41\u0e1c\u0e19\u0e1b\u0e0f\u0e34\u0e1a\u0e31\u0e15\u0e34\u0e01\u0e32\u0e23', done: 7, total: 10, pct: 70 },
            { name: '\u0e23\u0e32\u0e22\u0e07\u0e32\u0e19\u0e01\u0e32\u0e23\u0e40\u0e07\u0e34\u0e19', done: 13, total: 20, pct: 65 },
            { name: '\u0e08\u0e31\u0e14\u0e0b\u0e37\u0e49\u0e2d\u0e08\u0e31\u0e14\u0e08\u0e49\u0e32\u0e07', done: 17, total: 25, pct: 68 },
        ]
    },
    hr: {
        name: 'งานบุคคล',
        icon: 'fa-people-group',
        color: 'purple',
        overall: 80,
        tasks: [
            { name: 'แบบประเมินตนเอง (SAR)', done: 104, total: 118, pct: 88,
              details: [
                { label: 'ส่งแล้ว', items: ['ฝ่ายวิชาการ (45)', 'ฝ่ายบริหาร (28)', 'ฝ่ายงบ (12)', 'สภานักเรียน (19)'] },
                { label: 'ยังไม่ส่ง', items: ['ผู้ปฏิบัติ (14 คน)'] }
              ]
            },
            { name: 'บันทึกการพัฒนาตนเอง', done: 85, total: 118, pct: 72 },
            { name: 'บันทึกชั่วโมงการทำงาน', done: 93, total: 118, pct: 79 },
        ]
    },
    council: {
        name: 'สภานักเรียน',
        icon: 'fa-users',
        color: 'rose',
        overall: 77,
        tasks: [
            { name: 'ส่งแผนโครงการสภาชั้นเรียน', done: 43, total: 62, pct: 70,
              details: [
                { label: 'ส่งแล้ว', items: ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.2/2', 'ม.3/1', 'ม.3/2', 'ม.4/1', 'ม.5/1', 'ม.6/1', 'ม.6/2'] },
                { label: 'ยังไม่ส่ง', items: ['ม.1/3', 'ม.2/3', 'ม.4/2', 'ม.4/3', 'ม.5/2'] }
              ]
            },
            { name: 'นักเรียนจิตอาสา (ชั่วโมงสะสม)', done: 512, total: 620, pct: 82,
              details: [
                { label: 'ชั้นที่ทำครบ', items: ['ม.1 (156 ชม.)', 'ม.2 (142 ชม.)', 'ม.3 (138 ชม.)', 'ม.4 (76 ชม.)'] },
                { label: 'ชั้นยังไม่ครบ', items: ['ม.5 (ยังขาดในระบบ)', 'ม.6 (บันทึกไม่ครบ)'] }
              ]
            },
            { name: 'บันทึกรายงานหน้าเสาธง', done: 48, total: 62, pct: 78,
              details: [
                { label: 'อัปเดตแล้ว', items: ['สัปดาห์ 1-5', 'สัปดาห์ 6-9', 'สัปดาห์ 10-12', 'สัปดาห์ 13-16', 'สัปดาห์ 17-20'] },
                { label: 'ยังไม่อัปเดต', items: ['สัปดาห์ 21-24', 'สัปดาห์ 25-28'] }
              ]
            },
        ]
    }
};

function showDeptDetail(dept) {
    const data = deptProgressData[dept];
    if (!data) return;

    const colorMap = {
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', bar: 'bg-indigo-500', tag: 'bg-indigo-50 text-indigo-700 border border-indigo-200', tagPending: 'bg-red-50 text-red-500 border border-red-200' },
        sky:    { bg: 'bg-sky-100', text: 'text-sky-600', bar: 'bg-sky-500', tag: 'bg-sky-50 text-sky-700 border border-sky-200', tagPending: 'bg-red-50 text-red-500 border border-red-200' },
        emerald:{ bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500', tag: 'bg-emerald-50 text-emerald-700 border border-emerald-200', tagPending: 'bg-red-50 text-red-500 border border-red-200' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-500', tag: 'bg-purple-50 text-purple-700 border border-purple-200', tagPending: 'bg-red-50 text-red-500 border border-red-200' },
        rose:   { bg: 'bg-rose-100', text: 'text-rose-600', bar: 'bg-rose-500', tag: 'bg-rose-50 text-rose-700 border border-rose-200', tagPending: 'bg-red-50 text-red-500 border border-red-200' },
    };
    const c = colorMap[data.color] || colorMap.sky;

    const tasksHtml = data.tasks.map(t => {
        let detailsHtml = '';
        if (t.details && t.details.length > 0) {
            detailsHtml = `<div class="mt-2.5 space-y-2">`;
            t.details.forEach((group, idx) => {
                const tagClass = idx === 0 ? c.tag : c.tagPending;
                const items = group.items.map(i => `<span class="inline-block px-2 py-0.5 ${tagClass} text-[10px] font-bold rounded-full mr-1 mb-1">${i}</span>`).join('');
                detailsHtml += `<div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">${group.label}</p><div>${items}</div></div>`;
            });
            detailsHtml += `</div>`;
        }
        return `
        <div class="py-3 border-b border-slate-100 last:border-0">
            <div class="flex justify-between items-center mb-1.5">
                <span class="text-sm text-slate-700 font-semibold">${t.name}</span>
                <span class="text-sm font-black ${c.text}">${t.pct}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                <div class="${c.bar} h-2 rounded-full" style="width:${t.pct}%"></div>
            </div>
            <p class="text-[10px] text-slate-400">ดำเนินการแล้ว ${t.done.toLocaleString()} / ${t.total.toLocaleString()}</p>
            ${detailsHtml}
        </div>`;
    }).join('');

    document.getElementById('deptDetailContent').innerHTML = `
        <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 ${c.bg} ${c.text} rounded-2xl flex items-center justify-center text-xl shadow-sm">
                <i class="fa-solid ${data.icon}"></i>
            </div>
            <div>
                <h3 class="text-lg font-black text-slate-800">${data.name}</h3>
                <p class="text-[11px] text-slate-400">ภาพรวมความคืบหน้า <span class="font-black ${c.text}">${data.overall}%</span></p>
            </div>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-4">
            <div class="${c.bar} h-2.5 rounded-full" style="width:${data.overall}%"></div>
        </div>
        <div>${tasksHtml}</div>
    `;
    document.getElementById('deptDetailModal').classList.remove('hidden');
}

// ==========================================
// PROGRESS DATA LAYER (Real data storage)
// ==========================================

const SCHOOL_CONFIG = {
    term: '2567-2',
    rooms: ['ม.1/1','ม.1/2','ม.1/3','ม.2/1','ม.2/2','ม.2/3','ม.3/1','ม.3/2','ม.3/3','ม.4/1','ม.4/2','ม.5/1','ม.5/2','ม.6/1','ม.6/2'],
    teachers: [
        {id:'T01',name:'น.ส.ปวีณา สุริยะ',dept:'academic'},{id:'T02',name:'น.คมกฤช อาทิตย์ทอง',dept:'academic'},
        {id:'T03',name:'น.ส.สมหญิง วิมลรัตน์',dept:'academic'},{id:'T04',name:'น.ส.อรุณรัตน์ พธุชแก้ว',dept:'academic'},
        {id:'T05',name:'น.สุมาลี พิมลเยิง',dept:'academic'},{id:'T06',name:'น.อุดมเดช ฟ้าใส',dept:'academic'},
        {id:'T07',name:'น.ส.คฤศาสตร์ เวชะ',dept:'academic'},{id:'T08',name:'น.ปวีณ์ธาดา แสงสรวง',dept:'academic'},
        {id:'T09',name:'น.ส.อรุณรัตน์ ชัยมงคล',dept:'general'},{id:'T10',name:'น.มนตรี หมั้นดี',dept:'general'},
        {id:'T11',name:'น.ส.ปีณา กาญจนแสง',dept:'budget'},{id:'T12',name:'น.วิชัย คุ้มภัย',dept:'budget'},
        {id:'T13',name:'น.ส.สุมาลี พิมลเยิง',dept:'hr'},{id:'T14',name:'น.อุดมเดช ฟ้าใส',dept:'hr'},
        {id:'T15',name:'น.วิชัย คุ้มภัย',dept:'hr'},{id:'T16',name:'น.ส.ปีณา กาญจนแสง',dept:'hr'},
    ],
    cleaningZones: [
        {zone:'อาคาร 1 ชั้น 1',responsible:'สภาม.1/1'},{zone:'อาคาร 1 ชั้น 2',responsible:'สภาม.1/2'},
        {zone:'อาคาร 1 ชั้น 3',responsible:'สภาม.2/1'},{zone:'อาคาร 2 ชั้น 1',responsible:'สภาม.2/2'},
        {zone:'อาคาร 2 ชั้น 2',responsible:'สภาม.3/1'},{zone:'อาคาร 2 ชั้น 3',responsible:'สภาม.3/2'},
        {zone:'ลานหน้าเสาธง',responsible:'สภาม.4/1'},{zone:'ลานอเนกประสงค์',responsible:'สภาม.4/2'},
        {zone:'โรงอาหาร',responsible:'สภาม.5/1'},{zone:'ห้องน้ำชาย',responsible:'สภาม.5/2'},
        {zone:'ห้องน้ำหญิง',responsible:'สภาม.6/1'},{zone:'ทางเดินรอบโรงเรียน',responsible:'สภาม.6/2'},
    ]
};

const STORAGE_KEYS = {
    ASSEMBLY:   'progress_council_assembly',
    CLEANING:   'progress_council_cleaning',
    LESSON:     'progress_academic_lesson',
    RESEARCH:   'progress_academic_research',
    HOME_VISIT: 'progress_general_homevisit',
    SAR:        'progress_hr_sar',
};

function _loadStorage(key){ try{ return JSON.parse(localStorage.getItem(key)||'[]'); }catch{ return []; } }
function _saveStorage(key,data){ try{ localStorage.setItem(key,JSON.stringify(data)); }catch(e){ console.warn(e); } }
function _todayStr(){ return new Date().toISOString().slice(0,10); }
function _pct(done,total){ return total ? Math.round((done/total)*100) : 0; }

// -- Save functions (called from module forms) --
function saveAssemblyRecord(room,total,present,absent,recorder){
    const recs=_loadStorage(STORAGE_KEYS.ASSEMBLY), date=_todayStr();
    const f=recs.filter(r=>!(r.date===date&&r.room===room));
    f.push({date,room,total,present,absent,recorder,saved_at:new Date().toISOString()});
    _saveStorage(STORAGE_KEYS.ASSEMBLY,f); refreshDashboardProgress();
}
function saveCleaningRecord(zone,score,inspector,notes){
    const recs=_loadStorage(STORAGE_KEYS.CLEANING), date=_todayStr();
    const f=recs.filter(r=>!(r.date===date&&r.zone===zone));
    f.push({date,zone,score,inspector,notes,saved_at:new Date().toISOString()});
    _saveStorage(STORAGE_KEYS.CLEANING,f); refreshDashboardProgress();
}
function saveLessonPlanRecord(tid,tname,fname){
    const recs=_loadStorage(STORAGE_KEYS.LESSON), term=SCHOOL_CONFIG.term;
    const f=recs.filter(r=>!(r.term===term&&r.teacher_id===tid));
    f.push({term,teacher_id:tid,teacher_name:tname,file_name:fname,submitted_at:new Date().toISOString()});
    _saveStorage(STORAGE_KEYS.LESSON,f); refreshDashboardProgress();
}
function saveResearchRecord(tid,tname,title){
    const recs=_loadStorage(STORAGE_KEYS.RESEARCH), term=SCHOOL_CONFIG.term;
    const f=recs.filter(r=>!(r.term===term&&r.teacher_id===tid));
    f.push({term,teacher_id:tid,teacher_name:tname,title,submitted_at:new Date().toISOString()});
    _saveStorage(STORAGE_KEYS.RESEARCH,f); refreshDashboardProgress();
}
function saveHomeVisitRecord(room,teacher_name,visited_count,total_count){
    const recs=_loadStorage(STORAGE_KEYS.HOME_VISIT), term=SCHOOL_CONFIG.term;
    const f=recs.filter(r=>!(r.term===term&&r.room===room));
    f.push({term,room,teacher_name,visited_count,total_count,updated_at:new Date().toISOString()});
    _saveStorage(STORAGE_KEYS.HOME_VISIT,f); refreshDashboardProgress();
}
function saveSARRecord(tid,tname,dept){
    const recs=_loadStorage(STORAGE_KEYS.SAR), term=SCHOOL_CONFIG.term;
    const f=recs.filter(r=>!(r.term===term&&r.teacher_id===tid));
    f.push({term,teacher_id:tid,teacher_name:tname,dept,submitted_at:new Date().toISOString()});
    _saveStorage(STORAGE_KEYS.SAR,f); refreshDashboardProgress();
}

// -- Live progress readers --
function getCouncilProgress(){
    const today=_todayStr(), allRooms=SCHOOL_CONFIG.rooms, allZones=SCHOOL_CONFIG.cleaningZones;
    const asmRecs=_loadStorage(STORAGE_KEYS.ASSEMBLY).filter(r=>r.date===today);
    const asmDone=asmRecs.map(r=>r.room);
    const asmPending=allRooms.filter(r=>!asmDone.includes(r));
    const asmPct=_pct(asmDone.length,allRooms.length);
    const cleanRecs=_loadStorage(STORAGE_KEYS.CLEANING).filter(r=>r.date===today);
    const cleanDone=cleanRecs.map(r=>r.zone);
    const cleanPending=allZones.filter(z=>!cleanDone.includes(z.zone));
    const cleanPct=_pct(cleanDone.length,allZones.length);
    return {
        overall:Math.round((asmPct+cleanPct)/2),
        tasks:[
            {name:'เช็คแถวหน้าเสาธง (วันนี้)',done:asmDone.length,total:allRooms.length,pct:asmPct,
             details:[
                {label:`บันทึกแล้ว (${asmDone.length} ห้อง)`,items:asmDone.length?asmDone:['ยังไม่มีการบันทึก']},
                {label:`ยังไม่บันทึก (${asmPending.length} ห้อง)`,items:asmPending.length?asmPending:['ครบทุกห้องแล้ว ✓']}
             ]},
            {name:'ตรวจเขตรับผิดชอบ (วันนี้)',done:cleanDone.length,total:allZones.length,pct:cleanPct,
             details:[
                {label:`ตรวจแล้ว (${cleanDone.length} เขต)`,items:cleanDone.length?cleanDone:['ยังไม่มีการตรวจ']},
                {label:`ยังไม่ตรวจ (${cleanPending.length} เขต)`,items:cleanPending.length?cleanPending.map(z=>`${z.zone} (${z.responsible})`):['ครบทุกเขตแล้ว ✓']}
             ]},
        ]
    };
}

function getAcademicProgress(){
    const term=SCHOOL_CONFIG.term, teachers=SCHOOL_CONFIG.teachers.filter(t=>t.dept==='academic');
    const lsnRecs=_loadStorage(STORAGE_KEYS.LESSON).filter(r=>r.term===term);
    const lsnDone=lsnRecs.map(r=>r.teacher_id);
    const lsnPending=teachers.filter(t=>!lsnDone.includes(t.id));
    const lsnPct=_pct(lsnDone.length,teachers.length);
    const resRecs=_loadStorage(STORAGE_KEYS.RESEARCH).filter(r=>r.term===term);
    const resDone=resRecs.map(r=>r.teacher_id);
    const resPending=teachers.filter(t=>!resDone.includes(t.id));
    const resPct=_pct(resDone.length,teachers.length);
    return {
        overall:Math.round((lsnPct+resPct)/2),
        tasks:[
            {name:'ส่งแผนการสอน',done:lsnDone.length,total:teachers.length,pct:lsnPct,
             details:[
                {label:`ส่งแล้ว (${lsnDone.length} คน)`,items:lsnDone.length?lsnRecs.map(r=>r.teacher_name):['ยังไม่มีการส่ง']},
                {label:`ยังไม่ส่ง (${lsnPending.length} คน)`,items:lsnPending.length?lsnPending.map(t=>t.name):['ครบทุกคนแล้ว ✓']}
             ]},
            {name:'ส่งวิจัยในชั้นเรียน',done:resDone.length,total:teachers.length,pct:resPct,
             details:[
                {label:`ส่งแล้ว (${resDone.length} คน)`,items:resDone.length?resRecs.map(r=>r.teacher_name):['ยังไม่มีการส่ง']},
                {label:`ยังไม่ส่ง (${resPending.length} คน)`,items:resPending.length?resPending.map(t=>t.name):['ครบทุกคนแล้ว ✓']}
             ]},
        ]
    };
}

function getGeneralProgress(){
    const term=SCHOOL_CONFIG.term, allRooms=SCHOOL_CONFIG.rooms;
    const vRecs=_loadStorage(STORAGE_KEYS.HOME_VISIT).filter(r=>r.term===term);
    const vComplete=vRecs.filter(r=>r.visited_count>=r.total_count).map(r=>r.room);
    const vPartial=vRecs.filter(r=>r.visited_count<r.total_count).map(r=>`${r.room} (${r.visited_count}/${r.total_count})`);
    const vPartialRooms=vRecs.filter(r=>r.visited_count<r.total_count).map(r=>r.room);
    const vNone=allRooms.filter(r=>!vRecs.find(v=>v.room===r));
    const vPct=_pct(vComplete.length + vPartialRooms.length*0.5, allRooms.length);
    return {
        overall:Math.round(vPct),
        tasks:[
            {name:'การเยี่ยมบ้านนักเรียน',done:vComplete.length,total:allRooms.length,pct:Math.round(vPct),
             details:[
                {label:`เยี่ยมครบแล้ว (${vComplete.length} ห้อง)`,items:vComplete.length?vComplete:['ยังไม่มีห้องที่ครบ']},
                {label:`กำลังดำเนินการ (${vPartial.length} ห้อง)`,items:vPartial.length?vPartial:['-']},
                {label:`ยังไม่เริ่ม (${vNone.length} ห้อง)`,items:vNone.length?vNone:['ครบทุกห้องแล้ว ✓']},
             ]},
        ]
    };
}

function getHRProgress(){
    const term=SCHOOL_CONFIG.term, allT=SCHOOL_CONFIG.teachers;
    const sarRecs=_loadStorage(STORAGE_KEYS.SAR).filter(r=>r.term===term);
    const sarDone=sarRecs.map(r=>r.teacher_id);
    const sarPending=allT.filter(t=>!sarDone.includes(t.id));
    const sarPct=_pct(sarDone.length,allT.length);
    return {
        overall:sarPct,
        tasks:[
            {name:'แบบประเมินตนเอง (SAR)',done:sarDone.length,total:allT.length,pct:sarPct,
             details:[
                {label:`ส่งแล้ว (${sarDone.length} คน)`,items:sarDone.length?sarRecs.map(r=>r.teacher_name):['ยังไม่มีการส่ง']},
                {label:`ยังไม่ส่ง (${sarPending.length} คน)`,items:sarPending.length?sarPending.map(t=>t.name):['ครบทุกคนแล้ว ✓']}
             ]},
        ]
    };
}

function refreshDashboardProgress(){
    const councilEl=document.querySelector('[onclick="showDeptDetail(\'council\')"] .text-rose-600');
    if(councilEl){ const d=getCouncilProgress(); councilEl.innerHTML=`${d.overall}<span class="text-sm text-slate-400">%</span>`; }
    const academicEl=document.querySelector('[onclick="showDeptDetail(\'academic\')"] .text-indigo-600');
    if(academicEl){ const d=getAcademicProgress(); academicEl.innerHTML=`${d.overall}<span class="text-sm text-slate-400">%</span>`; }
    const generalEl=document.querySelector('[onclick="showDeptDetail(\'general\')"] .text-sky-600');
    if(generalEl){ const d=getGeneralProgress(); generalEl.innerHTML=`${d.overall}<span class="text-sm text-slate-400">%</span>`; }
    const hrEl=document.querySelector('[onclick="showDeptDetail(\'hr\')"] .text-purple-600');
    if(hrEl){ const d=getHRProgress(); hrEl.innerHTML=`${d.overall}<span class="text-sm text-slate-400">%</span>`; }
}

// Override showDeptDetail to use live data
function showDeptDetail(dept){
    let data;
    const colorMap={
        indigo:{bg:'bg-indigo-100',text:'text-indigo-600',bar:'bg-indigo-500',tag:'bg-indigo-50 text-indigo-700 border border-indigo-200',tagPending:'bg-red-50 text-red-500 border border-red-200',tagPartial:'bg-amber-50 text-amber-600 border border-amber-200'},
        sky:{bg:'bg-sky-100',text:'text-sky-600',bar:'bg-sky-500',tag:'bg-sky-50 text-sky-700 border border-sky-200',tagPending:'bg-red-50 text-red-500 border border-red-200',tagPartial:'bg-amber-50 text-amber-600 border border-amber-200'},
        emerald:{bg:'bg-emerald-100',text:'text-emerald-600',bar:'bg-emerald-500',tag:'bg-emerald-50 text-emerald-700 border border-emerald-200',tagPending:'bg-red-50 text-red-500 border border-red-200',tagPartial:'bg-amber-50 text-amber-600 border border-amber-200'},
        purple:{bg:'bg-purple-100',text:'text-purple-600',bar:'bg-purple-500',tag:'bg-purple-50 text-purple-700 border border-purple-200',tagPending:'bg-red-50 text-red-500 border border-red-200',tagPartial:'bg-amber-50 text-amber-600 border border-amber-200'},
        rose:{bg:'bg-rose-100',text:'text-rose-600',bar:'bg-rose-500',tag:'bg-rose-50 text-rose-700 border border-rose-200',tagPending:'bg-red-50 text-red-500 border border-red-200',tagPartial:'bg-amber-50 text-amber-600 border border-amber-200'},
    };
    if(dept==='council'){ const l=getCouncilProgress(); data={name:'สภานักเรียน',icon:'fa-users',color:'rose',overall:l.overall,tasks:l.tasks}; }
    else if(dept==='academic'){ const l=getAcademicProgress(); data={name:'ฝ่ายวิชาการ',icon:'fa-graduation-cap',color:'indigo',overall:l.overall,tasks:l.tasks}; }
    else if(dept==='general'){ const l=getGeneralProgress(); data={name:'บริหารทั่วไป',icon:'fa-building-columns',color:'sky',overall:l.overall,tasks:l.tasks}; }
    else if(dept==='hr'){ const l=getHRProgress(); data={name:'งานบุคคล',icon:'fa-people-group',color:'purple',overall:l.overall,tasks:l.tasks}; }
    else if(dept==='budget'){
        data={name:'งบประมาณ',icon:'fa-sack-dollar',color:'emerald',overall:68,tasks:[
            {name:'ส่งแผนปฏิบัติการ',done:7,total:10,pct:70,details:[
                {label:'ส่งแล้ว',items:['ฝ่ายวิชาการ','ฝ่ายบริหาร','ฝ่ายอนามัย','ฝ่ายปซ.ช','ฝ่ายช.เทค','ฝ่ายสังคม','ฝ่ายภาษา']},
                {label:'ยังไม่ส่ง',items:['ฝ่ายคณิตฯ','ฝ่ายพลศึกษา','ฝ่ายศิลปะ']}]},
            {name:'รายงานการเงิน',done:13,total:20,pct:65},
            {name:'จัดซื้อจัดจ้าง',done:17,total:25,pct:68},
        ]};
    } else { return; }
    const c=colorMap[data.color]||colorMap.sky;
    const tasksHtml=data.tasks.map(t=>{
        let dHtml='';
        if(t.details&&t.details.length>0){
            dHtml='<div class="mt-2.5 space-y-2">';
            t.details.forEach((g,i)=>{
                const tc=i===0?c.tag:(i===1&&t.details.length>2?c.tagPartial:c.tagPending);
                const items=g.items.map(x=>`<span class="inline-block px-2 py-0.5 ${tc} text-[10px] font-bold rounded-full mr-1 mb-1">${x}</span>`).join('');
                dHtml+=`<div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">${g.label}</p><div>${items}</div></div>`;
            });
            dHtml+='</div>';
        }
        return `<div class="py-3 border-b border-slate-100 last:border-0">
            <div class="flex justify-between items-center mb-1.5">
                <span class="text-sm text-slate-700 font-semibold">${t.name}</span>
                <span class="text-sm font-black ${c.text}">${t.pct}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                <div class="${c.bar} h-2 rounded-full" style="width:${t.pct}%"></div>
            </div>
            <p class="text-[10px] text-slate-400">ดำเนินการแล้ว ${t.done.toLocaleString()} / ${t.total.toLocaleString()}</p>
            ${dHtml}</div>`;
    }).join('');
    document.getElementById('deptDetailContent').innerHTML=`
        <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 ${c.bg} ${c.text} rounded-2xl flex items-center justify-center text-xl shadow-sm">
                <i class="fa-solid ${data.icon}"></i></div>
            <div>
                <h3 class="text-lg font-black text-slate-800">${data.name}</h3>
                <p class="text-[11px] text-slate-400">ภาพรวมความคืบหน้า <span class="font-black ${c.text}">${data.overall}%</span></p>
            </div>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-4">
            <div class="${c.bar} h-2.5 rounded-full" style="width:${data.overall}%"></div>
        </div>
        <div class="text-[10px] text-slate-400 mb-3 flex items-center gap-1.5 bg-slate-50 rounded-lg p-2 border border-slate-100">
            <i class="fa-solid fa-database text-slate-300"></i> ข้อมูลจริงจากระบบ — อัปเดตทันทีเมื่อมีการบันทึก
        </div>
        <div>${tasksHtml}</div>`;
    document.getElementById('deptDetailModal').classList.remove('hidden');
}

// เรียก refreshDashboardProgress เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded',()=>{ setTimeout(refreshDashboardProgress,800); });

// --- PORTAL JS ---
// ============================================================
// PORTAL CONFIG & MOCK DATA
// ============================================================
const PORTAL_CFG_KEY  = 'portal_config_v1';
const PORTAL_TT_KEY   = 'portal_timetables_v1';

let portalCfg = JSON.parse(localStorage.getItem(PORTAL_CFG_KEY) || '{"term":"1/2568","status":"open"}');
let portalTTs = JSON.parse(localStorage.getItem(PORTAL_TT_KEY)  || '{}');
let portalCurrentStudent = null;

// Demo timetable data
const DEMO_TT = [
  {p:1, d1:'ภาษาไทย',   d2:'คณิตศาสตร์', d3:'วิทยาศาสตร์', d4:'สังคม',    d5:'อังกฤษ'},
  {p:2, d1:'คณิตศาสตร์', d2:'วิทยาศาสตร์', d3:'ภาษาไทย',   d4:'อังกฤษ',   d5:'สังคม'},
  {p:3, d1:'วิทยาศาสตร์',d2:'สังคม',      d3:'คณิตศาสตร์', d4:'พลศึกษา',  d5:'ภาษาไทย'},
  {p:4, d1:'อังกฤษ',    d2:'ภาษาไทย',    d3:'สังคม',      d4:'ศิลปะ',    d5:'คณิตศาสตร์'},
  {p:5, d1:'สังคม',     d2:'อังกฤษ',     d3:'พลศึกษา',    d4:'คณิตศาสตร์',d5:'วิทยาศาสตร์'},
  {p:6, d1:'พลศึกษา',   d2:'ศิลปะ',      d3:'อังกฤษ',     d4:'ภาษาไทย',  d5:'กิจกรรม'},
  {p:7, d1:'ศิลปะ',     d2:'กิจกรรม',    d3:'กิจกรรม',    d4:'วิทย์',    d5:'ชุมนุม'}
];

// Demo attendance per student
const DEMO_ATTEND = {
  '65001': {present:92, late:5,  absent:3,  records:[
    {date:'12 มี.ค. 68',status:'มาเรียน'},{date:'11 มี.ค. 68',status:'มาเรียน'},
    {date:'10 มี.ค. 68',status:'สาย'},{date:'7 มี.ค. 68',status:'มาเรียน'},
    {date:'6 มี.ค. 68',status:'มาเรียน'},{date:'5 มี.ค. 68',status:'ขาด'},
    {date:'4 มี.ค. 68',status:'มาเรียน'},{date:'3 มี.ค. 68',status:'มาเรียน'}
  ]},
  '65002': {present:88, late:8,  absent:4,  records:[
    {date:'12 มี.ค. 68',status:'มาเรียน'},{date:'11 มี.ค. 68',status:'สาย'},
    {date:'10 มี.ค. 68',status:'มาเรียน'},{date:'7 มี.ค. 68',status:'ขาด'},
    {date:'6 มี.ค. 68',status:'มาเรียน'},{date:'5 มี.ค. 68',status:'มาเรียน'},
    {date:'4 มี.ค. 68',status:'สาย'},{date:'3 มี.ค. 68',status:'มาเรียน'}
  ]}
};

// Demo behavior per student
const DEMO_BEHAVIOR = {
  '65001': {score:105, items:[
    {type:'good',  cat:'ช่วยเหลืองานโรงเรียน',      pts:10, date:'10 มี.ค.', recorder:'ครูสมศรี'},
    {type:'deduct',cat:'มาโรงเรียนสาย',              pts:5,  date:'8 มี.ค.',  recorder:'ครูประจำชั้น'},
    {type:'good',  cat:'สร้างชื่อเสียงให้โรงเรียน', pts:20, date:'5 มี.ค.', recorder:'ครูวิชาการ'}
  ]},
  '65002': {score:90, items:[
    {type:'deduct',cat:'แต่งกายผิดระเบียบ',    pts:5,  date:'9 มี.ค.',  recorder:'ครูเวรประจำวัน'},
    {type:'deduct',cat:'ไม่ส่งการบ้าน',        pts:5,  date:'6 มี.ค.',  recorder:'ครูสมปอง'},
    {type:'good',  cat:'ช่วยเหลืองานโรงเรียน', pts:10, date:'3 มี.ค.', recorder:'ครูสมศรี'}
  ]}
};

// Demo exam results
const DEMO_EXAM = {
  '65001': [
    {subject:'ภาษาไทย',       score:78, fullScore:100, grade:'2.5'},
    {subject:'คณิตศาสตร์',    score:85, fullScore:100, grade:'3.0'},
    {subject:'วิทยาศาสตร์',   score:72, fullScore:100, grade:'2.5'},
    {subject:'สังคมศึกษา',    score:90, fullScore:100, grade:'3.5'},
    {subject:'ภาษาอังกฤษ',   score:80, fullScore:100, grade:'3.0'},
    {subject:'พลศึกษา',       score:95, fullScore:100, grade:'4.0'}
  ],
  '65002': [
    {subject:'ภาษาไทย',      score:82, fullScore:100, grade:'3.0'},
    {subject:'คณิตศาสตร์',   score:65, fullScore:100, grade:'2.0'},
    {subject:'วิทยาศาสตร์',  score:88, fullScore:100, grade:'3.5'},
    {subject:'สังคมศึกษา',   score:75, fullScore:100, grade:'2.5'},
    {subject:'ภาษาอังกฤษ',  score:91, fullScore:100, grade:'3.5'},
    {subject:'พลศึกษา',      score:98, fullScore:100, grade:'4.0'}
  ]
};

// ============================================================
// NAVIGATION & INIT
// ============================================================
function portalShowView(view) {
  ['exam','timetable','attendance','behavior','admin'].forEach(v => {
    document.getElementById('portal-'+v+'-view').classList.add('hidden');
  });
  document.getElementById('portal-module-cards').classList.add('hidden');
  if (view === 'home') {
    document.getElementById('portal-module-cards').classList.remove('hidden');
  } else if (view === 'exam')       portalRenderExam();
  else if (view === 'timetable')    portalRenderTimetable();
  else if (view === 'attendance')   portalRenderAttendance();
  else if (view === 'behavior')     portalRenderBehavior();
  else if (view === 'admin')        portalInitAdmin();
  if (view !== 'home') document.getElementById('portal-'+view+'-view').classList.remove('hidden');
}

function portalInit() {
  const user = (typeof currentUser !== 'undefined') ? currentUser : null;
  if (!user) {
    document.getElementById('portal-not-logged').classList.remove('hidden');
    document.getElementById('portal-subtitle').textContent = 'กรุณาเข้าสู่ระบบ';
    return;
  }

  const isAdmin = user.role === 'admin' || user.role === 'teacher' || user.role === 'director';

  if (isAdmin) {
    // Admin/teacher: show student picker
    document.getElementById('portal-subtitle').textContent = 'คุณ' + user.name + ' — เลือกนักเรียนที่ต้องการดู';
    document.getElementById('portal-admin-picker').classList.remove('hidden');
    const allStudents = portalGetAllStudents();
    const sel = document.getElementById('portal-student-select');
    sel.innerHTML = '<option value="">— เลือกนักเรียน —</option>' +
      allStudents.map(s => `<option value="${s.student_id}">${s.student_id} – ${s.student_name} (ม.${s.class_level}/${s.room})</option>`).join('');
    // No auto-load, wait for selection
    document.getElementById('portal-module-cards').classList.add('hidden');
  } else if (user.role === 'student') {
    // Student: auto-load from session
    const sid = user.student_id;
    const allStudents = portalGetAllStudents();
    const found = allStudents.find(s => s.student_id === sid);
    if (found) {
      portalSetStudent(found);
      document.getElementById('portal-subtitle').textContent = 'ยินดีต้อนรับ ' + found.student_name;
    } else {
      document.getElementById('portal-subtitle').textContent = 'ไม่พบข้อมูลนักเรียน (รหัส: ' + sid + ')';
    }
  } else {
    document.getElementById('portal-subtitle').textContent = 'บทบาทของคุณไม่มีสิทธิ์เข้าพอร์ทัล';
    document.getElementById('portal-not-logged').classList.remove('hidden');
  }
}

function portalSelectStudent(sid) {
  if (!sid) {
    portalCurrentStudent = null;
    document.getElementById('portal-profile-card').classList.add('hidden');
    document.getElementById('portal-module-cards').classList.add('hidden');
    return;
  }
  const found = portalGetAllStudents().find(s => s.student_id === sid);
  if (found) portalSetStudent(found);
}

function portalSetStudent(s) {
  portalCurrentStudent = s;
  // Profile card
  document.getElementById('portal-profile-avatar').textContent = s.student_name.substring(2, 4) || 'นร';
  document.getElementById('portal-profile-name').textContent = s.student_name;
  document.getElementById('portal-profile-detail').textContent = 'ชั้น ม.' + s.class_level + '/' + s.room + ' · รหัส ' + s.student_id;
  document.getElementById('portal-profile-badge').textContent = 'นักเรียน';
  document.getElementById('portal-profile-card').classList.remove('hidden');
  document.getElementById('portal-not-logged').classList.add('hidden');
  document.getElementById('portal-module-cards').classList.remove('hidden');
  portalShowView('home');
}

// ============================================================
// DATA HELPERS
// ============================================================
function portalGetAllStudents() {
  const sgs  = (typeof DEMO_STUDENTS  !== 'undefined' ? DEMO_STUDENTS  : []);
  const live = (typeof studentsData   !== 'undefined' ? studentsData   : []);
  const combined = [...sgs];
  live.forEach(s => { if (!combined.find(x => x.student_id === s.student_id)) combined.push(s); });
  return combined;
}
function portalGetAttend(sid) {
  return DEMO_ATTEND[sid] || {
    present: Math.floor(80 + Math.random()*15),
    late: Math.floor(Math.random()*8),
    absent: Math.floor(Math.random()*5),
    records: [{date:'12 มี.ค. 68',status:'มาเรียน'},{date:'11 มี.ค. 68',status:'มาเรียน'},{date:'10 มี.ค. 68',status:'สาย'}]
  };
}
function portalGetBehavior(sid) {
  if (DEMO_BEHAVIOR[sid]) return DEMO_BEHAVIOR[sid];
  // Pull from real records if available
  if (typeof mockAffairsRecords !== 'undefined' && mockAffairsRecords.length) {
    let score = 100;
    const items = mockAffairsRecords.slice(0, 4).map(r => {
      if (r.type === 'deduct') score -= r.points;
      else score += r.points;
      return {type: r.type, cat: r.category, pts: r.points, date: 'มี.ค. 68', recorder: r.recorder};
    });
    return {score: Math.max(0, Math.min(200, score)), items};
  }
  return {score: 100, items: []};
}
function portalGetExam(sid) {
  return DEMO_EXAM[sid] || [];
}

// ============================================================
// SUBVIEW RENDERERS
// ============================================================
function portalRenderExam() {
  const s = portalCurrentStudent; if (!s) return;
  document.getElementById('exam-term-label').textContent = 'ภาคเรียน ' + portalCfg.term;
  const cont = document.getElementById('exam-result-content');
  if (portalCfg.status === 'closed') {
    cont.innerHTML = `<div class="py-12 text-center"><i class="fa-solid fa-lock text-slate-200 text-5xl mb-4 block"></i>
      <p class="font-bold text-slate-500">ยังไม่เปิดประกาศผลสอบ</p><p class="text-xs text-slate-400 mt-1">รอประกาศโดยทางโรงเรียน</p></div>`;
    return;
  }
  const rows = portalGetExam(s.student_id);
  if (!rows.length) {
    cont.innerHTML = `<p class="text-slate-400 text-center py-8">ยังไม่มีข้อมูลผลสอบในระบบ</p>`; return;
  }
  const avg = (rows.reduce((a,r)=>a+r.score,0)/rows.length).toFixed(1);
  const gpa = (rows.reduce((a,r)=>a+parseFloat(r.grade),0)/rows.length).toFixed(2);
  cont.innerHTML = `
    <div class="flex gap-4 mb-5 flex-wrap">
      <div class="flex-1 min-w-[100px] bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center">
        <p class="text-xs text-violet-500 font-bold mb-1">คะแนนเฉลี่ย</p>
        <p class="text-3xl font-black text-violet-700">${avg}</p>
      </div>
      <div class="flex-1 min-w-[100px] bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
        <p class="text-xs text-indigo-500 font-bold mb-1">GPA ภาคนี้</p>
        <p class="text-3xl font-black text-indigo-700">${gpa}</p>
      </div>
    </div>
    <div class="space-y-2">
    ${rows.map(r => {
      const pct = Math.round(r.score/r.fullScore*100);
      const clr = pct>=80?'emerald':pct>=60?'amber':'red';
      return `<div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div class="w-9 h-9 bg-${clr}-100 text-${clr}-700 rounded-xl flex items-center justify-center font-black text-sm shrink-0">${r.grade}</div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-slate-800 text-sm">${r.subject}</p>
          <div class="flex items-center gap-2 mt-1">
            <div class="flex-1 bg-slate-200 rounded-full h-1.5">
              <div class="bg-${clr}-500 h-1.5 rounded-full" style="width:${pct}%"></div>
            </div>
            <span class="text-xs font-bold text-${clr}-600">${r.score}/${r.fullScore}</span>
          </div>
        </div>
      </div>`;
    }).join('')}
    </div>`;
}

function portalRenderTimetable() {
  const s = portalCurrentStudent; if (!s) return;
  const key = s.class_level + '/' + s.room;
  document.getElementById('timetable-class-label').textContent = 'ชั้น ม.' + key;
  const data = portalTTs[key] || DEMO_TT;
  const COLORS = {
    'ภาษาไทย':'bg-rose-50 text-rose-700', 'คณิตศาสตร์':'bg-blue-50 text-blue-700',
    'วิทยาศาสตร์':'bg-emerald-50 text-emerald-700', 'วิทย์':'bg-emerald-50 text-emerald-700',
    'สังคม':'bg-amber-50 text-amber-700', 'สังคมศึกษา':'bg-amber-50 text-amber-700',
    'อังกฤษ':'bg-purple-50 text-purple-700', 'ภาษาอังกฤษ':'bg-purple-50 text-purple-700',
    'พลศึกษา':'bg-cyan-50 text-cyan-700', 'ศิลปะ':'bg-pink-50 text-pink-700',
    'กิจกรรม':'bg-slate-50 text-slate-500', 'ชุมนุม':'bg-indigo-50 text-indigo-600'
  };
  document.getElementById('portal-timetable-body').innerHTML = data.map(row =>
    `<tr>${[row.p,'d1','d2','d3','d4','d5'].map((k, i) =>
      i === 0 ? `<td class="p-2 border border-slate-100 text-center font-bold text-slate-400">${row.p}</td>`
              : `<td class="p-1 border border-slate-100"><div class="${COLORS[row[k]]||'bg-slate-50 text-slate-600'} rounded-lg p-1.5 text-center text-[11px] font-bold leading-tight">${row[k]||'–'}</div></td>`
    ).join('')}</tr>`
  ).join('');
}

function portalRenderAttendance() {
  const s = portalCurrentStudent; if (!s) return;
  const d = portalGetAttend(s.student_id);
  const total = d.present + d.late + d.absent;
  const pct = Math.round(d.present / total * 100);
  const c = pct >= 80 ? 'emerald' : pct >= 60 ? 'amber' : 'red';
  document.getElementById('portal-attendance-stats').innerHTML = `
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
      <div class="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><i class="fa-solid fa-check"></i></div>
      <div><p class="text-xs text-slate-500 font-bold">มาเรียน</p><p class="text-xl font-black text-slate-800">${d.present}<span class="text-xs font-normal text-slate-400 ml-1">วัน</span></p></div>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
      <div class="w-11 h-11 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><i class="fa-solid fa-clock"></i></div>
      <div><p class="text-xs text-slate-500 font-bold">มาสาย</p><p class="text-xl font-black text-slate-800">${d.late}<span class="text-xs font-normal text-slate-400 ml-1">วัน</span></p></div>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
      <div class="w-11 h-11 bg-${c}-100 text-${c}-600 rounded-full flex items-center justify-center"><i class="fa-solid fa-percent"></i></div>
      <div><p class="text-xs text-slate-500 font-bold">%เข้าเรียน</p><p class="text-xl font-black text-${c}-600">${pct}%</p></div>
    </div>`;
  document.getElementById('portal-attendance-list').innerHTML = d.records.map(r => {
    const col = r.status==='มาเรียน'?'emerald':r.status==='สาย'?'amber':'red';
    const ico = r.status==='มาเรียน'?'check':r.status==='สาย'?'clock':'xmark';
    return `<div class="flex items-center justify-between p-3 bg-${col}-50 rounded-xl border border-${col}-100">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 bg-${col}-100 text-${col}-600 rounded-full flex items-center justify-center text-xs"><i class="fa-solid fa-${ico}"></i></div>
        <span class="text-sm text-slate-700 font-medium">${r.date}</span>
      </div>
      <span class="text-xs font-bold text-${col}-700">${r.status}</span>
    </div>`;
  }).join('');
}

function portalRenderBehavior() {
  const s = portalCurrentStudent; if (!s) return;
  const d = portalGetBehavior(s.student_id);
  const c = d.score>=80?'emerald':d.score>=60?'amber':'red';
  const lbl = d.score>=80?'ดีมาก':d.score>=60?'ปานกลาง':'ต้องปรับปรุง';
  const pct = Math.min(100, d.score);
  const plus  = d.items.filter(i=>i.type==='good').reduce((a,b)=>a+b.pts,0);
  const minus = d.items.filter(i=>i.type==='deduct').reduce((a,b)=>a+b.pts,0);
  document.getElementById('portal-behavior-stats').innerHTML = `
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center py-6">
      <p class="text-4xl font-black text-${c}-500">${d.score}</p>
      <p class="text-slate-500 text-xs mt-1">คะแนนสะสม</p>
      <span class="mt-2 px-3 py-0.5 bg-${c}-100 text-${c}-700 rounded-full text-xs font-bold">${lbl}</span>
      <div class="w-full mt-3 bg-slate-100 rounded-full h-2"><div class="bg-${c}-500 h-2 rounded-full" style="width:${pct}%"></div></div>
    </div>
    <div class="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <h4 class="font-bold text-slate-700 mb-3 text-sm">สรุปภาคเรียนนี้</h4>
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100"><p class="text-xs text-emerald-600 font-bold">คะแนนเพิ่ม</p><p class="text-xl font-black text-emerald-700">+${plus}</p></div>
        <div class="p-3 bg-red-50 rounded-xl border border-red-100"><p class="text-xs text-red-600 font-bold">คะแนนหัก</p><p class="text-xl font-black text-red-700">-${minus}</p></div>
      </div>
    </div>`;
  document.getElementById('portal-behavior-list').innerHTML = d.items.length
    ? d.items.map(item => {
        const tc = item.type==='deduct'?'red':'emerald';
        const sign = item.type==='deduct'?'-':'+';
        return `<div class="flex items-center justify-between p-4 hover:bg-slate-50 transition">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-${tc}-100 text-${tc}-600 rounded-xl flex items-center justify-center"><i class="fa-solid fa-${item.type==='deduct'?'minus':'plus'} text-xs"></i></div>
            <div><p class="font-bold text-slate-800 text-sm">${item.cat}</p>
              <p class="text-xs text-slate-400">${item.date} · ${item.recorder}</p></div>
          </div>
          <span class="font-black text-${tc}-600">${sign}${item.pts}</span>
        </div>`;
      }).join('')
    : '<p class="text-slate-400 text-center py-6 text-sm">ไม่มีข้อมูลในภาคเรียนนี้</p>';
}

// ============================================================
// ADMIN PANEL
// ============================================================
function portalInitAdmin() {
  const user = (typeof currentUser !== 'undefined') ? currentUser : null;
  const ok = user && (user.role==='admin'||user.role==='teacher'||user.role==='director');
  if (!ok) { Swal.fire('ไม่มีสิทธิ์','เฉพาะผู้ดูแลระบบเท่านั้น','error'); portalShowView('home'); return; }
  document.getElementById('portal-cfg-term').value   = portalCfg.term;
  document.getElementById('portal-cfg-status').value = portalCfg.status;
  portalRenderStudentTable();
  portalAdminTab('settings');
}

function portalAdminTab(tab) {
  ['settings','students','timetable'].forEach(t => {
    document.getElementById('admin-panel-'+t).classList.add('hidden');
    const btn = document.getElementById('admin-tab-'+t);
    if (btn) btn.className = 'portal-atab px-5 py-3 text-sm font-bold text-slate-400 hover:text-slate-700 whitespace-nowrap';
  });
  document.getElementById('admin-panel-'+tab).classList.remove('hidden');
  const ab = document.getElementById('admin-tab-'+tab);
  if (ab) ab.className = 'portal-atab px-5 py-3 text-sm font-bold text-violet-600 border-b-2 border-violet-500 whitespace-nowrap';
}

function portalSaveConfig() {
  portalCfg.term   = document.getElementById('portal-cfg-term').value;
  portalCfg.status = document.getElementById('portal-cfg-status').value;
  localStorage.setItem(PORTAL_CFG_KEY, JSON.stringify(portalCfg));
  Swal.fire({icon:'success',title:'บันทึกสำเร็จ!',toast:true,position:'top-end',showConfirmButton:false,timer:1500});
}

function portalRenderStudentTable() {
  const q = (document.getElementById('admin-student-search')?.value||'').toLowerCase();
  const rows = portalGetAllStudents().filter(s =>
    !q || s.student_id.includes(q) || (s.student_name||'').toLowerCase().includes(q) || (s.class_level+'/'+s.room).includes(q)
  );
  const tbody = document.getElementById('admin-student-table'); if (!tbody) return;
  tbody.innerHTML = rows.slice(0,20).map(s => `
    <tr class="hover:bg-slate-50 transition">
      <td class="p-3 font-mono text-xs text-slate-500">${s.student_id}</td>
      <td class="p-3 font-medium text-slate-800 text-sm">${s.student_name}</td>
      <td class="p-3 text-xs text-slate-400">ม.${s.class_level}/${s.room}</td>
      <td class="p-3 text-center"><button onclick="portalShowAsStudent('${s.student_id}')" class="text-violet-500 hover:text-violet-700 text-xs font-bold"><i class="fa-solid fa-eye"></i></button></td>
    </tr>`).join('');
}

function portalShowAsStudent(sid) {
  const found = portalGetAllStudents().find(s => s.student_id === sid);
  if (found) { portalSetStudent(found); }
}

function portalSyncFromSGS() {
  Swal.fire({icon:'info',title:'ดึงข้อมูลจาก SGS',
    text:'พบนักเรียนทั้งหมด '+portalGetAllStudents().length+' คน ในฐานข้อมูล',
    confirmButtonColor:'#7c3aed'});
  portalRenderStudentTable();
}

function portalOpenStudentModal(sid) {
  const s = sid ? portalGetAllStudents().find(x=>x.student_id===sid) : null;
  Swal.fire({
    title: s ? 'แก้ไขนักเรียน' : 'เพิ่มนักเรียน',
    html:`<div class="text-left space-y-3 mt-2">
      <div><label class="text-xs font-bold text-slate-500 block mb-1">รหัส (5 หลัก)</label>
        <input id="sw-sid" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value="${s?.student_id||''}"></div>
      <div><label class="text-xs font-bold text-slate-500 block mb-1">ชื่อ-นามสกุล</label>
        <input id="sw-name" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value="${s?.student_name||''}"></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="text-xs font-bold text-slate-500 block mb-1">ชั้น</label>
          <input id="sw-level" type="number" min="1" max="6" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value="${s?.class_level||'1'}"></div>
        <div><label class="text-xs font-bold text-slate-500 block mb-1">ห้อง</label>
          <input id="sw-room" type="number" min="1" max="20" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value="${s?.room||'1'}"></div>
      </div>
    </div>`,
    showCancelButton:true, confirmButtonText: s?'บันทึก':'เพิ่ม', confirmButtonColor:'#7c3aed', cancelButtonText:'ยกเลิก',
    preConfirm:()=>{
      const sid2 = document.getElementById('sw-sid').value;
      const name = document.getElementById('sw-name').value;
      if(!sid2||!name){ Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ'); return false; }
      return {student_id:sid2, student_name:name,
        class_level:document.getElementById('sw-level').value, room:document.getElementById('sw-room').value};
    }
  }).then(res=>{
    if(res.isConfirmed){
      if(typeof studentsData !== 'undefined'){
        const idx = studentsData.findIndex(x=>x.student_id===res.value.student_id);
        if(idx>=0) studentsData[idx]={...studentsData[idx],...res.value};
        else studentsData.push({...res.value, visit_status:'รอเยี่ยม', profile_image:''});
      }
      portalRenderStudentTable();
      Swal.fire({icon:'success',title:'สำเร็จ',toast:true,position:'top-end',showConfirmButton:false,timer:1500});
    }
  });
}

// Timetable editor
function portalLoadAdminTimetable() {
  const cls = document.getElementById('admin-tt-class').value.replace('ม.','');
  const data = portalTTs[cls] || DEMO_TT;
  const dKeys = ['d1','d2','d3','d4','d5'];
  const days  = ['จันทร์','อังคาร','พุธ','พฤหัส','ศุกร์'];
  document.getElementById('admin-tt-editor').dataset.class = cls;
  document.getElementById('admin-tt-editor').innerHTML = `
    <table class="w-full text-xs border-collapse min-w-[500px]">
      <thead><tr class="bg-slate-50"><th class="p-2 border border-slate-100 text-center">คาบ</th>${days.map(d=>`<th class="p-2 border border-slate-100 text-center">${d}</th>`).join('')}</tr></thead>
      <tbody>${data.map((row,ri)=>`<tr><td class="p-1 border border-slate-100 text-center font-bold text-slate-400">${row.p}</td>${dKeys.map(k=>`
        <td class="p-1 border border-slate-100"><input id="tt-${ri}-${k}" value="${row[k]||''}" class="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-300 text-center"></td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>`;
}

function portalSaveTimetable() {
  const key = document.getElementById('admin-tt-editor').dataset.class;
  if (!key) { Swal.fire('เลือกห้องก่อน','','info'); return; }
  const dKeys = ['d1','d2','d3','d4','d5'];
  portalTTs[key] = Array.from({length:7},(_,ri)=>({p:ri+1,...Object.fromEntries(dKeys.map(k=>[k,(document.getElementById(`tt-${ri}-${k}`)?.value||'')]))}));
  localStorage.setItem(PORTAL_TT_KEY, JSON.stringify(portalTTs));
  Swal.fire({icon:'success',title:'บันทึกตารางเรียนสำเร็จ!',toast:true,position:'top-end',showConfirmButton:false,timer:1500});
}

// ============================================================
// BOOT
// ============================================================
(function() {
  // Run after a short delay to ensure currentUser is available
  setTimeout(portalInit, 100);
})();
function initStudentCouncilDashboard() {
    if (typeof currentUser === 'undefined' || !currentUser) return;
    const subRole = currentUser.sub_role || 'normal';
    const mMorning = document.getElementById('sc-module-morning');
    const mAssembly = document.getElementById('sc-module-assembly');
    const mCleaning = document.getElementById('sc-module-cleaning');
    if (currentUser.role === 'admin' || currentUser.role === 'teacher' || currentUser.role === 'director' || subRole === 'student_council') {
        if (mMorning) mMorning.style.display = '';
        if (mAssembly) mAssembly.style.display = '';
        if (mCleaning) mCleaning.style.display = '';
    } else if (subRole === 'class_president' || subRole === 'vice_class_president') {
        if (mMorning) mMorning.style.display = 'none';
        if (mAssembly) mAssembly.style.display = '';
        if (mCleaning) mCleaning.style.display = 'none';
    } else {
        if (mMorning) mMorning.style.display = 'none';
        if (mAssembly) mAssembly.style.display = 'none';
        if (mCleaning) mCleaning.style.display = 'none';
    }
}
