import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useToast } from "../context/ToastProvider";
import MuLogo from "../media/Images/logo.png";
import qTapLogo from "../media/Images/qtapBanner.png";
import StudentLogo from "../media/Images/studentLogo.png";
import dashboardServices from "../Services/dashboardServices";

const MainEventPage = () => {
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [htno, setHtno] = useState("");
  const [studentFetchLoading, setStudentFetchLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState({});
  const [loadingEventStats, setLoadingEventStats] = useState(false);

  // Example stats (you’ll fetch these from API based on eventId)
  const [eventStats, setEventStats] = useState({
    total_registrations: 0,
    total_attended: 0,
    moving_in: 0,
    moving_out: 0,
  });

  const getEvents = async () => {
    try {
      const response = await dashboardServices.getEventsData();
      console.log(response?.data);
      if (response?.status === 200) {
        setEvents(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const getLogo = () => {
    return `https://musecportal.s3.ap-south-1.amazonaws.com/${
      studentInfo?.batch
    }/${studentInfo?.htno?.toLowerCase()}.jpg`;
  };

  console.log({ studentInfo });

  const onClickGetStudentStatus = async () => {
    try {
      setStudentFetchLoading(true);
      const response = await dashboardServices.getStudentInfo(eventId, htno);
      if (response?.status === 200) {
        setStudentInfo(response?.data);
      } else if (response?.status === 404) {
        addToast(response?.data?.message || "Student not found", "error");
        setStudentInfo({});
      } else {
        addToast(response?.data?.message || "Something went wrong", "error");
        setStudentInfo({});
      }
    } catch (error) {
      addToast(error?.data?.message || "Something went wrong", "error");

      setStudentInfo({});
    } finally {
      setStudentFetchLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    const getEventStats = async () => {
      try {
        setLoadingEventStats(true);
        const response = await dashboardServices?.getEventStatsById(eventId);
        if (response?.status === 200) {
          setEventStats(response?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingEventStats(false);
      }
    };

    if (eventId) {
      // Fetch immediately when eventId changes
      getEventStats();

      // Then fetch every 5 seconds
      intervalId = setInterval(getEventStats, 5000);
    }

    return () => {
      // Cleanup interval on unmount or when eventId changes
      if (intervalId) clearInterval(intervalId);
    };
  }, [eventId]);

  const onClickRegisterStudent = async () => {
    try {
      const response = await dashboardServices.spotRegistration(
        studentInfo?.htno,
        eventId
      );
      if (response?.status === 200) {
        addToast(response?.data?.message || "Student registered!", "success");
      }
    } catch (error) {
      addToast(error?.data?.message || "Something went wrong", "error");
    } finally {
      onClickGetStudentStatus();
    }
  };

  const onClickMarkAttendance = async () => {
    try {
      const response = await dashboardServices.markManualAttendance(
        studentInfo?.htno,
        eventId
      );
      if (response?.status === 200) {
        console.log(response);

        addToast(
          response?.data?.message || "Student marked present!",
          "success"
        );
      }
    } catch (error) {
      addToast(error?.data?.message || "Something went wrong", "error");
    } finally {
      onClickGetStudentStatus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center bg-white rounded-xl shadow-sm px-6 py-4 mb-4">
        <img src={MuLogo} className="h-12 w-auto" alt="MU Logo" />
        <p className=" font-semibold text-2xl ">QTap Event Attendance</p>
        <img src={qTapLogo} className="h-8 w-auto" alt="QTap Logo" />
      </header>

      {/* Stats Section */}

      {eventId && (
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-5 rounded-xl shadow-sm text-center">
            <p className="text-xs uppercase text-gray-500">
              Total Registrations
            </p>
            <p className="text-2xl font-semibold text-gray-800">
              {eventStats.total_registrations}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm text-center">
            <p className="text-xs uppercase text-gray-500">Total Attended</p>
            <p className="text-2xl font-semibold text-gray-800">
              {eventStats.total_attended}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm text-center">
            <p className="text-xs uppercase text-gray-500">Moving In</p>
            <p className="text-2xl font-semibold text-blue-600">
              {eventStats.moving_in}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm text-center">
            <p className="text-xs uppercase text-gray-500">Moving Out</p>
            <p className="text-2xl font-semibold text-red-600">
              {eventStats.moving_out}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Left Panel */}
        <div className="w-[30%] flex flex-col gap-4">
          {/* Event Selector */}
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Event
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full p-2 focus:border-blue-500 focus:ring-blue-500 border-gray-300 text-sm rounded-lg"
            >
              <option value="">Choose an Event</option>
              {events.map((event) => (
                <option key={event.event_id} value={event.event_id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          {/* ID Number Search */}
          {eventId !== "" && (
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter ID Number Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ID Number"
                  value={htno}
                  onChange={(e) => setHtno(e.target.value)}
                  className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={onClickGetStudentStatus}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-[70%] bg-white rounded-xl shadow-sm  flex items-start pt-5 pl-5 justify-start">
          {eventId === "" ? (
            <p className="text-center text-gray-400 text-sm">
              Please select an event to get started
            </p>
          ) : studentFetchLoading ? (
            <div className="flex justify-center items-center p-5 w-full h-full">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          ) : Object.keys(studentInfo).length === 0 ? (
            <div className="flex flex-col items-center w-[80%]">
              <div className="h-full w-full">
                <p>No Student Found</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-[80%]">
              {/* Student Card */}
              <div className="w-full max-w-2xl border border-gray-200 rounded-2xl shadow-md bg-white p-8">
                {/* Header Section */}
                <div className="flex items-center gap-6 border-b border-gray-100 pb-6 mb-6">
                  <img
                    src={getLogo()}
                    alt="Student Photo"
                    className="w-28 h-28 rounded-lg object-cover border border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = StudentLogo;
                    }}
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {studentInfo.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {studentInfo.program} • Batch {studentInfo.batch}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      ID Number
                    </p>
                    <p className="font-medium text-gray-900">
                      {studentInfo.htno}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Registration
                    </p>
                    <p
                      className={`font-medium ${
                        studentInfo.registered
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {studentInfo.registered ? "Registered" : "Not Registered"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Check-In
                    </p>
                    <p
                      className={`font-medium ${
                        studentInfo.checked_in
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {studentInfo.checked_in ? "Checked In" : "Not Checked In"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Registration Type
                    </p>
                    <p className="font-medium text-gray-900">
                      {studentInfo.reg_type ? studentInfo.reg_type : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {!studentInfo?.registered && (
                <button
                  onClick={onClickRegisterStudent}
                  className="mt-6 w-[20%] max-w-2xl py-3 px-6 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-md transition"
                >
                  Register Student
                </button>
              )}
              {studentInfo?.registered && !studentInfo?.checked_in && (
                <button
                  onClick={onClickMarkAttendance}
                  className="mt-6 w-[20%] max-w-2xl py-3 px-6 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-md transition"
                >
                  Mark Attendance
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* <ToastContainer position="top-right" /> */}
    </div>
  );
};

export default MainEventPage;
