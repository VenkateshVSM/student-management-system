const API = window.API_URL || '/api';
const token = localStorage.getItem('ssms_token');
const user = JSON.parse(localStorage.getItem('ssms_user') || 'null');

if (!token || !user) {
  window.location.href = 'index.html';
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
};

const toast = (message) => {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2600);
};

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const api = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
};

const modules = {
  students: {
    path: '/students',
    fields: [
      ['student_id', 'Student ID'],
      ['name', 'Name'],
      ['dob', 'DOB', 'date'],
      ['gender', 'Gender', 'select', ['Male', 'Female', 'Other']],
      ['nationality', 'Nationality'],
      ['phone', 'Phone'],
      ['email', 'Email', 'email'],
      ['address', 'Address', 'textarea'],
      ['parent_details', 'Parent Details', 'textarea'],
      ['emergency_contact', 'Emergency Contact'],
      ['previous_school', 'Previous School'],
      ['semester', 'Semester'],
      ['department', 'Department'],
      ['status', 'Status', 'select', ['Active', 'Inactive', 'Graduated', 'Suspended']]
    ],
    columns: ['id', 'student_id', 'name', 'department', 'semester', 'phone', 'email', 'status']
  },
  teachers: {
    path: '/teachers',
    fields: [
      ['teacher_id', 'Teacher ID'],
      ['name', 'Name'],
      ['department', 'Department'],
      ['specialization', 'Specialization'],
      ['email', 'Email', 'email'],
      ['phone', 'Phone'],
      ['office_location', 'Office Location'],
      ['joining_date', 'Joining Date', 'date'],
      ['salary', 'Salary', 'number'],
      ['role', 'Role'],
      ['assigned_subjects', 'Assigned Subjects', 'textarea']
    ],
    columns: ['id', 'teacher_id', 'name', 'department', 'specialization', 'email', 'phone', 'role']
  },
  courses: {
    path: '/courses',
    fields: [
      ['course_id', 'Course ID'],
      ['course_name', 'Course Name'],
      ['credits', 'Credits', 'number'],
      ['description', 'Description', 'textarea'],
      ['prerequisite', 'Prerequisite']
    ],
    columns: ['id', 'course_id', 'course_name', 'credits', 'prerequisite']
  },
  enrollments: {
    path: '/enrollments',
    fields: [
      ['student_id', 'Student DB ID', 'number'],
      ['course_id', 'Course DB ID', 'number'],
      ['status', 'Status', 'select', ['Registered', 'Dropped', 'Completed']]
    ],
    columns: ['id', 'student_id', 'course_id', 'status', 'created_at']
  },
  schedules: {
    path: '/schedules',
    fields: [
      ['class_name', 'Class'],
      ['room', 'Room'],
      ['day', 'Day', 'select', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
      ['start_time', 'Start Time', 'time'],
      ['end_time', 'End Time', 'time'],
      ['teacher_id', 'Teacher DB ID', 'number'],
      ['teacher_name', 'Teacher'],
      ['course_id', 'Course DB ID', 'number']
    ],
    columns: ['id', 'class_name', 'room', 'day', 'start_time', 'end_time', 'teacher_name']
  },
  attendance: {
    path: '/attendance',
    fields: [
      ['student_id', 'Student DB ID', 'number'],
      ['course_id', 'Course DB ID', 'number'],
      ['teacher_id', 'Teacher DB ID', 'number'],
      ['class_name', 'Class'],
      ['attendance_date', 'Date', 'date'],
      ['status', 'Status', 'select', ['Present', 'Absent', 'Late', 'Excused']],
      ['remarks', 'Remarks']
    ],
    columns: ['id', 'student_id', 'course_id', 'class_name', 'attendance_date', 'status']
  },
  marks: {
    path: '/marks',
    fields: [
      ['student_id', 'Student DB ID', 'number'],
      ['course_id', 'Course DB ID', 'number'],
      ['internal_marks', 'Internal', 'number'],
      ['assignment', 'Assignment', 'number'],
      ['quiz', 'Quiz', 'number'],
      ['project', 'Project', 'number'],
      ['final_exam', 'Final Exam', 'number']
    ],
    columns: ['id', 'student_id', 'course_id', 'total', 'grade', 'gpa']
  },
  fees: {
    path: '/fees',
    fields: [
      ['student_id', 'Student DB ID', 'number'],
      ['tuition_fee', 'Tuition Fee', 'number'],
      ['hostel_fee', 'Hostel Fee', 'number'],
      ['bus_fee', 'Bus Fee', 'number'],
      ['scholarship', 'Scholarship', 'number'],
      ['paid_amount', 'Paid Amount', 'number']
    ],
    columns: ['id', 'student_id', 'receipt_no', 'paid_amount', 'pending_amount', 'payment_status']
  },
  notifications: {
    path: '/notifications',
    fields: [
      ['title', 'Title'],
      ['message', 'Message', 'textarea'],
      ['type', 'Type', 'select', ['New Assignment', 'Exam Date', 'Fee Reminder', 'Holiday Notice']],
      ['target_role', 'Target Role', 'select', ['All', 'Admin', 'Teacher', 'Student']]
    ],
    columns: ['id', 'title', 'type', 'target_role', 'created_at']
  }
};

const writeAccess = {
  students: ['Admin'],
  teachers: ['Admin'],
  courses: ['Admin', 'Teacher'],
  enrollments: ['Admin', 'Student'],
  schedules: ['Admin'],
  attendance: ['Admin', 'Teacher'],
  marks: ['Admin', 'Teacher'],
  fees: ['Admin'],
  notifications: ['Admin', 'Teacher']
};

const readAccess = {
  overview: ['Admin', 'Teacher', 'Student'],
  students: ['Admin', 'Teacher', 'Student'],
  teachers: ['Admin', 'Teacher'],
  courses: ['Admin', 'Teacher', 'Student'],
  enrollments: ['Admin', 'Teacher', 'Student'],
  schedules: ['Admin', 'Teacher', 'Student'],
  attendance: ['Admin', 'Teacher', 'Student'],
  marks: ['Admin', 'Teacher', 'Student'],
  fees: ['Admin', 'Student'],
  notifications: ['Admin', 'Teacher', 'Student']
};

const canWrite = (moduleName) => writeAccess[moduleName]?.includes(user.role);

const createField = ([name, label, type = 'text', options = []]) => {
  const wrapper = document.createElement('label');
  wrapper.textContent = label;
  let input;

  if (type === 'textarea') {
    input = document.createElement('textarea');
  } else if (type === 'select') {
    input = document.createElement('select');
    options.forEach((option) => {
      const element = document.createElement('option');
      element.value = option;
      element.textContent = option;
      input.appendChild(element);
    });
  } else {
    input = document.createElement('input');
    input.type = type;
  }

  input.name = name;
  wrapper.appendChild(input);
  return wrapper;
};

const renderForm = (moduleName) => {
  const config = modules[moduleName];
  const form = document.querySelector(`[data-form="${moduleName}"]`);
  form.innerHTML = '';
  form.dataset.mode = 'create';
  form.dataset.id = '';
  config.fields.forEach((field) => form.appendChild(createField(field)));
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Save';
  form.appendChild(submit);

  form.style.display = canWrite(moduleName) ? 'grid' : 'none';
};

const rowValue = (row, column) => {
  const value = row[column];
  if (value === null || value === undefined) return '';
  if (String(column).includes('date') || column === 'created_at') return String(value).slice(0, 10);
  return value;
};

const loadModule = async (moduleName, search = '') => {
  const section = document.getElementById(moduleName);
  const config = modules[moduleName];
  const rows = await api(`${config.path}${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  const thead = section.querySelector('thead');
  const tbody = section.querySelector('tbody');

  thead.innerHTML = `<tr>${config.columns.map((column) => `<th>${column}</th>`).join('')}<th>Actions</th></tr>`;
  tbody.innerHTML = rows
    .map(
      (row) => `<tr>
        ${config.columns.map((column) => `<td>${rowValue(row, column)}</td>`).join('')}
        <td class="row-actions">
          <button data-edit="${moduleName}" data-id="${row.id}">Edit</button>
          <button class="danger" data-delete="${moduleName}" data-id="${row.id}">Delete</button>
        </td>
      </tr>`
    )
    .join('');

  if (!canWrite(moduleName)) {
    tbody.querySelectorAll('[data-edit], [data-delete]').forEach((button) => (button.style.display = 'none'));
  }
};

const submitModule = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const moduleName = form.dataset.form;
  const config = modules[moduleName];
  const body = Object.fromEntries(new FormData(form).entries());
  Object.keys(body).forEach((key) => {
    if (body[key] === '') delete body[key];
  });

  const isEdit = form.dataset.mode === 'edit';
  await api(`${config.path}${isEdit ? `/${form.dataset.id}` : ''}`, {
    method: isEdit ? 'PUT' : 'POST',
    body: JSON.stringify(body)
  });

  form.reset();
  form.dataset.mode = 'create';
  form.dataset.id = '';
  await loadModule(moduleName);
  toast(`${moduleName} saved`);
};

const editRow = async (moduleName, id) => {
  const config = modules[moduleName];
  const row = await api(`${config.path}/${id}`);
  const form = document.querySelector(`[data-form="${moduleName}"]`);
  form.dataset.mode = 'edit';
  form.dataset.id = id;
  config.fields.forEach(([name]) => {
    if (form.elements[name]) form.elements[name].value = rowValue(row, name);
  });
  window.scrollTo({ top: form.offsetTop - 20, behavior: 'smooth' });
};

const deleteRow = async (moduleName, id) => {
  if (!confirm('Delete this record?')) return;
  await api(`${modules[moduleName].path}/${id}`, { method: 'DELETE' });
  await loadModule(moduleName);
  toast('Record deleted');
};

const drawChart = (id, type, labels, values, label) => {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  new Chart(canvas, {
    type,
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: ['#2166c2', '#0f8b6f', '#b97812', '#c43e3e', '#6a58b8'],
          borderColor: '#2166c2'
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
};

const loadDashboard = async () => {
  const endpoint =
    user.role === 'Admin' ? '/dashboard/admin' : user.role === 'Teacher' ? '/dashboard/teacher' : '/dashboard/student';
  const data = await api(endpoint);
  const cards = document.getElementById('dashboardCards');

  if (user.role === 'Admin') {
    cards.innerHTML = Object.entries(data.cards)
      .map(([key, value]) => `<article class="stat-card"><span>${key}</span><strong>${value}</strong></article>`)
      .join('');
    drawChart(
      'studentGrowthChart',
      'line',
      data.charts.studentGrowth.map((row) => row.label),
      data.charts.studentGrowth.map((row) => row.value),
      'Student Growth'
    );
    drawChart(
      'attendanceChart',
      'doughnut',
      data.charts.attendance.map((row) => row.label),
      data.charts.attendance.map((row) => row.value),
      'Attendance'
    );
    drawChart(
      'feesChart',
      'bar',
      data.charts.fees.map((row) => row.label),
      data.charts.fees.map((row) => row.value),
      'Fees'
    );
  } else {
    cards.innerHTML = Object.entries(data)
      .map(([key, value]) => `<article class="stat-card"><span>${key}</span><strong>${Array.isArray(value) ? value.length : value.percentage || value.length || 0}</strong></article>`)
      .join('');
  }
};

document.getElementById('welcomeTitle').textContent = `Welcome, ${user.name}`;
document.getElementById('roleLabel').textContent = `${user.role} Dashboard`;
document.getElementById('exportStudents').style.display = user.role === 'Admin' ? 'inline-block' : 'none';

document.querySelectorAll('.nav-btn').forEach((button) => {
  if (!readAccess[button.dataset.view]?.includes(user.role)) button.style.display = 'none';
});

document.querySelectorAll('.nav-btn').forEach((button) => {
  button.addEventListener('click', async () => {
    document.querySelectorAll('.nav-btn').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.view').forEach((view) => view.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.view).classList.add('active');
    if (button.dataset.view !== 'overview') await loadModule(button.dataset.view);
  });
});

document.querySelectorAll('[data-form]').forEach((form) => {
  renderForm(form.dataset.form);
  form.addEventListener('submit', submitModule);
});

document.querySelectorAll('.search').forEach((input) => {
  input.addEventListener('input', () => loadModule(input.closest('[data-module]').dataset.module, input.value));
});

document.addEventListener('click', (event) => {
  const edit = event.target.closest('[data-edit]');
  const remove = event.target.closest('[data-delete]');
  if (edit) editRow(edit.dataset.edit, edit.dataset.id).catch((error) => toast(error.message));
  if (remove) deleteRow(remove.dataset.delete, remove.dataset.id).catch((error) => toast(error.message));
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

document.getElementById('exportStudents').addEventListener('click', async () => {
  const response = await fetch(`${API}/reports/export/students`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) return toast('Export failed');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'students.xlsx';
  link.click();
  URL.revokeObjectURL(url);
});

loadDashboard().catch((error) => toast(error.message));
