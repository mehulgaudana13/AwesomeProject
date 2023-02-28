export const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI2MGE5ZDUwYy0zODg0LTRlYWYtYjNlZi1iOTcwM2E5NTg0ZDYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY3NzU4MTMwNiwiZXhwIjoxNjc4MTg2MTA2fQ.q6TA_iBJWII2ZH_35vbyN6s_qhsDcSyuTShXqWwZfXo';
// API call to create meeting
export const createMeeting = async ({token}) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: 'POST',
    headers: {Authorization: token, 'Content-Type': 'application/json'},
    body: JSON.stringify({}),
  });

  const {roomId} = await res.json();
  console.log('roomId', roomId);
  return roomId;
};
