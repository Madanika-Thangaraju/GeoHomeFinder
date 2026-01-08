// const BASE_URL = 'http://YOUR_IP:3000/api';

// export const getOwnerProfile = async (token: string) => {
//   try {
//     const res = await fetch(`${BASE_URL}/owner/profile`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       }
//     });

//     if (!res.ok) {
//       throw new Error(`API Error: ${res.status} ${res.statusText}`);
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error('getOwnerProfile error:', error);
//     throw error;
//   }
// };

// export const updateOwnerProfile = async (token: string, data: any) => {
//   try {
//     const res = await fetch(`${BASE_URL}/owner/profile`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(data)
//     });

//     if (!res.ok) {
//       throw new Error(`API Error: ${res.status} ${res.statusText}`);
//     }

//     const responseData = await res.json();
//     return responseData;
//   } catch (error) {
//     console.error('updateOwnerProfile error:', error);
//     throw error;
//   }
// };

// export const updatePushSetting = async (token: string, pushEnabled: boolean) => {
//   try {
//     const res = await fetch(`${BASE_URL}/owner/push`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ pushEnabled })
//     });

//     if (!res.ok) {
//       throw new Error(`API Error: ${res.status} ${res.statusText}`);
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error('updatePushSetting error:', error);
//     throw error;
//   }
// };