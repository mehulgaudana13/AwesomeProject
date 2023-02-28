export const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI2MGE5ZDUwYy0zODg0LTRlYWYtYjNlZi1iOTcwM2E5NTg0ZDYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY3Njk2MzQzNCwiZXhwIjoxNjc3NTY4MjM0fQ.sAkXlLUgjf9YCDGL1rrhV0qtJv7FY4kmUDtRST5L8d0';
// API call to create meeting
export const createMeeting = async ({token}) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: 'POST',
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    body: JSON.stringify({}),
  });

  const {roomId} = await res.json();
  return roomId;
};
