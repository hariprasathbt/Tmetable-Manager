"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  StickyNote,
  Sun,
  Moon,
  X,
} from "lucide-react";

const extractedPeriods = [
  {
    id: 1,
    day: "Monday",
    subject: "Data Structures",
    room: "CSE-204",
    start: "09:00",
    end: "09:50",
    color: "blue",
    note: "",
  },
  {
    id: 2,
    day: "Monday",
    subject: "Operating Systems",
    room: "CSE-204",
    start: "10:00",
    end: "10:50",
    color: "violet",
    note: "Revise process scheduling before Thursday.",
  },
  {
    id: 3,
    day: "Monday",
    subject: "Digital Electronics",
    room: "EEE-110",
    start: "11:10",
    end: "12:00",
    color: "amber",
    note: "",
  },
  {
    id: 4,
    day: "Monday",
    subject: "Lunch break",
    room: "—",
    start: "12:00",
    end: "13:00",
    color: "slate",
    note: "",
  },
  {
    id: 5,
    day: "Monday",
    subject: "Database Management",
    room: "LAB-3",
    start: "13:00",
    end: "13:50",
    color: "teal",
    note: "",
  },
];

const dailyThoughts = [
  "Small progress is still progress.",
  "You do not have to solve everything today.",
  "Consistency makes difficult things feel lighter.",
  "Give your attention to what matters most.",
  "A clear mind makes room for better ideas.",
  "Keep going. Your future self is taking notes.",
  "Rest is part of doing good work.",
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatIndiaTime() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

function formatIndiaDay() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  }).format(new Date());
}

function formatIndiaDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  return initials || "U";
}

