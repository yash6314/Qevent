import axios from "axios";
import { API_URL } from "../constants/api";
import { getAuthHeaders } from "./AuthHeaders";

const getTableRows = async () => {
  return await axios.get(
    `${API_URL}/getExpData`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

const getEventsData = async () => {
  return await axios.get(
    `${API_URL}/events`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

const getEventStatsById = async (id) => {
  return await axios.get(
    `${API_URL}/stats?event_id=${id}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

const getStudentInfo = async (id, htno) => {
  return await axios.get(
    `${API_URL}/student-info?event_id=${id}&htno=${htno}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

const spotRegistration = async (htno, eventId) => {
  return await axios.get(
    `${API_URL}/spotregistration?htno=${htno}&event_id=${eventId}&type=Spot`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

const markManualAttendance = async (htno, eventId) => {
  return await axios.get(
    `${API_URL}/mark-attendance-manual?event_id=${eventId}&htno=${htno}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
};

const dashboardServices = {
  getTableRows,
  getEventsData,
  getEventStatsById,
  spotRegistration,
  getStudentInfo,
  markManualAttendance,
};

export default dashboardServices;
