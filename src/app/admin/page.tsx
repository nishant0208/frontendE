// pages/admin.tsx
"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const AdminPage: React.FC = () => {
  // State to manage the active tab in the main navigation
  const [activeTab, setActiveTab] = useState<string>('overview');

  // State to manage the active tab in the 'Add New' section
  const [addNewSubTab, setAddNewSubTab] = useState<string>('addNewTeacher');

  // State for filters and form inputs
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'Event' });

  // --- Dummy Data ---
  // In a real application, this data would be fetched from a backend API.
  // For demonstration purposes, we're using static arrays.

  // 1. Classes data
  const classes = [
    { id: '1', name: 'Class 10 A', students: 30, teacher: 'Ms. Smith' },
    { id: '2', name: 'Class 10 B', students: 28, teacher: 'Mr. Johnson' },
    { id: '3', name: 'Class 11 Science', students: 25, teacher: 'Dr. Lee' },
    { id: '4', name: 'Class 9 C', students: 22, teacher: 'Ms. Davis' },
  ];

  // 1. Students data
  const students = [
    { id: 's1', name: 'Alice Smith', classId: '1' },
    { id: 's2', name: 'Bob Johnson', classId: '1' },
    { id: 's3', name: 'Charlie Brown', classId: '2' },
    { id: 's4', name: 'Diana Miller', classId: '3' },
    { id: 's5', name: 'Eve White', classId: '4' },
    { id: 's6', name: 'Frank Green', classId: '1' },
  ];

  // 2. Teachers data
  const teachers = [
    { id: 't1', name: 'Ms. Smith', classes: ['Class 10 A'], subjects: ['Mathematics'], branch: 'Main Branch' },
    { id: 't2', name: 'Mr. Johnson', classes: ['Class 10 B'], subjects: ['Science'], branch: 'Main Branch' },
    { id: 't3', name: 'Dr. Lee', classes: ['Class 11 Science'], subjects: ['Physics', 'Chemistry'], branch: 'East Branch' },
    { id: 't4', name: 'Ms. Davis', classes: ['Class 9 C'], subjects: ['English', 'Social Studies'], branch: 'Main Branch' },
    { id: 't5', name: 'Mr. Brown', classes: [], subjects: ['Computer Science'], branch: 'West Branch' },
  ];

  // 3. Fees data
  const fees = {
    totalReceived: 150000,
    totalDue: 25000,
  };

  // 4. Calendar events data
  const calendarEvents = [
    { title: 'Math Test - Class 10 A (Ms. Smith)', date: '2025-06-15', type: 'Test' },
    { title: 'Annual Sports Day', date: '2025-07-01', type: 'Event' },
    { title: 'Science Exam - Class 11 Science (Dr. Lee)', date: '2025-06-20', type: 'Exam' },
    { title: 'English Lecture - Class 9 C (Ms. Davis)', date: '2025-06-12', type: 'Lecture' },
    { title: 'Parent-Teacher Meeting', date: '2025-06-25', type: 'Event' },
  ];

  // 5. Branches data
  const branches = [
    { id: 'b1', name: 'Main Branch', students: 150, teachers: 10, classes: 8 },
    { id: 'b2', name: 'East Branch', students: 80, teachers: 5, classes: 4 },
    { id: 'b3', name: 'West Branch', students: 50, teachers: 3, classes: 3 },
  ];

  // 8. Roster data for the current week
  // Highlighting: 'UNASSIGNED' for no teacher, 'FREE' for free slot
  const roster = [
    {
      day: 'Monday',
      slots: [
        { time: '9:00 AM', class: 'Class 10 A', teacher: 'Ms. Smith' },
        { time: '10:00 AM', class: 'Class 10 B', teacher: 'Mr. Johnson' },
        { time: '11:00 AM', class: 'Class 11 Science', teacher: 'Dr. Lee' },
        { time: '12:00 PM', class: 'Class 9 C', teacher: 'Ms. Davis' },
        { time: '1:00 PM', class: 'N/A', teacher: 'FREE' }, // Free slot
      ],
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '9:00 AM', class: 'Class 10 B', teacher: 'Mr. Johnson' },
        { time: '10:00 AM', class: 'Class 10 A', teacher: 'Ms. Smith' },
        { time: '11:00 AM', class: 'Class 9 C', teacher: 'UNASSIGNED' }, // No teacher available
        { time: '12:00 PM', class: 'Class 11 Science', teacher: 'Dr. Lee' },
      ],
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '9:00 AM', class: 'Class 11 Science', teacher: 'Dr. Lee' },
        { time: '10:00 AM', class: 'Class 10 A', teacher: 'Ms. Smith' },
        { time: '11:00 AM', class: 'N/A', teacher: 'FREE' },
        { time: '12:00 PM', class: 'Class 10 B', teacher: 'Mr. Johnson' },
      ],
    },
    {
      day: 'Thursday',
      slots: [
        { time: '9:00 AM', class: 'Class 9 C', teacher: 'Ms. Davis' },
        { time: '10:00 AM', class: 'Class 11 Science', teacher: 'UNASSIGNED' },
        { time: '11:00 AM', class: 'Class 10 B', teacher: 'Mr. Johnson' },
        { time: '12:00 PM', class: 'Class 10 A', teacher: 'Ms. Smith' },
      ],
    },
    {
      day: 'Friday',
      slots: [
        { time: '9:00 AM', class: 'Class 10 A', teacher: 'Ms. Smith' },
        { time: '10:00 AM', class: 'Class 9 C', teacher: 'Ms. Davis' },
        { time: '11:00 AM', class: 'N/A', teacher: 'FREE' },
        { time: '12:00 PM', class: 'Class 11 Science', teacher: 'Dr. Lee' },
      ],
    },
  ];

  // Filtered students based on selected class
  const filteredStudents = selectedClass
    ? students.filter((s) => s.classId === selectedClass)
    : students;

  // 7. Get teacher-specific schedule for the calendar
  const getTeacherSchedule = (teacherId: string) => {
    const teacherName = teachers.find(t => t.id === teacherId)?.name;
    if (!teacherName) return [];

    // Filter events where the teacher's name is in the title, or it's a lecture associated with them
    return calendarEvents.filter(event =>
      event.title.includes(teacherName) ||
      (event.type === 'Lecture' && event.title.includes(teacherName))
    );
  };

  // Handler for adding a new calendar event (frontend only for now)
  const handleAddEvent = () => {
    // In a real application, you would send this 'newEvent' data to your backend API
    console.log('Attempting to add new event:', newEvent);
    // You'd typically re-fetch or update your local state with the new event after a successful API call
    // For this UI-only example, we'll just log and clear the form.
    setNewEvent({ title: '', date: '', type: 'Event' }); // Clear form fields
  };

  // Handler for date clicks on the calendar to pre-fill the date in the new event form
  const handleDateClick = (arg: any) => {
    setNewEvent(prev => ({ ...prev, date: arg.dateStr }));
  };

  return (
    <div className="font-inter max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for school management" />
        <link rel="icon" href="/favicon.ico" />
        {/* Tailwind CSS CDN - For quick preview. In a real Next.js app, configure via postcss.config.js and tailwind.config.js */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-blue-700">Admin Dashboard</h1>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ul className="flex list-none p-0 m-0 border-b border-gray-200 overflow-x-auto bg-gray-50">
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'overview' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </li>
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'students' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </li>
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'teachers' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers
          </li>
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'fees' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('fees')}
          >
            Fees
          </li>
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'calendar' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </li>
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'branches' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('branches')}
          >
            Branches
          </li>
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'addNew' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => { setActiveTab('addNew'); setAddNewSubTab('addNewTeacher'); }} // Set default sub-tab
          >
            Add New
          </li>
          <li
            className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
              ${activeTab === 'roster' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('roster')}
          >
            Roster
          </li>
        </ul>

        <div className="p-6">
          {/* Overview Tab Panel */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">Overall Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center shadow-md transition-transform duration-200 hover:-translate-y-1">
                  <div className="text-lg text-gray-600 mb-2">Total Students</div>
                  <div className="text-5xl font-bold text-blue-700 mb-2">{students.length}</div>
                  <div className="text-sm text-gray-500">Across all classes</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center shadow-md transition-transform duration-200 hover:-translate-y-1">
                  <div className="text-lg text-gray-600 mb-2">Total Teachers</div>
                  <div className="text-5xl font-bold text-blue-700 mb-2">{teachers.length}</div>
                  <div className="text-sm text-gray-500">Active faculty members</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center shadow-md transition-transform duration-200 hover:-translate-y-1">
                  <div className="text-lg text-gray-600 mb-2">Total Classes</div>
                  <div className="text-5xl font-bold text-blue-700 mb-2">{classes.length}</div>
                  <div className="text-sm text-gray-500">Currently running</div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab Panel (1. Students enrolled in each class with class filter) */}
          {activeTab === 'students' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">Students Enrolled</h2>
              <div className="mb-6">
                <label htmlFor="class-filter" className="block font-medium text-gray-700 mb-2">Filter by Class</label>
                <select
                  id="class-filter"
                  className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select a class to filter students</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto mb-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Student Name</th>
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => {
                        const studentClass = classes.find((cls) => cls.id === student.classId);
                        return (
                          <tr key={student.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                            <td className="px-5 py-3 border-b border-gray-200">{student.name}</td>
                            <td className="px-5 py-3 border-b border-gray-200">{studentClass ? studentClass.name : 'N/A'}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-5 py-3 text-center border-b border-gray-200">
                          {selectedClass ? 'No students found for this class.' : 'No students available.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Teachers Tab Panel (2. Teacher taking classes and subjects) */}
          {activeTab === 'teachers' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">Faculty Details</h2>
              <div className="overflow-x-auto mb-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Teacher Name</th>
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Classes Taking</th>
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Subjects Teaching</th>
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                        <td className="px-5 py-3 border-b border-gray-200 font-medium">{teacher.name}</td>
                        <td className="px-5 py-3 border-b border-gray-200">{teacher.classes.length > 0 ? teacher.classes.join(', ') : <i className="text-gray-500">None</i>}</td>
                        <td className="px-5 py-3 border-b border-gray-200">{teacher.subjects.length > 0 ? teacher.subjects.join(', ') : <i className="text-gray-500">None</i>}</td>
                        <td className="px-5 py-3 border-b border-gray-200">{teacher.branch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fees Tab Panel (3. Total fees received and due) */}
          {activeTab === 'fees' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">Financial Overview: Fees</h2>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex-1 min-w-[300px] bg-green-50 border border-green-200 rounded-lg p-6 text-center shadow-md transition-transform duration-200 hover:-translate-y-1">
                  <div className="text-lg text-green-700 mb-2">Total Fees Received</div>
                  <div className="text-5xl font-bold text-green-700 mb-2">${fees.totalReceived.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">As of today</div>
                </div>
                <div className="flex-1 min-w-[300px] bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-md transition-transform duration-200 hover:-translate-y-1">
                  <div className="text-lg text-red-700 mb-2">Total Fees Due</div>
                  <div className="text-5xl font-bold text-red-700 mb-2">${fees.totalDue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Outstanding payments from students</div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Tab Panel (4. Calendar for tests/exams/events & 7. Teacher specific calendar) */}
          {activeTab === 'calendar' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">School Calendar & Events</h2>
              {/* Teacher Schedule Filter */}
              <div className="mb-6">
                <label htmlFor="teacher-schedule-filter" className="block font-medium text-gray-700 mb-2">View Teacher Schedule</label>
                <select
                  id="teacher-schedule-filter"
                  className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                  <option value="">All Events</option> {/* Option to view all events */}
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* FullCalendar Component */}
              <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-md bg-white">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth" // Default view
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay', // View options
                  }}
                  // Events displayed based on teacher filter
                  events={selectedTeacher ? getTeacherSchedule(selectedTeacher) : calendarEvents}
                  dateClick={handleDateClick} // Enable clicking on dates
                  eventContent={(eventInfo) => ( // Custom rendering for events
                    <div
                      className={`p-1.5 rounded-md text-sm text-left whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer border border-transparent transition-opacity duration-200 hover:opacity-90
                        ${eventInfo.event.extendedProps.type === 'Test' ? 'bg-red-100 text-red-800 border-red-200' :
                          eventInfo.event.extendedProps.type === 'Exam' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          eventInfo.event.extendedProps.type === 'Lecture' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                    >
                      <p className="font-bold m-0 leading-tight">{eventInfo.event.title}</p>
                      <span className="text-xs opacity-85 m-0">{eventInfo.event.extendedProps.type}</span>
                    </div>
                  )}
                  height="auto" // Adjust height automatically
                  aspectRatio={2} // Maintain aspect ratio
                />
              </div>

              {/* Add New Calendar Event Form */}
              <div className="mt-8 p-6 border border-gray-200 rounded-lg shadow-md bg-white">
                <h3 className="text-2xl font-semibold text-gray-700 mb-5">Add New Calendar Event</h3>
                <div className="mb-5">
                  <label htmlFor="event-title" className="block font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    id="event-title"
                    className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Annual Science Fair, Class 10 Math Test"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="event-date" className="block font-medium text-gray-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    id="event-date"
                    className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="event-type" className="block font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    id="event-type"
                    className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  >
                    <option value="Event">Event</option>
                    <option value="Test">Test</option>
                    <option value="Exam">Exam</option>
                    <option value="Lecture">Lecture</option>
                  </select>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={handleAddEvent}>
                  Add Event to Calendar
                </button>
              </div>
            </div>
          )}

          {/* Branches Tab Panel (5. Branch wise detail) */}
          {activeTab === 'branches' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">Branch Details</h2>
              <div className="overflow-x-auto mb-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Branch Name</th>
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Total Students</th>
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Total Teachers</th>
                      <th className="px-5 py-3 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Total Classes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch) => (
                      <tr key={branch.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                        <td className="px-5 py-3 border-b border-gray-200 font-medium">{branch.name}</td>
                        <td className="px-5 py-3 border-b border-gray-200">{branch.students}</td>
                        <td className="px-5 py-3 border-b border-gray-200">{branch.teachers}</td>
                        <td className="px-5 py-3 border-b border-gray-200">{branch.classes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add New Tab Panel (6. Add new teacher, branch, and student) */}
          {activeTab === 'addNew' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">Add New Entry</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6 border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-inner">
                <ul className="flex list-none p-0 m-0 border-b border-gray-200 overflow-x-auto bg-gray-100">
                  <li
                    className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
                      ${addNewSubTab === 'addNewTeacher' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
                    onClick={() => setAddNewSubTab('addNewTeacher')}
                  >
                    Add Teacher
                  </li>
                  <li
                    className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
                      ${addNewSubTab === 'addNewBranch' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
                    onClick={() => setAddNewSubTab('addNewBranch')}
                  >
                    Add Branch
                  </li>
                  <li
                    className={`px-5 py-3 cursor-pointer font-semibold text-gray-600 whitespace-nowrap border-b-4 border-transparent transition-all duration-300 ease-in-out flex-shrink-0
                      ${addNewSubTab === 'addNewStudent' ? 'text-blue-600 border-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-blue-50'}`}
                    onClick={() => setAddNewSubTab('addNewStudent')}
                  >
                    Add Student
                  </li>
                </ul>

                <div className="p-6">
                  {/* Add Teacher Form */}
                  {addNewSubTab === 'addNewTeacher' && (
                    <div className="animate-fade-in">
                      <h3 className="text-2xl font-semibold text-gray-700 mb-5">Add New Teacher</h3>
                      <div className="mb-5">
                        <label htmlFor="new-teacher-name" className="block font-medium text-gray-700 mb-2">Teacher Name</label>
                        <input type="text" id="new-teacher-name" className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter teacher's full name" />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="new-teacher-classes" className="block font-medium text-gray-700 mb-2">Classes Taught (comma-separated)</label>
                        <input type="text" id="new-teacher-classes" className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Class 10 A, Class 11 Science" />
                        <p className="text-sm text-gray-500 mt-1">Separate multiple classes with commas.</p>
                      </div>
                      <div className="mb-5">
                        <label htmlFor="new-teacher-subjects" className="block font-medium text-gray-700 mb-2">Subjects Taught (comma-separated)</label>
                        <input type="text" id="new-teacher-subjects" className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Mathematics, Physics, Chemistry" />
                        <p className="text-sm text-gray-500 mt-1">Separate multiple subjects with commas.</p>
                      </div>
                      <div className="mb-5">
                        <label htmlFor="new-teacher-branch" className="block font-medium text-gray-700 mb-2">Assigned Branch</label>
                        <select id="new-teacher-branch" className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select branch</option>
                          {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                          ))}
                        </select>
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Add Teacher</button>
                    </div>
                  )}
                  {/* Add Branch Form */}
                  {addNewSubTab === 'addNewBranch' && (
                    <div className="animate-fade-in">
                      <h3 className="text-2xl font-semibold text-gray-700 mb-5">Add New Branch</h3>
                      <div className="mb-5">
                        <label htmlFor="new-branch-name" className="block font-medium text-gray-700 mb-2">Branch Name</label>
                        <input type="text" id="new-branch-name" className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter new branch name" />
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Add Branch</button>
                    </div>
                  )}
                  {/* Add Student Form */}
                  {addNewSubTab === 'addNewStudent' && (
                    <div className="animate-fade-in">
                      <h3 className="text-2xl font-semibold text-gray-700 mb-5">Add New Student</h3>
                      <div className="mb-5">
                        <label htmlFor="new-student-name" className="block font-medium text-gray-700 mb-2">Student Name</label>
                        <input type="text" id="new-student-name" className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter student's full name" />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="new-student-class" className="block font-medium text-gray-700 mb-2">Assign to Class</label>
                        <select id="new-student-class" className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select class</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                          ))}
                        </select>
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Add Student</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Roster Tab Panel (8. Roster details with class filter and highlighting) */}
          {activeTab === 'roster' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 pb-3 border-b border-gray-200">Weekly Class Roster</h2>
              <div className="mb-6">
                <label htmlFor="roster-class-filter" className="block font-medium text-gray-700 mb-2">Filter Roster by Class</label>
                <select
                  id="roster-class-filter"
                  className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedClass} // Reusing selectedClass state for roster filter
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Show all classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}> {/* Use class name for roster filter */}
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roster.map((daySchedule) => (
                  <div key={daySchedule.day} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                    <h3 className="mt-0 mb-5 text-gray-700 text-center text-2xl font-semibold">{daySchedule.day}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Time</th>
                            <th className="px-4 py-2 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Class</th>
                            <th className="px-4 py-2 text-left border-b border-gray-200 font-semibold text-gray-600 uppercase text-sm tracking-wider">Teacher / Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {daySchedule.slots
                            .filter(slot => selectedClass === '' || slot.class === selectedClass || slot.class === 'N/A')
                            .map((slot, index) => (
                              <tr
                                key={index}
                                className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100
                                  ${slot.teacher === 'UNASSIGNED' ? 'bg-red-50' :
                                    slot.teacher === 'FREE' ? 'bg-green-50' : ''
                                  }`}
                              >
                                <td className="px-4 py-2 border-b border-gray-200">{slot.time}</td>
                                <td className="px-4 py-2 border-b border-gray-200">{slot.class}</td>
                                <td className="px-4 py-2 border-b border-gray-200">
                                  {slot.teacher === 'UNASSIGNED' && <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-200 text-red-800">No Teacher Available</span>}
                                  {slot.teacher === 'FREE' && <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-green-200 text-green-800">Free Slot</span>}
                                  {slot.teacher !== 'UNASSIGNED' && slot.teacher !== 'FREE' && slot.teacher}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