export default function Page() {
  const [setup, setSetup] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [name, setName] = useState("Aarav Mehta");
  const [course, setCourse] = useState("Computer Science & Engineering");
  const [periods, setPeriods] = useState(extractedPeriods);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [reminder, setReminder] = useState("10");
  const [darkMode, setDarkMode] = useState(false)
  const [indiaTime, setIndiaTime] = useState("");
  const [indiaDay, setIndiaDay] = useState("");

  useEffect(() => {
    const updateIndiaTime = () => {
      setIndiaTime(formatIndiaTime());
      setIndiaDay(formatIndiaDay());
    };
    updateIndiaTime();
    const timer = window.setInterval(updateIndiaTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeNote = periods.find((period) => period.id === noteId);
  const indiaDateKey = formatIndiaDateKey();
  const thoughtIndex = [...indiaDateKey].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % dailyThoughts.length;
  const isSunday = indiaDay === "Sunday";
  const visiblePeriods = periods.filter(
    (period) => period.day.trim().toLowerCase() === indiaDay.toLowerCase(),
  );
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [],
  );
  const nextPeriod = visiblePeriods[0];
  const totalMinutes = visiblePeriods.reduce((total, period) => {
    const [startHour, startMinute] = period.start.split(":").map(Number);
    const [endHour, endMinute] = period.end.split(":").map(Number);
    return (
      total +
      Math.max(0, endHour * 60 + endMinute - (startHour * 60 + startMinute))
    );
  }, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  function openNote(id: number) {
    const period = periods.find((item) => item.id === id);
    setNoteId(id);
    setNoteDraft(period?.note || "");
  }

  function saveNote() {
    if (noteId === null) return;
    setPeriods((items) =>
      items.map((item) =>
        item.id === noteId ? { ...item, note: noteDraft } : item,
      ),
    );
    setNoteId(null);
  }

  function deleteNote() {
    if (noteId === null) return;
    setPeriods((items) =>
      items.map((item) => (item.id === noteId ? { ...item, note: "" } : item)),
    );
    setNoteDraft("");
    setNoteId(null);
  }

  function continueToDashboard() {
    if (name.trim() && course.trim()) {
      setSetup(false);
    }
  }

  function logOut() {
    setSetup(true);
    setActivePage("Dashboard");
  }

  if (setup) {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <div className="setup-brand">
            <div className="brand-mark">
              <CalendarDays size={19} />
            </div>
            <span>Timetable Manager</span>
          </div>
          <div className="setup-content">
            <div className="setup-copy">
              <span className="eyebrow">
                <Sparkles size={14} /> Let&apos;s get organized
              </span>
              <h1>
                Your day,
                <br />
                <em>in one view.</em>
              </h1>
              <p>
                Set up your timetable once and stay ahead of every class, room
                change, and note.
              </p>
            </div>
            <div className="setup-form">
              <div className="form-heading">
                <h2>Welcome aboard</h2>
                <p>Tell us a little about yourself to get started.</p>
              </div>
              <label>
                Student name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Mehta"
                />
              </label>
              <label>
                Course / branch
                <input
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                />
              </label>
              <button
                className="primary-button"
                onClick={continueToDashboard}
                disabled={!name.trim() || !course.trim()}
              >
                Continue to dashboard <span>→</span>
              </button>
              <p className="privacy">
                <span>⌁</span> You can edit subjects, days, and times later in
                Settings.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={darkMode ? "app-shell dark-mode" : "app-shell"}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <CalendarDays size={18} />
          </div>
          <span>Timetable Manager</span>
        </div>
        <div className="profile-mini">
          <div className="avatar">{getInitials(name)}</div>
          <div>
            <strong>{name}</strong>
            <small>{course.split(" ").slice(0, 3).join(" ")}...</small>
          </div>
          <MoreHorizontal size={17} />
        </div>
        <nav>
          <p className="nav-label">Workspace</p>
          {[
            ["Dashboard", LayoutDashboard],
            ["My timetable", CalendarDays],
            ["Notes", StickyNote],
          ].map(([label, Icon]) => (
            <button
              key={label as string}
              className={activePage === label ? "nav-item active" : "nav-item"}
              onClick={() => setActivePage(label as string)}
            >
              <Icon size={18} />
              {label as string}
              {label === "Notes" && <span className="nav-count">2</span>}
            </button>
          ))}
          <p className="nav-label second">Manage</p>
          <button
            className={
              activePage === "Settings" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActivePage("Settings")}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-card">
            <Sparkles size={16} />
            <div>
              <strong>Small steps, big wins.</strong>
              <span>Keep your notes up to date.</span>
            </div>
          </div>
          <button className="logout-button" onClick={logOut}>
            <LogOut size={16} /> Log out
          </button>
          <small className="version">Timetable Manager · v1.0</small>
        </div>
      </aside>
      <section className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-mark">
              <CalendarDays size={17} />
            </div>
          </div>
          <div className="top-actions">
            <div className="ist-clock" aria-label="Live India Standard Time">
              <span>Live IST</span>
              <strong>{indiaTime || "--:--:--"}</strong>
            </div>
            <button
              className="icon-button theme-button"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDarkMode((value) => !value)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button">
              <Bell size={18} />
              <i />
            </button>
            <div className="top-avatar">{getInitials(name)}</div>
          </div>
        </header>
        <div className="page-wrap">
          {activePage === "Settings" ? (
            <SettingsPage
              name={name}
              setName={setName}
              course={course}
              setCourse={setCourse}
              reminder={reminder}
              setReminder={setReminder}
            />
          ) : activePage === "My timetable" ? (
            <TimetablePage periods={periods} setPeriods={setPeriods} />
          ) : (
            <>
              <div className="page-title">
                <div>
                  <div className="breadcrumb">
                    Workspace <span>/</span> {activePage}
                  </div>
                  <h1>
                    {activePage === "Dashboard" ? (
                      <>
                        Good morning, {name.split(" ")[0]}{" "}
                        <span className="wave">✦</span>
                      </>
                    ) : (
                      activePage
                    )}
                  </h1>
                  <p>{today} · Here&apos;s what your day looks like.</p>
                </div>
                <button
                  className="outline-button"
                  onClick={() => setActivePage("My timetable")}
                >
                  <Pencil size={15} /> Edit timetable
                </button>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <Clock3 size={18} />
                  </div>
                  <span>Next class</span>
                  <strong>
                    {nextPeriod?.subject || "No classes scheduled"}
                  </strong>
                  <small>
                    {nextPeriod
                      ? `Starts at ${formatTime(nextPeriod.start)} · ${nextPeriod.room}`
                      : "Upload a timetable to get started"}
                  </small>
                </div>
                <div className="stat-card">
                  <div className="stat-icon violet">
                    <BookOpen size={18} />
                  </div>
                  <span>Today&apos;s classes</span>
                  <strong>{visiblePeriods.length} periods</strong>
                  <small>
                    {totalHours}h {String(remainingMinutes).padStart(2, "0")}m
                    of learning
                  </small>
                </div>
                <div className="stat-card">
                  <div className="stat-icon amber">
                    <StickyNote size={18} />
                  </div>
                  <span>My notes</span>
                  <strong>
                    {periods.filter((p) => p.note).length} saved notes
                  </strong>
                  <small>Keep your thoughts close by</small>
                </div>
              </div>
              <div className="content-grid">
                <section className="timetable-panel">
                  <div className="section-header">
                    <div>
                      <h2>
                        {isSunday ? "Sunday is a holiday" : `${indiaDay || "Today's"} timetable`}
                      </h2>
                      <p>
                        {isSunday
                          ? "No classes scheduled"
                          : `${indiaDay || "Today"} · ${visiblePeriods.length} scheduled periods`}
                      </p>
                    </div>
                  </div>
                  {!isSunday && visiblePeriods.length > 0 && (
                    <div className="period-list">
                    {visiblePeriods.map((period, index) => (
                      <article
                        className={`period-card ${index === 0 ? "next" : ""}`}
                        key={period.id}
                      >
                        <div className="period-time">
                          <strong>{formatTime(period.start)}</strong>
                          <span>{formatTime(period.end)}</span>
                        </div>
                        <div className={`period-dot ${period.color}`} />{" "}
                        <div className="period-info">
                          <div className="period-top">
                            <span>Period {index + 1}</span>
                            {index === 0 && (
                              <b className="upcoming">
                                <span /> Upcoming
                              </b>
                            )}
                          </div>
                          <h3>{period.subject}</h3>
                          <p>{period.room}</p>
                        </div>
                        <div className="period-action">
                          {period.note && (
                            <span className="note-indicator">
                              <StickyNote size={14} /> Note added
                            </span>
                          )}
                          <button
                            className="note-button"
                            onClick={() => openNote(period.id)}
                          >
                            <StickyNote size={15} />{" "}
                            {period.note ? "View note" : "Add note"}
                          </button>
                        </div>
                      </article>
                    ))}
                    </div>
                  )}
                  {isSunday && <div className="holiday-notice">
                    <strong>Sunday</strong>
                    <span>Holiday</span>
                    <small>Every Sunday</small>
                  </div>}
                  {!isSunday && visiblePeriods.length === 0 && (
                    <div className="empty-day">No classes scheduled for {indiaDay}.</div>
                  )}
                  {!isSunday && <button
                    className="add-period"
                    onClick={() => setActivePage("My timetable")}
                  >
                    <Plus size={16} /> Add a period
                  </button>}
                </section>
                <aside className="right-rail">
                  <div className="reminder-card">
                    <div className="reminder-head">
                      <div className="bell-round">
                        <Bell size={17} />
                      </div>
                      <span>Next reminder</span>
                      <button>
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                    <h3>{nextPeriod?.subject || "No upcoming class"}</h3>
                    <p>{nextPeriod?.room || "—"}</p>
                    <div className="reminder-time">
                      <strong>
                        {nextPeriod
                          ? formatTime(nextPeriod.start).split(" ")[0]
                          : "--:--"}
                      </strong>
                      <span>
                        {nextPeriod
                          ? formatTime(nextPeriod.start).split(" ")[1]
                          : ""}
                      </span>
                      <div>
                        <small>Starts in</small>
                        <b>42 min</b>
                      </div>
                    </div>
                    <div className="reminder-progress">
                      <span />
                    </div>
                    <small className="reminder-foot">
                      You&apos;ll be notified {reminder} minutes before
                    </small>
                  </div>
                  <div className="week-card thought-card">
                    <div className="section-header">
                      <div>
                        <h2>Daily thought</h2>
                        <p>A little encouragement for today</p>
                      </div>
                    </div>
                    <div className="thought-content">
                      <span className="thought-mark">“</span>
                      <blockquote>{dailyThoughts[thoughtIndex]}</blockquote>
                      <small>Today&apos;s reminder</small>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
      {noteId !== null && (
        <div className="modal-backdrop" onClick={() => setNoteId(null)}>
          <div className="note-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="eyebrow">Period note</span>
                <h2>{activeNote?.subject}</h2>
                <p>
                  {activeNote?.day} · Period {activeNote?.id} · {activeNote?.room}
                </p>
              </div>
              <button onClick={() => setNoteId(null)}>
                <X size={18} />
              </button>
            </div>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Add a note for this period..."
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="text-button"
                onClick={deleteNote}
              >
                Delete note
              </button>
              <button className="primary-button small" onClick={saveNote}>
                Save note
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function TimetablePage({ periods, setPeriods }: any) {
  const [saved, setSaved] = useState(false);

  function addPeriod() {
    setPeriods((items: any[]) => [
      ...items,
      {
        id:
          items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) +
          1,
        day: "Monday",
        subject: "New subject",
        room: "TBD",
        start: "14:00",
        end: "14:50",
        color: ["blue", "violet", "amber", "teal"][items.length % 4],
        note: "",
      },
    ]);
    setSaved(false);
  }

  return (
    <div className="settings-page">
      <div className="page-title">
        <div>
          <div className="breadcrumb">
            Workspace <span>/</span> My timetable
          </div>
          <h1>My timetable</h1>
          <p>Correct extracted details or add a new period.</p>
        </div>
      </div>
      <section className="settings-section timetable-settings">
        <div className="settings-section-head">
          <div className="settings-icon amber-bg">
            <CalendarDays size={17} />
          </div>
          <div>
            <h2>Timetable editor</h2>
            <p>Update your subjects and class timings.</p>
          </div>
          <button
            className="outline-button compact"
            onClick={addPeriod}
            type="button"
          >
            <Plus size={15} /> Add period
          </button>
        </div>
        <div className="editor-table">
          <div className="editor-row header">
            <span>Day</span>
            <span>Subject</span>
            <span>Start</span>
            <span>End</span>
            <span />
          </div>
          {periods.map((p: any, i: number) => (
            <div className="editor-row" key={p.id}>
              <input
                value={p.day}
                onChange={(e) =>
                  setPeriods((items: any[]) =>
                    items.map((x) =>
                      x.id === p.id ? { ...x, day: e.target.value } : x,
                    ),
                  )
                }
              />
              <input
                value={p.subject}
                onChange={(e) =>
                  setPeriods((items: any[]) =>
                    items.map((x) =>
                      x.id === p.id ? { ...x, subject: e.target.value } : x,
                    ),
                  )
                }
              />
              <input
                type="time"
                value={p.start}
                onChange={(e) =>
                  setPeriods((items: any[]) =>
                    items.map((x) =>
                      x.id === p.id ? { ...x, start: e.target.value } : x,
                    ),
                  )
                }
              />
              <input
                type="time"
                value={p.end}
                onChange={(e) =>
                  setPeriods((items: any[]) =>
                    items.map((x) =>
                      x.id === p.id ? { ...x, end: e.target.value } : x,
                    ),
                  )
                }
              />
              <button
                aria-label={`Delete period ${i + 1}`}
                onClick={() =>
                  setPeriods((items: any[]) =>
                    items.filter((x) => x.id !== p.id),
                  )
                }
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>
      <button
        className="primary-button save-settings"
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1800);
        }}
      >
        {saved ? (
          <>
            <Check size={16} /> Saved changes
          </>
        ) : (
          "Save changes"
        )}
      </button>
    </div>
  );
}

function SettingsPage({
  name,
  setName,
  course,
  setCourse,
  reminder,
  setReminder,
}: any) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="settings-page">
      <div className="page-title">
        <div>
          <div className="breadcrumb">
            Workspace <span>/</span> Settings
          </div>
          <h1>Settings</h1>
          <p>Manage your profile, timetable, and reminders.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="settings-section">
          <div className="settings-section-head">
            <div className="settings-icon">
              <Pencil size={17} />
            </div>
            <div>
              <h2>Profile</h2>
              <p>Update your personal information.</p>
            </div>
          </div>
          <div className="settings-fields">
            <label>
              Student name
              <input
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            </label>
            <label>
              Course / branch
              <input
                value={course}
                onChange={(e: any) => setCourse(e.target.value)}
              />
            </label>
          </div>
        </section>
        <section className="settings-section">
          <div className="settings-section-head">
            <div className="settings-icon violet-bg">
              <Bell size={17} />
            </div>
            <div>
              <h2>Notifications</h2>
              <p>Choose when you want to be reminded.</p>
            </div>
          </div>
          <div className="notification-row">
            <div>
              <strong>Period reminders</strong>
              <small>Get notified before your next class</small>
            </div>
            <div className="toggle on">
              <span />
            </div>
          </div>
          <label className="select-label">
            Remind me before
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            >
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="0">Never</option>
            </select>
          </label>
        </section>
      </div>
      <button
        className="primary-button save-settings"
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1800);
        }}
      >
        {saved ? (
          <>
            <Check size={16} /> Saved changes
          </>
        ) : (
          "Save changes"
        )}
      </button>
    </div>
  );
}
