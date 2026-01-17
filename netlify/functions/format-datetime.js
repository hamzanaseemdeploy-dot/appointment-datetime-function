exports.handler = async (event) => {
  const { appointment_datetime, appointment_duration_in_minutes } = JSON.parse(event.body);

  const durationInMinutes = parseInt(appointment_duration_in_minutes);
  
  let appointmentDateTime, appointmentDate, appointmentTime, timeMin, timeMax;

  // Check if the appointment datetime string ends with 'T00:00:00' to identify a date-only input.
  if (appointment_datetime.endsWith('T00:00:00')) {
    // Case 2: appointment_datetime is effectively a date-only input
    const appointmentDateOnly = appointment_datetime.split('T')[0];

    appointmentDateTime = `${appointmentDateOnly}T00:00:00`;
    appointmentDate = appointmentDateOnly;
    appointmentTime = "";
    timeMin = `${appointmentDateOnly}T00:00:00`;
    timeMax = `${appointmentDateOnly}T23:59:59`;

  } else {
    // Case 1: appointment_datetime includes a specific time
    const apptDt = new Date(appointment_datetime);
    const timeMaxDt = new Date(apptDt.getTime() + durationInMinutes * 60000);

    appointmentDateTime = appointment_datetime;
    appointmentDate = appointment_datetime.split('T')[0];
    appointmentTime = appointment_datetime.split('T')[1].slice(0, 8); // 'HH:mm:ss'
    timeMin = appointment_datetime;
    timeMax = timeMaxDt.toISOString().slice(0, 19);
  }

  const responseBody = {
    appointmentDateTime,
    appointmentDate,
    appointmentTime,
    appointmentDuration: appointment_duration_in_minutes,
    timeMin,
    timeMax
  };

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
};
